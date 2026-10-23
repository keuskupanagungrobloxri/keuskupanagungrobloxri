"use server";

import { redirect } from "next/navigation";
import {
  assertPermission,
  logActivity,
  requireAdmin,
} from "@/lib/auth";
import { getUserById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { canManageUserRole } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import {
  checked,
  flashUrl,
  initialActionState,
  isEmail,
  text,
  type ActionState,
} from "./shared";

const ROLES_ALLOWED = [
  "umat",
  "frater",
  "diakon",
  "imam",
  "uskup",
  "kardinal",
  "nunsius",
  "pengurus",
  "owner",
];

export async function saveUserAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAdmin("users.manage");
  const id = text(formData, "id");
  const existing = id ? getUserById(id) : undefined;
  if (id && !existing) return { error: "Pengguna tidak ditemukan." };

  const name = text(formData, "name");
  const email = text(formData, "email").toLowerCase();
  const role = text(formData, "role") as Role;
  const title = text(formData, "title");
  const phone = text(formData, "phone");
  const bio = text(formData, "bio");
  const password = String(formData.get("password") ?? "");
  const active = checked(formData, "active") ? 1 : 0;

  if (!name) return { error: "Nama pengguna wajib diisi." };
  if (!isEmail(email)) return { error: "Format email tidak valid." };
  if (!ROLES_ALLOWED.includes(role)) return { error: "Peran pengguna tidak valid." };
  if (existing && !canManageUserRole(actor.role, existing.role)) {
    return { error: "Anda tidak berwenang mengelola akun dengan peran ini." };
  }
  if (!canManageUserRole(actor.role, role)) {
    return { error: "Anda tidak berwenang memberikan peran ini." };
  }
  if (existing && actor.id === existing.id) {
    if (role !== existing.role) return { error: "Anda tidak dapat mengubah peran akun sendiri." };
    if (!active) return { error: "Anda tidak dapat menonaktifkan akun sendiri." };
  }
  if (existing && existing.role === "owner" && actor.role !== "owner") {
    return { error: "Akun Holder Keuskupan hanya dapat dikelola oleh Holder." };
  }

  const db = getDb();
  const duplicate = db
    .prepare("SELECT id FROM users WHERE lower(email) = ? AND id != ?")
    .get(email, id || "") as { id: string } | undefined;
  if (duplicate) return { error: "Email sudah digunakan oleh akun lain." };

  if (!existing) {
    if (password.length < 8) return { error: "Kata sandi awal minimal 8 karakter." };
    const { newId } = await import("@/lib/password");
    const userId = newId("usr");
    db.prepare(
      `INSERT INTO users (id, name, email, password_hash, role, title, bio, avatar, phone, active, created_at, last_login)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    ).run(
      userId,
      name,
      email,
      hashPassword(password),
      role,
      title || null,
      bio || null,
      null,
      phone || null,
      active,
      new Date().toISOString(),
    );
    logActivity(actor, "Membuat akun pengguna", "users", userId, `${name} · ${role}`);
  } else {
    if (password && password.length < 8) {
      return { error: "Kata sandi baru minimal 8 karakter." };
    }
    db.prepare(
      "UPDATE users SET name = ?, email = ?, role = ?, title = ?, bio = ?, phone = ?, active = ? WHERE id = ?",
    ).run(name, email, role, title || null, bio || null, phone || null, active, id);
    if (password) {
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
        hashPassword(password),
        id,
      );
      db.prepare("DELETE FROM sessions WHERE user_id = ?").run(id);
    }
    logActivity(
      actor,
      "Memperbarui akun pengguna",
      "users",
      id,
      `${name} · ${role}${password ? " · kata sandi diatur ulang" : ""}`,
    );
  }

  redirect(flashUrl("/admin/pengguna", existing ? "Akun berhasil diperbarui." : "Akun berhasil dibuat."));
}

export async function resetUserPasswordAction(formData: FormData) {
  const actor = await requireAdmin("users.manage");
  const id = text(formData, "id");
  const password = String(formData.get("new_password") ?? "");
  const target = getUserById(id);
  if (!target) redirect(flashUrl("/admin/pengguna", "Pengguna tidak ditemukan.", true));
  if (!canManageUserRole(actor.role, target.role)) {
    redirect(flashUrl("/admin/pengguna", "Anda tidak berwenang mengatur akun ini.", true));
  }
  if (password.length < 8) {
    redirect(flashUrl(`/admin/pengguna/${id}`, "Kata sandi minimal 8 karakter.", true));
  }
  getDb().prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(password), id);
  getDb().prepare("DELETE FROM sessions WHERE user_id = ?").run(id);
  logActivity(actor, "Mengatur ulang kata sandi", "users", id, target.name);
  redirect(flashUrl(`/admin/pengguna/${id}`, "Kata sandi berhasil diatur ulang."));
}

export async function toggleUserActiveAction(formData: FormData) {
  const actor = await requireAdmin("users.manage");
  const id = text(formData, "id");
  const target = getUserById(id);
  if (!target) redirect(flashUrl("/admin/pengguna", "Pengguna tidak ditemukan.", true));
  if (target.id === actor.id) {
    redirect(flashUrl("/admin/pengguna", "Anda tidak dapat menonaktifkan akun sendiri.", true));
  }
  if (!canManageUserRole(actor.role, target.role)) {
    redirect(flashUrl("/admin/pengguna", "Anda tidak berwenang mengelola akun ini.", true));
  }
  const next = target.active ? 0 : 1;
  getDb().prepare("UPDATE users SET active = ? WHERE id = ?").run(next, id);
  if (!next) getDb().prepare("DELETE FROM sessions WHERE user_id = ?").run(id);
  logActivity(actor, next ? "Mengaktifkan akun" : "Menonaktifkan akun", "users", id, target.name);
  redirect(flashUrl("/admin/pengguna", next ? "Akun diaktifkan." : "Akun dinonaktifkan."));
}

export async function saveRoleMatrixAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const actor = await requireAdmin("roles.manage");
  assertPermission(actor, "roles.manage");

  const { ALL_PERMISSIONS, ROLES } = await import("@/lib/permissions");
  const db = getDb();
  const targetRoles = ROLES.filter((role) => role !== "owner");

  for (const role of targetRoles) {
    const selected = ALL_PERMISSIONS.filter((permission) =>
      formData.get(`perm_${role}_${permission}`),
    );
    if (role === "pengurus" && !selected.includes("dashboard.view")) {
      return { error: "Peran Pengurus Keuskupan harus memiliki akses dasbor." };
    }
    db.prepare("DELETE FROM role_permissions WHERE role = ?").run(role);
    const insert = db.prepare(
      "INSERT INTO role_permissions (role, permission) VALUES (?, ?)",
    );
    for (const permission of selected) insert.run(role, permission);
  }

  logActivity(actor, "Memperbarui matriks peran", "roles", null, "Hak akses peran disesuaikan");
  redirect(flashUrl("/admin/peran", "Matriks peran berhasil diperbarui."));
}
