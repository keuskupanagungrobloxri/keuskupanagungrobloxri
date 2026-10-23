"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getParishById } from "@/lib/admin-data";
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

export async function saveParishAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("parishes.manage");
  const id = text(formData, "id");
  const existing = id ? getParishById(id) : undefined;
  if (id && !existing) return { error: "Paroki tidak ditemukan." };

  const name = text(formData, "name");
  const patron = text(formData, "patron");
  const vicariate = text(formData, "vicariate");
  const address = text(formData, "address");
  const city = text(formData, "city");
  const description = text(formData, "description");
  const requestedStatus = text(formData, "status") || "active";
  const status = ["active", "inactive"].includes(requestedStatus)
    ? requestedStatus
    : "active";

  if (!name) return { error: "Nama paroki wajib diisi." };
  if (!patron) return { error: "Nama pelindung paroki wajib diisi." };
  if (!vicariate) return { error: "Kevikepan wajib diisi." };
  if (!address) return { error: "Alamat wajib diisi." };
  if (!city) return { error: "Kota wajib diisi." };
  if (!description) return { error: "Deskripsi paroki wajib diisi." };

  const db = getDb();
  const slug = uniqueSlug("parishes", text(formData, "slug") || name, name, id || undefined);
  const stamp = new Date().toISOString();

  if (existing) {
    db.prepare(
      `UPDATE parishes SET name = ?, slug = ?, patron = ?, vicariate = ?, address = ?, city = ?,
       phone = ?, email = ?, pastor_name = ?, image = ?, description = ?, mass_note = ?,
       status = ?, order_index = ?, updated_at = ? WHERE id = ?`,
    ).run(
      name,
      slug,
      patron,
      vicariate,
      address,
      city,
      nullableText(formData, "phone"),
      nullableText(formData, "email"),
      nullableText(formData, "pastor_name"),
      nullableText(formData, "image"),
      description,
      nullableText(formData, "mass_note"),
      status,
      numberValue(formData, "order_index", 99),
      stamp,
      id,
    );
    logActivity(user, "Memperbarui paroki", "parishes", id, name);
  } else {
    const newParishId = newId("par");
    db.prepare(
      `INSERT INTO parishes
       (id, name, slug, patron, vicariate, address, city, phone, email, pastor_name, image,
        description, mass_note, status, order_index, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      newParishId,
      name,
      slug,
      patron,
      vicariate,
      address,
      city,
      nullableText(formData, "phone"),
      nullableText(formData, "email"),
      nullableText(formData, "pastor_name"),
      nullableText(formData, "image"),
      description,
      nullableText(formData, "mass_note"),
      status,
      numberValue(formData, "order_index", 99),
      stamp,
      stamp,
    );
    logActivity(user, "Menambahkan paroki", "parishes", newParishId, name);
  }

  redirect(flashUrl("/admin/paroki", existing ? "Data paroki berhasil diperbarui." : "Paroki berhasil ditambahkan."));
}

export async function deleteParishAction(formData: FormData) {
  const user = await requireAdmin("parishes.manage");
  const id = text(formData, "id");
  const parish = getParishById(id);
  if (!parish) redirect(flashUrl("/admin/paroki", "Paroki tidak ditemukan.", true));
  getDb().prepare("DELETE FROM parishes WHERE id = ?").run(id);
  logActivity(user, "Menghapus paroki", "parishes", id, parish.name);
  redirect(flashUrl("/admin/paroki", "Data paroki berhasil dihapus."));
}
