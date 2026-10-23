import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, MapPin, UserRound } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getParishById } from "@/lib/admin-data";
import { saveParishAction } from "@/lib/actions/parishes";
import { ActionForm } from "@/components/admin/ActionForm";
import { ImageField } from "@/components/admin/ImageField";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function ParishFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  await requireAdmin("parishes.manage");
  const parish = isNew ? undefined : getParishById(id);
  if (!isNew && !parish) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title={isNew ? "Tambah paroki" : "Sunting paroki"}
        description={
          isNew
            ? "Lengkapi data paroki baru untuk ditampilkan pada direktori paroki publik."
            : "Perbarui identitas, alamat, pastor, dan keterangan pelayanan paroki."
        }
        action={
          parish && parish.status === "active" ? (
            <Link
              href={`/paroki/${parish.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
            >
              Lihat Publikasi <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : undefined
        }
      />

      <ActionForm
        action={saveParishAction}
        submitLabel={isNew ? "Simpan Paroki" : "Simpan Perubahan"}
        cancelHref="/admin/paroki"
        footerNote="Perubahan data paroki langsung tercermin pada halaman paroki publik."
      >
        <input type="hidden" name="id" value={parish?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Identitas paroki">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="admin-label">
                    Nama paroki *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={parish?.name}
                    placeholder="Paroki Santo ..."
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
                    defaultValue={parish?.slug}
                    placeholder="otomatis-dari-nama"
                    className="admin-input font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label htmlFor="patron" className="admin-label">
                    Pelindung *
                  </label>
                  <input
                    id="patron"
                    name="patron"
                    type="text"
                    required
                    defaultValue={parish?.patron}
                    placeholder="Santo Pelindung"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="vicariate" className="admin-label">
                    Kevikepan *
                  </label>
                  <input
                    id="vicariate"
                    name="vicariate"
                    type="text"
                    required
                    defaultValue={parish?.vicariate}
                    placeholder="Kevikepan ..."
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="pastor_name" className="admin-label">
                    Pastor paroki
                  </label>
                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="pastor_name"
                      name="pastor_name"
                      type="text"
                      defaultValue={parish?.pastor_name || ""}
                      placeholder="RD. Nama Pastor"
                      className="admin-input pl-9"
                    />
                  </div>
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
                    defaultValue={parish?.order_index ?? 99}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="admin-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={parish?.status || "active"}
                    className="admin-input"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>
            </Panel>

            <Panel title="Alamat & kontak">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="admin-label">
                    Alamat *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      defaultValue={parish?.address}
                      placeholder="Jalan, nomor, kawasan"
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className="admin-label">
                    Kota / distrik *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    defaultValue={parish?.city}
                    placeholder="Kota Vianney"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="admin-label">
                    Telepon
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={parish?.phone || ""}
                    placeholder="(021) 555-0000"
                    className="admin-input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="admin-label">
                    Email paroki
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={parish?.email || ""}
                    placeholder="paroki@keuskupanroblox.org"
                    className="admin-input"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Deskripsi & catatan">
              <div className="space-y-5">
                <div>
                  <label htmlFor="description" className="admin-label">
                    Deskripsi paroki *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    defaultValue={parish?.description}
                    placeholder="Ceritakan kekhasan komunitas dan pelayanan paroki..."
                    className="admin-input min-h-[150px] resize-y leading-relaxed"
                  />
                </div>
                <div>
                  <label htmlFor="mass_note" className="admin-label">
                    Catatan jadwal misa
                  </label>
                  <textarea
                    id="mass_note"
                    name="mass_note"
                    rows={3}
                    defaultValue={parish?.mass_note || ""}
                    placeholder="Contoh: Pelayanan sakramen tobat setiap Sabtu pukul 15.30."
                    className="admin-input min-h-[80px] resize-y leading-relaxed"
                  />
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Foto paroki">
              <ImageField
                name="image"
                label="Gambar utama"
                defaultValue={parish?.image}
                hint="Rasio ideal 16:10."
              />
            </Panel>

            <div className="admin-card bg-cream p-5">
              <CalendarDays className="h-4 w-4 text-gold-600" />
              <p className="mt-3 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
                Jadwal misa
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-wine-950">
                Kelola di menu Liturgi
              </p>
              <p className="mt-1.5 text-[10px] leading-5 text-stone-500">
                Jadwal misa dan pelayanan sakramen paroki dikelola pada modul liturgi
                agar tersusun rapi.
              </p>
              <Link
                href="/admin/liturgi"
                className="mt-3 inline-flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-wine-800 transition hover:text-gold-700"
              >
                Buka Modul Liturgi <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {parish && (
              <Panel title="Ringkasan">
                <dl className="space-y-3 text-[10px]">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <dt className="text-stone-400">Slug</dt>
                    <dd className="max-w-[180px] truncate font-mono text-[9px] text-stone-600">
                      /paroki/{parish.slug}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <dt className="text-stone-400">Kevikepan</dt>
                    <dd className="text-right font-semibold text-stone-700">
                      {parish.vicariate}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-stone-400">Status</dt>
                    <dd className="font-semibold text-stone-700">
                      {parish.status === "active" ? "Aktif" : "Nonaktif"}
                    </dd>
                  </div>
                </dl>
              </Panel>
            )}
          </div>
        </div>
      </ActionForm>
    </>
  );
}
