import Link from "next/link";
import {
  ArrowUpRight,
  Church,
  Globe2,
  HeartHandshake,
  Info,
  Mail,
  MapPin,
  Type,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { saveSettingsAction } from "@/lib/actions/settings";
import { setting } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import { ImageField } from "@/components/admin/ImageField";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  hint,
  type = "text",
  className,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="admin-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="admin-input"
      />
      {hint && <p className="mt-1.5 text-[9px] leading-4 text-stone-400">{hint}</p>}
    </div>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  placeholder,
  rows = 4,
  hint,
  className,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  rows?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="admin-label">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="admin-input min-h-[100px] resize-y leading-relaxed"
      />
      {hint && <p className="mt-1.5 text-[9px] leading-4 text-stone-400">{hint}</p>}
    </div>
  );
}

export default async function AdminSettingsPage() {
  await requireAdmin("settings.manage");
  const settings = getSettings();
  const value = (key: string) => setting(settings, key);

  return (
    <>
      <AdminPageHeader
        eyebrow="Administrasi Situs"
        title="Pengaturan Situs"
        description="Kelola identitas keuskupan, konten beranda, kontak sekretariat, media sosial, donasi, dan tampilan situs publik."
        action={
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
          >
            Lihat Situs <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="mb-5 flex items-start gap-3 border-l-2 border-gold-500 bg-gold-50 px-4 py-3 text-[10px] leading-5 text-gold-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Perubahan pengaturan langsung memengaruhi situs publik. Periksa kembali
          teks dan tautan sebelum menyimpan.
        </p>
      </div>

      <ActionForm
        action={saveSettingsAction}
        submitLabel="Simpan Pengaturan"
        cancelHref="/admin"
        footerNote="Semua perubahan pengaturan dicatat dalam log aktivitas panel."
      >
        <div className="space-y-5">
          <Panel
            title="Identitas keuskupan"
            description="Nama resmi dan deskripsi singkat yang digunakan di seluruh situs."
          >
            <div className="mb-5 flex items-center gap-3 border-b border-stone-100 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-wine-50 text-wine-800">
                <Church className="h-4 w-4" />
              </span>
              <p className="text-[10px] leading-4 text-stone-400">
                Informasi ini tampil pada header, footer, metadata, dan halaman
                profil.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                name="site_name"
                label="Nama situs / keuskupan *"
                defaultValue={value("site_name")}
                placeholder="Keuskupan Agung ROBLOX"
                className="sm:col-span-2"
              />
              <Field
                name="site_short"
                label="Singkatan"
                defaultValue={value("site_short")}
                placeholder="KAR"
                hint="Tampil pada logo dan label ringkas."
              />
              <Field
                name="site_latin"
                label="Nama Latin keuskupan"
                defaultValue={value("site_latin")}
                placeholder="Archidioecesis Robloxiana"
              />
              <Field
                name="tagline"
                label="Tagline"
                defaultValue={value("tagline")}
                placeholder="Ut Unum Sint · Agar mereka semua menjadi satu"
                className="sm:col-span-2"
              />
              <TextArea
                name="meta_description"
                label="Deskripsi meta situs"
                defaultValue={value("meta_description")}
                rows={3}
                hint="Digunakan mesin pencari dan pratinjau tautan. Sekitar 150–160 karakter."
                className="sm:col-span-2"
              />
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel
              title="Beranda — hero"
              description="Bagian pembuka yang pertama dilihat pengunjung."
            >
              <div className="space-y-5">
                <Field
                  name="hero_eyebrow"
                  label="Label kecil di atas judul"
                  defaultValue={value("hero_eyebrow")}
                />
                <TextArea
                  name="hero_title"
                  label="Judul utama"
                  defaultValue={value("hero_title")}
                  rows={3}
                  hint="Gunakan kalimat singkat dan menggugah."
                />
                <TextArea
                  name="hero_description"
                  label="Deskripsi hero"
                  defaultValue={value("hero_description")}
                  rows={4}
                />
                <Field
                  name="hero_stat_label"
                  label="Label statistik hero"
                  defaultValue={value("hero_stat_label")}
                />
                <ImageField
                  name="hero_image"
                  label="Gambar hero"
                  defaultValue={value("hero_image")}
                  hint="Landscape lebar, minimal 1600 px."
                />
              </div>
            </Panel>

            <Panel
              title="Motto & sapaan gembala"
              description="Motto keuskupan dan pesan sapaan pada beranda."
            >
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="motto_latin"
                    label="Motto Latin"
                    defaultValue={value("motto_latin")}
                  />
                  <Field
                    name="motto_reference"
                    label="Referensi Kitab Suci"
                    defaultValue={value("motto_reference")}
                  />
                </div>
                <Field
                  name="motto_id"
                  label="Terjemahan motto"
                  defaultValue={value("motto_id")}
                />
                <Field
                  name="welcome_title"
                  label="Judul sapaan"
                  defaultValue={value("welcome_title")}
                />
                <Field
                  name="welcome_lead"
                  label="Kalimat pembuka"
                  defaultValue={value("welcome_lead")}
                />
                <TextArea
                  name="welcome_message"
                  label="Pesan sapaan gembala"
                  defaultValue={value("welcome_message")}
                  rows={8}
                  hint="Pisahkan paragraf dengan baris kosong."
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="bishop_name"
                    label="Nama uskup"
                    defaultValue={value("bishop_name")}
                  />
                  <Field
                    name="bishop_title"
                    label="Jabatan uskup"
                    defaultValue={value("bishop_title")}
                  />
                </div>
              </div>
            </Panel>
          </div>

          <Panel
            title="Statistik ringkas"
            description="Angka yang ditampilkan pada beranda. Gunakan format bebas seperti 7.480."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-3 border border-stone-100 bg-stone-50/50 p-3.5">
                <Field
                  name="stat_parishes"
                  label="Jumlah paroki"
                  defaultValue={value("stat_parishes")}
                />
                <Field
                  name="stat_parishes_label"
                  label="Label"
                  defaultValue={value("stat_parishes_label")}
                />
              </div>
              <div className="space-y-3 border border-stone-100 bg-stone-50/50 p-3.5">
                <Field
                  name="stat_priests"
                  label="Jumlah klerus"
                  defaultValue={value("stat_priests")}
                />
                <Field
                  name="stat_priests_label"
                  label="Label"
                  defaultValue={value("stat_priests_label")}
                />
              </div>
              <div className="space-y-3 border border-stone-100 bg-stone-50/50 p-3.5">
                <Field
                  name="stat_faithful"
                  label="Jumlah umat"
                  defaultValue={value("stat_faithful")}
                />
                <Field
                  name="stat_faithful_label"
                  label="Label"
                  defaultValue={value("stat_faithful_label")}
                />
              </div>
              <div className="space-y-3 border border-stone-100 bg-stone-50/50 p-3.5">
                <Field
                  name="stat_works"
                  label="Jumlah karya"
                  defaultValue={value("stat_works")}
                />
                <Field
                  name="stat_works_label"
                  label="Label"
                  defaultValue={value("stat_works_label")}
                />
              </div>
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel
              title="Kontak sekretariat"
              description="Alamat dan kanal komunikasi resmi keuskupan."
            >
              <div className="space-y-5">
                <Field
                  name="address"
                  label="Alamat"
                  defaultValue={value("address")}
                  placeholder="Jl. Lumen Christi No. 7"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="city"
                    label="Kota"
                    defaultValue={value("city")}
                  />
                  <Field
                    name="province"
                    label="Provinsi / daerah"
                    defaultValue={value("province")}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="postal_code"
                    label="Kode pos"
                    defaultValue={value("postal_code")}
                  />
                  <Field
                    name="office_hours"
                    label="Jam layanan"
                    defaultValue={value("office_hours")}
                    placeholder="Senin–Jumat, 08.00–16.00 WIB"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="phone"
                    label="Telepon"
                    defaultValue={value("phone")}
                    placeholder="(021) 555-0147"
                  />
                  <Field
                    name="whatsapp"
                    label="WhatsApp"
                    defaultValue={value("whatsapp")}
                    placeholder="0812-..."
                  />
                </div>
                <Field
                  name="email"
                  label="Email sekretariat"
                  type="email"
                  defaultValue={value("email")}
                  placeholder="sekretariat@keuskupanroblox.org"
                />
              </div>
            </Panel>

            <Panel
              title="Media sosial & footer"
              description="Tautan kanal resmi dan teks penutup situs."
            >
              <div className="space-y-5">
                <Field
                  name="instagram"
                  label="Instagram"
                  type="url"
                  defaultValue={value("instagram")}
                  placeholder="https://instagram.com/..."
                />
                <Field
                  name="tiktok"
                  label="TikTok"
                  type="url"
                  defaultValue={value("tiktok")}
                  placeholder="https://tiktok.com/@..."
                />
                <Field
                  name="youtube"
                  label="YouTube"
                  type="url"
                  defaultValue={value("youtube")}
                  placeholder="https://youtube.com/@..."
                />
                <TextArea
                  name="footer_text"
                  label="Teks footer"
                  defaultValue={value("footer_text")}
                  rows={5}
                />
                <TextArea
                  name="newsletter_title"
                  label="Judul ajakan terhubung"
                  defaultValue={value("newsletter_title")}
                  rows={2}
                />
                <TextArea
                  name="newsletter_text"
                  label="Teks ajakan terhubung"
                  defaultValue={value("newsletter_text")}
                  rows={3}
                />
              </div>
            </Panel>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel
              title="Liturgi"
              description="Catatan jadwal misa dan ayat yang tampil pada halaman liturgi."
            >
              <div className="space-y-5">
                <TextArea
                  name="mass_notes"
                  label="Catatan jadwal misa"
                  defaultValue={value("mass_notes")}
                  rows={4}
                />
                <TextArea
                  name="liturgy_verse"
                  label="Ayat liturgi"
                  defaultValue={value("liturgy_verse")}
                  rows={3}
                />
                <Field
                  name="liturgy_verse_ref"
                  label="Referensi ayat"
                  defaultValue={value("liturgy_verse_ref")}
                  placeholder="Matius 18:20"
                />
              </div>
            </Panel>

            <Panel
              title="Donasi & dukungan karya"
              description="Informasi rekening dan ajakan mendukung karya pastoral."
            >
              <div className="space-y-5">
                <Field
                  name="donation_title"
                  label="Judul donasi"
                  defaultValue={value("donation_title")}
                />
                <TextArea
                  name="donation_description"
                  label="Deskripsi donasi"
                  defaultValue={value("donation_description")}
                  rows={3}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="bank_name"
                    label="Nama bank"
                    defaultValue={value("bank_name")}
                  />
                  <Field
                    name="bank_account"
                    label="Nomor rekening"
                    defaultValue={value("bank_account")}
                  />
                </div>
                <Field
                  name="bank_holder"
                  label="Nama pemilik rekening"
                  defaultValue={value("bank_holder")}
                />
              </div>
            </Panel>
          </div>

          <Panel
            title="Kampanye beranda"
            description="Banner ajakan yang tampil pada beranda, misalnya pekan Kitab Suci atau aksi pastoral."
          >
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <Field
                  name="campaign_label"
                  label="Label kampanye"
                  defaultValue={value("campaign_label")}
                />
                <Field
                  name="campaign_title"
                  label="Judul kampanye"
                  defaultValue={value("campaign_title")}
                />
                <TextArea
                  name="campaign_text"
                  label="Deskripsi kampanye"
                  defaultValue={value("campaign_text")}
                  rows={4}
                />
                <Field
                  name="campaign_link"
                  label="Tautan kampanye"
                  defaultValue={value("campaign_link")}
                  placeholder="/berita/... atau https://..."
                  hint="Boleh berupa path internal situs atau URL lengkap."
                />
              </div>
              <div>
                <ImageField
                  name="campaign_image"
                  label="Gambar kampanye"
                  defaultValue={value("campaign_image")}
                  hint="Rasio landscape, minimal 1200 px."
                />
              </div>
            </div>
          </Panel>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Identitas", icon: Type },
              { label: "Beranda", icon: Globe2 },
              { label: "Kontak", icon: MapPin },
              { label: "Karya", icon: HeartHandshake },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 border border-stone-200 bg-white px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-500"
              >
                <Icon className="h-3.5 w-3.5 text-gold-600" />
                {label}
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 border border-stone-200 bg-cream/70 px-4 py-3 text-[9px] leading-4 text-stone-500">
            <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            <p>
              Email sekretariat divalidasi sebelum disimpan. Pastikan alamat email
              aktif karena digunakan pada formulir kontak dan informasi publik.
            </p>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
