"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, createSession, destroySession, logActivity, permissionsForRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { User } from "@/lib/types";
import { safeReturnTo } from "@/lib/utils";
import { initialActionState, type ActionState, text } from "./shared";

export async function loginAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const returnTo = safeReturnTo(text(formData, "returnTo") || undefined, "/admin");
  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }
  const db = getDb();
  const user = db
    .prepare("SELECT * FROM users WHERE lower(email) = ?")
    .get(email) as User | undefined;
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "Email atau kata sandi tidak sesuai." };
  }
  if (!user.active) {
    return { error: "Akun ini sedang dinonaktifkan. Hubungi pengurus keuskupan." };
  }

  const stamp = new Date().toISOString();
  db.prepare("UPDATE users SET last_login = ? WHERE id = ?").run(stamp, user.id);
  await createSession(user.id);
  logActivity(user, "Masuk ke panel", "auth", user.id, "Sesi baru dibuat.");

  const permissions = permissionsForRole(user.role);
  if (!permissions.includes("dashboard.view")) {
    redirect("/admin/akses-terbatas");
  }
  redirect(returnTo);
}

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    logActivity(user, "Keluar dari panel", "auth", user.id, "Sesi diakhiri.");
  }
  await destroySession();
  redirect("/admin/login");
}

export async function updateAccountAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const name = text(formData, "name");
  const title = text(formData, "title");
  const phone = text(formData, "phone");
  const bio = text(formData, "bio");
  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!name) return { error: "Nama wajib diisi." };
  if (newPassword) {
    if (newPassword.length < 8) {
      return { error: "Kata sandi baru minimal 8 karakter." };
    }
    if (newPassword !== confirmPassword) {
      return { error: "Konfirmasi kata sandi tidak cocok." };
    }
    const db = getDb();
    const record = db
      .prepare("SELECT password_hash FROM users WHERE id = ?")
      .get(user.id) as { password_hash: string } | undefined;
    if (!record || !verifyPassword(currentPassword, record.password_hash)) {
      return { error: "Kata sandi saat ini tidak sesuai." };
    }
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
      hashPassword(newPassword),
      user.id,
    );
  }

  const db = getDb();
  db.prepare(
    "UPDATE users SET name = ?, title = ?, phone = ?, bio = ? WHERE id = ?",
  ).run(name, title || null, phone || null, bio || null, user.id);
  if (newPassword) {
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
    await createSession(user.id);
  }
  logActivity({ id: user.id, name }, "Memperbarui akun", "users", user.id, null);
  return { success: "Profil Anda berhasil diperbarui." };
}

export async function updateOwnAvatarAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const avatar = text(formData, "avatar");
  if (avatar && !avatar.startsWith("/") && !/^https?:\/\//.test(avatar)) {
    return { error: "URL foto tidak valid." };
  }
  getDb()
    .prepare("UPDATE users SET avatar = ? WHERE id = ?")
    .run(avatar || null, user.id);
  logActivity({ id: user.id, name: user.name }, "Memperbarui foto profil", "users", user.id, null);
  return { success: "Foto profil diperbarui." };
}
