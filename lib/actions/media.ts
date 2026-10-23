"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getGalleryById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import {
  flashUrl,
  initialActionState,
  nullableText,
  text,
  type ActionState,
} from "./shared";

function validImage(value: string) {
  return value.startsWith("/") || /^https?:\/\//.test(value);
}

export async function saveGalleryAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("media.manage");
  const id = text(formData, "id");
  const existing = id ? getGalleryById(id) : undefined;
  if (id && !existing) return { error: "Foto tidak ditemukan." };

  const title = text(formData, "title");
  const image = text(formData, "image");
  const album = text(formData, "album") || "Umum";
  if (!title) return { error: "Judul foto wajib diisi." };
  if (!image) return { error: "Gambar wajib diunggah atau diisi URL-nya." };
  if (!validImage(image)) return { error: "URL gambar tidak valid." };

  const db = getDb();
  if (existing) {
    db.prepare(
      "UPDATE galleries SET title = ?, image = ?, caption = ?, album = ? WHERE id = ?",
    ).run(title, image, nullableText(formData, "caption"), album, id);
    logActivity(user, "Memperbarui foto galeri", "galleries", id, title);
  } else {
    const newGalleryId = newId("gal");
    db.prepare(
      "INSERT INTO galleries (id, title, image, caption, album, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ).run(newGalleryId, title, image, nullableText(formData, "caption"), album, new Date().toISOString());
    logActivity(user, "Menambahkan foto galeri", "galleries", newGalleryId, title);
  }

  redirect(flashUrl("/admin/galeri", existing ? "Foto berhasil diperbarui." : "Foto berhasil ditambahkan."));
}

export async function deleteGalleryAction(formData: FormData) {
  const user = await requireAdmin("media.manage");
  const id = text(formData, "id");
  const item = getGalleryById(id);
  if (!item) redirect(flashUrl("/admin/galeri", "Foto tidak ditemukan.", true));
  getDb().prepare("DELETE FROM galleries WHERE id = ?").run(id);
  logActivity(user, "Menghapus foto galeri", "galleries", id, item.title);
  redirect(flashUrl("/admin/galeri", "Foto berhasil dihapus."));
}
