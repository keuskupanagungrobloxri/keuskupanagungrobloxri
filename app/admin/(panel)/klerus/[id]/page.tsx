import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getClergyById } from "@/lib/admin-data";
import { saveClergyAction } from "@/lib/actions/clergy";
import { CLERGY_RANKS } from "@/lib/constants";
import { ActionForm } from "@/components/admin/ActionForm";
import { ImageField } from "@/components/admin/ImageField";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function ClergyFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  await requireAdmin("clergy.manage");
  const person = isNew ? undefined : getClergyById(id);
  if (!isNew && !person) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title={isNew ? "Tambah data klerus" : "Sunting data klerus"}
        description={
          isNew
            ? "Tambahkan uskup, imam, diakon, atau frater ke direktori klerus keuskupan."
            : "Perbarui jabatan, penugasan, dan biografi klerus untuk direktori publik."
        }
        action={
          <Link
            href="/profil/klerus"
            target="_blank"
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
          >
            Lihat Direktori <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <ActionForm
        action={saveClergyAction}
        submitLabel={isNew ? "Simpan Data" : "Simpan Perubahan"}
        cancelHref="/admin/klerus"
        footerNote="Data klerus aktif akan tampil pada halaman direktori klerus publik."
      >
        <input type="hidden" name="id" value={person?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Identitas & panggilan">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="admin-label">
                    Nama lengkap *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={person?.name}
                    placeholder="Mgr. / RD. / Dn. / Fr. Nama Lengkap"
                    className="admin-input text-[14px] font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="admin-label">
                    Slug URL
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    defaultValue={person?.slug}
                    placeholder="otomatis-dari-nama"
                    className="admin-input font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label htmlFor="rank" className="admin-label">
                    Jenis panggilan *
                  </label>
                  <select
                    id="rank"
                    name="rank"
                    required
                    defaultValue={person?.rank || "Imam"}
                    className="admin-input"
                  >
                    {CLERGY_RANKS.map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                    {person && !CLERGY_RANKS.includes(person.rank) && (
                      <option value={person.rank}>{person.rank}</option>
                    )}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="admin-label">
                    Jabatan *
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      defaultValue={person?.title}
                      placeholder="Vikaris Jenderal, Pastor Paroki, Diakon Katedral..."
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="assignment" className="admin-label">
                    Penugasan
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="assignment"
                      name="assignment"
                      type="text"
                      defaultValue={person?.assignment || ""}
                      placeholder="Paroki / komisi / lembaga"
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="admin-label">
                    Biografi singkat *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    required
                    rows={5}
                    defaultValue={person?.bio || ""}
                    placeholder="Tuliskan latar belakang pelayanan dan peran pastoral..."
                    className="admin-input min-h-[120px] resize-y leading-relaxed"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Kontak & publikasi">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="admin-label">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={person?.email || ""}
                      placeholder="nama@keuskupanroblox.org"
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="admin-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={person?.status || "active"}
                    className="admin-input"
                  >
                    <option value="active">Aktif</option>
                    <option value="emeritus">Emeritus</option>
                    <option value="inactive">Nonaktif — tidak tampil</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="order_index" className="admin-label">
                    Urutan tampil
                  </label>
                  <input
                    id="order_index"
                    name="order_index"
                    type="number"
                    min={0}
                    defaultValue={person?.order_index ?? 99}
                    className="admin-input"
                  />
                  <p className="mt-1.5 text-[9px] text-stone-400">
                    Angka kecil tampil lebih dahulu.
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Foto profil">
              <ImageField
                name="image"
                label="Foto klerus"
                defaultValue={person?.image}
                hint="Rasio potret 3:4 disarankan."
              />
            </Panel>

            <Panel title="Panduan tampil">
              <ul className="space-y-2.5 text-[10px] leading-5 text-stone-500">
                <li className="flex gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  Klerus berstatus aktif tampil di direktori publik.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  Urutan tampil mengikuti nilai urutan, lalu nama.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  Biografi sebaiknya 2–4 kalimat agar mudah dibaca.
                </li>
              </ul>
            </Panel>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
