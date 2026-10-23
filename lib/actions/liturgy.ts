"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getMassById, getParishById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import {
  flashUrl,
  initialActionState,
  numberValue,
  nullableText,
  text,
  type ActionState,
} from "./shared";

export async function saveMassAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("liturgy.manage");
  const id = text(formData, "id");
  const existing = id ? getMassById(id) : undefined;
  if (id && !existing) return { error: "Jadwal misa tidak ditemukan." };

  const parishId = text(formData, "parish_id");
  const day = text(formData, "day");
  const time = text(formData, "time");
  const type = text(formData, "type");
  const location = text(formData, "location");
  const requestedStatus = text(formData, "status") || "active";
  const status = ["active", "inactive"].includes(requestedStatus)
    ? requestedStatus
    : "active";

  if (!parishId || !getParishById(parishId)) return { error: "Paroki wajib dipilih." };
  if (!day) return { error: "Hari wajib dipilih." };
  if (!time) return { error: "Waktu misa wajib diisi." };
  if (!type) return { error: "Jenis misa wajib diisi." };

  const db = getDb();
  if (existing) {
    db.prepare(
      `UPDATE masses SET parish_id = ?, day = ?, time = ?, type = ?, location = ?, note = ?,
       status = ?, order_index = ? WHERE id = ?`,
    ).run(
      parishId,
      day,
      time,
      type,
      location || null,
      nullableText(formData, "note"),
      status,
      numberValue(formData, "order_index", 99),
      id,
    );
    logActivity(user, "Memperbarui jadwal misa", "masses", id, `${day} ${time} · ${type}`);
  } else {
    const newMassId = newId("mas");
    db.prepare(
      `INSERT INTO masses (id, parish_id, day, time, type, location, note, status, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      newMassId,
      parishId,
      day,
      time,
      type,
      location || null,
      nullableText(formData, "note"),
      status,
      numberValue(formData, "order_index", 99),
    );
    logActivity(user, "Menambahkan jadwal misa", "masses", newMassId, `${day} ${time} · ${type}`);
  }

  redirect(flashUrl("/admin/liturgi", existing ? "Jadwal misa berhasil diperbarui." : "Jadwal misa berhasil ditambahkan."));
}

export async function deleteMassAction(formData: FormData) {
  const user = await requireAdmin("liturgy.manage");
  const id = text(formData, "id");
  const mass = getMassById(id);
  if (!mass) redirect(flashUrl("/admin/liturgi", "Jadwal misa tidak ditemukan.", true));
  getDb().prepare("DELETE FROM masses WHERE id = ?").run(id);
  logActivity(user, "Menghapus jadwal misa", "masses", id, `${mass.day} ${mass.time}`);
  redirect(flashUrl("/admin/liturgi", "Jadwal misa berhasil dihapus."));
}
