"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getClergyById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import {
  flashUrl,
  initialActionState,
  numberValue,
  nullableText,
  text,
  uniqueSlug,
  type ActionState,
} from "./shared";

export async function saveClergyAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("clergy.manage");
  const id = text(formData, "id");
  const existing = id ? getClergyById(id) : undefined;
  if (id && !existing) return { error: "Data klerus tidak ditemukan." };

  const name = text(formData, "name");
  const title = text(formData, "title");
  const rank = text(formData, "rank");
  const assignment = text(formData, "assignment");
  const bio = text(formData, "bio");
  const requestedStatus = text(formData, "status") || "active";
  const status = ["active", "emeritus", "inactive"].includes(requestedStatus)
    ? requestedStatus
    : "active";

  if (!name) return { error: "Nama klerus wajib diisi." };
  if (!title) return { error: "Jabatan wajib diisi." };
  if (!rank) return { error: "Jenis panggilan wajib dipilih." };
  if (!bio) return { error: "Biografi singkat wajib diisi." };

  const db = getDb();
  const slug = uniqueSlug("clergy", text(formData, "slug") || name, name, id || undefined);

  if (existing) {
    db.prepare(
      `UPDATE clergy SET name = ?, slug = ?, title = ?, rank = ?, assignment = ?, bio = ?,
       image = ?, email = ?, status = ?, order_index = ? WHERE id = ?`,
    ).run(
      name,
      slug,
      title,
      rank,
      assignment || null,
      bio,
      nullableText(formData, "image"),
      nullableText(formData, "email"),
      status,
      numberValue(formData, "order_index", 99),
      id,
    );
    logActivity(user, "Memperbarui data klerus", "clergy", id, name);
  } else {
    const newClergyId = newId("clr");
    db.prepare(
      `INSERT INTO clergy
       (id, name, slug, title, rank, assignment, bio, image, email, status, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      newClergyId,
      name,
      slug,
      title,
      rank,
      assignment || null,
      bio,
      nullableText(formData, "image"),
      nullableText(formData, "email"),
      status,
      numberValue(formData, "order_index", 99),
    );
    logActivity(user, "Menambahkan data klerus", "clergy", newClergyId, name);
  }

  redirect(flashUrl("/admin/klerus", existing ? "Data klerus berhasil diperbarui." : "Data klerus berhasil ditambahkan."));
}

export async function deleteClergyAction(formData: FormData) {
  const user = await requireAdmin("clergy.manage");
  const id = text(formData, "id");
  const clergy = getClergyById(id);
  if (!clergy) redirect(flashUrl("/admin/klerus", "Data klerus tidak ditemukan.", true));
  getDb().prepare("DELETE FROM clergy WHERE id = ?").run(id);
  logActivity(user, "Menghapus data klerus", "clergy", id, clergy.name);
  redirect(flashUrl("/admin/klerus", "Data klerus berhasil dihapus."));
}
