"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getAnnouncementById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import { normalizeDateTimeInput } from "@/lib/utils";
import {
  checked,
  flashUrl,
  initialActionState,
  text,
  type ActionState,
} from "./shared";

export async function saveAnnouncementAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("announcements.manage");
  const id = text(formData, "id");
  const existing = id ? getAnnouncementById(id) : undefined;
  if (id && !existing) return { error: "Pengumuman tidak ditemukan." };

  const title = text(formData, "title");
  const message = text(formData, "message");
  const requestedTone = text(formData, "tone") || "info";
  const tone = ["info", "important", "liturgy"].includes(requestedTone)
    ? requestedTone
    : "info";
  const active = checked(formData, "active") ? 1 : 0;
  const startsAt = normalizeDateTimeInput(text(formData, "starts_at"));
  const endsAt = normalizeDateTimeInput(text(formData, "ends_at"));

  if (!title) return { error: "Judul pengumuman wajib diisi." };
  if (!message) return { error: "Isi pengumuman wajib diisi." };
  if (startsAt && endsAt && new Date(endsAt) < new Date(startsAt)) {
    return { error: "Waktu berakhir tidak boleh sebelum waktu mulai." };
  }

  const db = getDb();
  if (existing) {
    db.prepare(
      `UPDATE announcements SET title = ?, message = ?, tone = ?, active = ?,
       starts_at = ?, ends_at = ? WHERE id = ?`,
    ).run(title, message, tone, active, startsAt, endsAt, id);
    logActivity(user, "Memperbarui pengumuman", "announcements", id, title);
  } else {
    const newIdValue = newId("ann");
    db.prepare(
      `INSERT INTO announcements (id, title, message, tone, active, starts_at, ends_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(newIdValue, title, message, tone, active, startsAt, endsAt, new Date().toISOString());
    logActivity(user, "Membuat pengumuman", "announcements", newIdValue, title);
  }

  redirect(flashUrl("/admin/pengumuman", existing ? "Pengumuman berhasil diperbarui." : "Pengumuman berhasil dibuat."));
}

export async function toggleAnnouncementAction(formData: FormData) {
  const user = await requireAdmin("announcements.manage");
  const id = text(formData, "id");
  const item = getAnnouncementById(id);
  if (!item) redirect(flashUrl("/admin/pengumuman", "Pengumuman tidak ditemukan.", true));
  const next = item.active ? 0 : 1;
  getDb().prepare("UPDATE announcements SET active = ? WHERE id = ?").run(next, id);
  logActivity(user, next ? "Mengaktifkan pengumuman" : "Menonaktifkan pengumuman", "announcements", id, item.title);
  redirect(flashUrl("/admin/pengumuman", next ? "Pengumuman diaktifkan." : "Pengumuman dinonaktifkan."));
}

export async function deleteAnnouncementAction(formData: FormData) {
  const user = await requireAdmin("announcements.manage");
  const id = text(formData, "id");
  const item = getAnnouncementById(id);
  if (!item) redirect(flashUrl("/admin/pengumuman", "Pengumuman tidak ditemukan.", true));
  getDb().prepare("DELETE FROM announcements WHERE id = ?").run(id);
  logActivity(user, "Menghapus pengumuman", "announcements", id, item.title);
  redirect(flashUrl("/admin/pengumuman", "Pengumuman berhasil dihapus."));
}
