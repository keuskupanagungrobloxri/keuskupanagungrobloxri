"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getEventById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import { normalizeDateTimeInput } from "@/lib/utils";
import {
  flashUrl,
  initialActionState,
  nullableText,
  text,
  uniqueSlug,
  type ActionState,
} from "./shared";

export async function saveEventAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("events.manage");
  const id = text(formData, "id");
  const existing = id ? getEventById(id) : undefined;
  if (id && !existing) return { error: "Agenda tidak ditemukan." };

  const title = text(formData, "title");
  const description = text(formData, "description");
  const location = text(formData, "location");
  const startAt = normalizeDateTimeInput(text(formData, "start_at"));
  const endAt = normalizeDateTimeInput(text(formData, "end_at"));
  const category = text(formData, "category") || "Pastoral";
  const requestedStatus = text(formData, "status") || "upcoming";
  const status = ["upcoming", "ongoing", "done", "draft"].includes(requestedStatus)
    ? requestedStatus
    : "upcoming";

  if (!title) return { error: "Nama agenda wajib diisi." };
  if (!description) return { error: "Deskripsi agenda wajib diisi." };
  if (!location) return { error: "Lokasi agenda wajib diisi." };
  if (!startAt) return { error: "Waktu mulai wajib diisi." };
  if (endAt && new Date(endAt) < new Date(startAt)) {
    return { error: "Waktu selesai tidak boleh sebelum waktu mulai." };
  }

  const db = getDb();
  const slug = uniqueSlug("events", text(formData, "slug") || title, title, id || undefined);
  const stamp = new Date().toISOString();

  if (existing) {
    db.prepare(
      `UPDATE events SET title = ?, slug = ?, description = ?, location = ?, start_at = ?,
       end_at = ?, category = ?, image = ?, status = ?, updated_at = ? WHERE id = ?`,
    ).run(
      title,
      slug,
      description,
      location,
      startAt,
      endAt,
      category,
      nullableText(formData, "image"),
      status,
      stamp,
      id,
    );
    logActivity(user, "Memperbarui agenda", "events", id, title);
  } else {
    const newEventId = newId("evt");
    db.prepare(
      `INSERT INTO events
       (id, title, slug, description, location, start_at, end_at, category, image, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      newEventId,
      title,
      slug,
      description,
      location,
      startAt,
      endAt,
      category,
      nullableText(formData, "image"),
      status,
      stamp,
      stamp,
    );
    logActivity(user, "Membuat agenda", "events", newEventId, title);
  }

  redirect(flashUrl("/admin/agenda", existing ? "Agenda berhasil diperbarui." : "Agenda berhasil dibuat."));
}

export async function deleteEventAction(formData: FormData) {
  const user = await requireAdmin("events.manage");
  const id = text(formData, "id");
  const event = getEventById(id);
  if (!event) redirect(flashUrl("/admin/agenda", "Agenda tidak ditemukan.", true));
  getDb().prepare("DELETE FROM events WHERE id = ?").run(id);
  logActivity(user, "Menghapus agenda", "events", id, event.title);
  redirect(flashUrl("/admin/agenda", "Agenda berhasil dihapus."));
}
