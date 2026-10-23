"use server";

import { redirect } from "next/navigation";
import { assertPermission, getCurrentUser, hasPermission, logActivity, requireAdmin } from "@/lib/auth";
import { getArticleById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import { excerpt } from "@/lib/utils";
import {
  checked,
  flashUrl,
  initialActionState,
  nullableText,
  text,
  uniqueSlug,
  type ActionState,
} from "./shared";

export async function saveArticleAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const id = text(formData, "id");
  const existing = id ? getArticleById(id) : undefined;
  if (id && !existing) return { error: "Berita tidak ditemukan." };

  if (existing) {
    assertPermission(user, "articles.edit");
    if (existing.status === "published" && !hasPermission(user, "articles.publish")) {
      return { error: "Anda tidak memiliki izin menyunting berita yang sudah terbit." };
    }
  } else {
    assertPermission(user, "articles.create");
  }

  const title = text(formData, "title");
  const category = text(formData, "category") || "Warta Keuskupan";
  const content = text(formData, "content");
  const rawExcerpt = text(formData, "excerpt");
  const requestedStatus = text(formData, "status") || "draft";
  const status = ["draft", "published", "archived"].includes(requestedStatus)
    ? requestedStatus
    : "draft";

  if (!title) return { error: "Judul berita wajib diisi." };
  if (!content) return { error: "Isi berita wajib diisi." };
  if (status === "published" && !hasPermission(user, "articles.publish")) {
    return { error: "Anda tidak memiliki izin menerbitkan berita. Simpan sebagai draf." };
  }

  const db = getDb();
  const slug = uniqueSlug("articles", text(formData, "slug") || title, title, id || undefined);
  const stamp = new Date().toISOString();
  const publishedAt =
    status === "published"
      ? existing?.published_at || stamp
      : existing?.published_at || null;

  if (existing) {
    db.prepare(
      `UPDATE articles SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?,
       cover_image = ?, status = ?, featured = ?, published_at = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      title,
      slug,
      rawExcerpt || excerpt(content, 180),
      content,
      category,
      nullableText(formData, "cover_image"),
      status,
      checked(formData, "featured") ? 1 : 0,
      publishedAt,
      stamp,
      id,
    );
    logActivity(user, "Memperbarui berita", "articles", id, title);
  } else {
    const newArticleId = newId("art");
    db.prepare(
      `INSERT INTO articles
       (id, title, slug, excerpt, content, category, cover_image, author_id, status, featured,
        published_at, created_at, updated_at, views)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    ).run(
      newArticleId,
      title,
      slug,
      rawExcerpt || excerpt(content, 180),
      content,
      category,
      nullableText(formData, "cover_image"),
      user.id,
      status,
      checked(formData, "featured") ? 1 : 0,
      publishedAt,
      stamp,
      stamp,
    );
    logActivity(user, status === "published" ? "Menerbitkan berita" : "Membuat draf berita", "articles", newArticleId, title);
  }

  redirect(flashUrl("/admin/berita", existing ? "Berita berhasil diperbarui." : "Berita berhasil dibuat."));
}

export async function deleteArticleAction(formData: FormData) {
  const user = await requireAdmin("articles.delete");
  const id = text(formData, "id");
  const article = getArticleById(id);
  if (!article) redirect(flashUrl("/admin/berita", "Berita tidak ditemukan.", true));
  getDb().prepare("DELETE FROM articles WHERE id = ?").run(id);
  logActivity(user, "Menghapus berita", "articles", id, article.title);
  redirect(flashUrl("/admin/berita", "Berita berhasil dihapus."));
}

export async function toggleFeaturedAction(formData: FormData) {
  const user = await requireAdmin("articles.edit");
  const id = text(formData, "id");
  const article = getArticleById(id);
  if (!article) redirect(flashUrl("/admin/berita", "Berita tidak ditemukan.", true));
  const next = article.featured ? 0 : 1;
  getDb().prepare("UPDATE articles SET featured = ?, updated_at = ? WHERE id = ?").run(next, new Date().toISOString(), id);
  logActivity(user, next ? "Menandai berita utama" : "Melepas berita utama", "articles", id, article.title);
  redirect(flashUrl("/admin/berita", next ? "Berita ditandai sebagai berita utama." : "Berita utama diperbarui."));
}
