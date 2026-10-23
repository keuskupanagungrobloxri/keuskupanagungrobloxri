"use server";

import { getDb } from "@/lib/db";
import { newId } from "@/lib/password";
import { initialActionState, isEmail, text, type ActionState } from "./shared";

export async function sendMessageAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const honeypot = text(formData, "website");
  if (honeypot) return { success: "Pesan Anda telah diterima." };

  const name = text(formData, "name");
  const email = text(formData, "email");
  const phone = text(formData, "phone");
  const subject = text(formData, "subject");
  const message = text(formData, "message");

  if (!name) return { error: "Nama wajib diisi." };
  if (!isEmail(email)) return { error: "Alamat email tidak valid." };
  if (!subject) return { error: "Subjek pesan wajib diisi." };
  if (message.length < 20) return { error: "Pesan minimal 20 karakter." };
  if (message.length > 4000) return { error: "Pesan terlalu panjang (maksimal 4.000 karakter)." };

  getDb()
    .prepare(
      `INSERT INTO messages (id, name, email, phone, subject, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
    )
    .run(newId("msg"), name, email, phone || null, subject, message, new Date().toISOString());

  return {
    success:
      "Terima kasih. Pesan Anda telah kami terima dan akan ditindaklanjuti oleh sekretariat keuskupan.",
  };
}
