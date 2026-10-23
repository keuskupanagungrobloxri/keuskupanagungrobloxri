"use server";

import { redirect } from "next/navigation";
import { logActivity, requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { flashUrl, initialActionState, text, type ActionState } from "./shared";

const SETTING_KEYS = [
  "site_name",
  "site_short",
  "site_latin",
  "tagline",
  "meta_description",
  "hero_eyebrow",
  "hero_title",
  "hero_description",
  "hero_image",
  "hero_stat_label",
  "motto_latin",
  "motto_id",
  "motto_reference",
  "welcome_title",
  "welcome_lead",
  "welcome_message",
  "bishop_name",
  "bishop_title",
  "stat_parishes",
  "stat_priests",
  "stat_faithful",
  "stat_works",
  "stat_parishes_label",
  "stat_priests_label",
  "stat_faithful_label",
  "stat_works_label",
  "address",
  "city",
  "province",
  "postal_code",
  "phone",
  "whatsapp",
  "email",
  "office_hours",
  "instagram",
  "facebook",
  "youtube",
  "footer_text",
  "mass_notes",
  "donation_title",
  "donation_description",
  "bank_name",
  "bank_account",
  "bank_holder",
  "liturgy_verse",
  "liturgy_verse_ref",
  "campaign_label",
  "campaign_title",
  "campaign_text",
  "campaign_link",
  "campaign_image",
  "newsletter_title",
  "newsletter_text",
];

export async function saveSettingsAction(
  _state: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin("settings.manage");
  const siteName = text(formData, "site_name");
  const email = text(formData, "email");
  if (!siteName) return { error: "Nama situs wajib diisi." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Format email sekretariat tidak valid." };
  }

  const db = getDb();
  const update = db.prepare(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  );
  for (const key of SETTING_KEYS) {
    if (formData.has(key)) {
      update.run(key, text(formData, key));
    }
  }
  logActivity(user, "Memperbarui pengaturan situs", "settings", null, "Identitas, beranda, kontak, dan donasi");
  redirect(flashUrl("/admin/pengaturan", "Pengaturan situs berhasil disimpan."));
}
