"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getPageById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import {
  flashUrl,
  initialActionState,
  text,
  uniqueSlug,
  type ActionState,
} from "./shared";

export async function savePageAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("pages.manage");
  const id = text(formData, "id");
  const existing = id ? getPageById(id) : undefined;
  if (id && !existing) return { error: "Halaman tidak ditemukan." };

  const title = text(formData, "title");
  const subtitle = text(formData, "subtitle");
  const content = text(formData, "content");
  const requestedStatus = text(formData, "status") || "published";
  const status = ["draft", "published"].includes(requestedStatus)
    ? requestedStatus
    : "draft";

  if (!title) return { error: "Judul halaman wajib diisi." };
  if (!subtitle) return { error: "Subjudul halaman wajib diisi." };
  if (!content) return { error: "Isi halaman wajib diisi." };
  if (existing?.slug === "profil" && status !== "published") {
    return { error: "Halaman profil utama harus tetap terbit." };
  }

  const db = getDb();
  const slug = uniqueSlug("pages", text(formData, "slug") || title, title, id || undefined);
  const stamp = new Date().toISOString();

  if (existing) {
    db.prepare(
      "UPDATE pages SET title = ?, slug = ?, subtitle = ?, content = ?, status = ?, updated_at = ? WHERE id = ?",
    ).run(title, slug, subtitle, content, status, stamp, id);
    logActivity(user, "Memperbarui halaman", "pages", id, title);
  } else {
    const newPageId = newId("pg");
    db.prepare(
      `INSERT INTO pages (id, title, slug, subtitle, content, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(newPageId, title, slug, subtitle, content, status, stamp, stamp);
    logActivity(user, "Membuat halaman", "pages", newPageId, title);
  }

  redirect(flashUrl("/admin/halaman", existing ? "Halaman berhasil diperbarui." : "Halaman berhasil dibuat."));
}

export async function deletePageAction(formData: FormData) {
  const user = await requireAdmin("pages.manage");
  const id = text(formData, "id");
  const page = getPageById(id);
  if (!page) redirect(flashUrl("/admin/halaman", "Halaman tidak ditemukan.", true));
  if (["profil", "sejarah", "visi-misi"].includes(page.slug)) {
    redirect(flashUrl("/admin/halaman", "Halaman inti keuskupan tidak dapat dihapus.", true));
  }
  getDb().prepare("DELETE FROM pages WHERE id = ?").run(id);
  logActivity(user, "Menghapus halaman", "pages", id, page.title);
  redirect(flashUrl("/admin/halaman", "Halaman berhasil dihapus."));
}
