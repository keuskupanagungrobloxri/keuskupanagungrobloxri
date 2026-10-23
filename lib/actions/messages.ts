"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getMessageById } from "@/lib/admin-data";
import { getDb } from "@/lib/db";
import { flashUrl, text } from "./shared";

export async function updateMessageStatusAction(formData: FormData) {
  const user = await requireAdmin("messages.manage");
  const id = text(formData, "id");
  const requested = text(formData, "status");
  const status = ["new", "read", "replied"].includes(requested) ? requested : "read";
  const message = getMessageById(id);
  if (!message) redirect(flashUrl("/admin/pesan", "Pesan tidak ditemukan.", true));
  getDb().prepare("UPDATE messages SET status = ? WHERE id = ?").run(status, id);
  logActivity(
    user,
    status === "replied" ? "Menandai pesan dibalas" : "Memperbarui status pesan",
    "messages",
    id,
    message.subject,
  );
  redirect(flashUrl(`/admin/pesan/${id}`, "Status pesan diperbarui."));
}

export async function deleteMessageAction(formData: FormData) {
  const user = await requireAdmin("messages.manage");
  const id = text(formData, "id");
  const message = getMessageById(id);
  if (!message) redirect(flashUrl("/admin/pesan", "Pesan tidak ditemukan.", true));
  getDb().prepare("DELETE FROM messages WHERE id = ?").run(id);
  logActivity(user, "Menghapus pesan", "messages", id, message.subject);
  redirect(flashUrl("/admin/pesan", "Pesan berhasil dihapus."));
}
