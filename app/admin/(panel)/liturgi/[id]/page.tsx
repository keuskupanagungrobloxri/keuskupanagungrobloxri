import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Church,
  Clock3,
  Info,
  MapPin,
  Sparkles,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllParishes, getMassById } from "@/lib/admin-data";
import { saveMassAction } from "@/lib/actions/liturgy";
import { MASS_DAYS, MASS_TYPES } from "@/lib/constants";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function MassFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  await requireAdmin("liturgy.manage");
  const mass = isNew ? undefined : getMassById(id);
  if (!isNew && !mass) notFound();
  const parishes = getAllParishes();

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title={isNew ? "Tambah jadwal misa" : "Sunting jadwal misa"}
        description={
          isNew
            ? "Tambahkan jadwal misa atau ibadat untuk salah satu paroki di keuskupan."
            : "Perbarui hari, waktu, jenis, dan lokasi jadwal misa paroki."
        }
        action={
          <Link
            href="/liturgi"
            target="_blank"
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
          >
            Lihat Halaman Liturgi <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {!parishes.length && (
        <div className="mb-5 flex items-start gap-3 border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Belum ada paroki terdaftar. Tambahkan paroki terlebih dahulu melalui{" "}
            <Link href="/admin/paroki/baru" className="font-bold underline">
              menu Paroki
            </Link>{" "}
            sebelum membuat jadwal misa.
          </p>
        </div>
      )}

      <ActionForm
        action={saveMassAction}
        submitLabel={isNew ? "Simpan Jadwal" : "Simpan Perubahan"}
        cancelHref="/admin/liturgi"
        footerNote="Jadwal aktif akan langsung tampil pada halaman liturgi publik."
      >
        <input type="hidden" name="id" value={mass?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Jadwal perayaan">
              <div className="space-y-5">
                <div>
                  <label htmlFor="parish_id" className="admin-label">
                    Paroki *
                  </label>
                  <div className="relative">
                    <Church className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <select
                      id="parish_id"
                      name="parish_id"
                      required
                      defaultValue={mass?.parish_id || ""}
                      className="admin-input pl-9"
                    >
                      <option value="">Pilih paroki</option>
                      {parishes.map((parish) => (
                        <option key={parish.id} value={parish.id}>
                          {parish.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="day" className="admin-label">
                      Hari *
                    </label>
                    <select
                      id="day"
                      name="day"
                      required
                      defaultValue={mass?.day || MASS_DAYS[0]}
                      className="admin-input"
                    >
                      {MASS_DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                      {mass && !MASS_DAYS.includes(mass.day) && (
                        <option value={mass.day}>{mass.day}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="time" className="admin-label">
                      Waktu *
                    </label>
                    <div className="relative">
                      <Clock3 className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                      <input
                        id="time"
                        name="time"
                        type="time"
                        required
                        defaultValue={mass?.time || "06:00"}
                        className="admin-input pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="admin-label">
                    Jenis perayaan *
                  </label>
                  <select
                    id="type"
                    name="type"
                    required
                    defaultValue={mass?.type || MASS_TYPES[0]}
                    className="admin-input"
                  >
                    {MASS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                    {mass && !MASS_TYPES.includes(mass.type) && (
                      <option value={mass.type}>{mass.type}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="admin-label">
                    Lokasi
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="location"
                      name="location"
                      type="text"
                      defaultValue={mass?.location || ""}
                      placeholder="Gereja utama, kapel, atau ruang ibadat"
                      className="admin-input pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="note" className="admin-label">
                    Catatan
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    defaultValue={mass?.note || ""}
                    placeholder="Keterangan tambahan, misalnya misa bersama atau petugas liturgi..."
                    className="admin-input min-h-[80px] resize-y leading-relaxed"
                  />
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Publikasi">
              <div className="space-y-5">
                <div>
                  <label htmlFor="status" className="admin-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={mass?.status || "active"}
                    className="admin-input"
                  >
                    <option value="active">Aktif — tampil publik</option>
                    <option value="inactive">Nonaktif — disembunyikan</option>
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
                    min={1}
                    max={999}
                    defaultValue={mass?.order_index ?? 99}
                    className="admin-input"
                  />
                  <p className="mt-1.5 text-[9px] leading-4 text-stone-400">
                    Angka lebih kecil tampil lebih dahulu pada jadwal paroki.
                  </p>
                </div>
              </div>
            </Panel>

            <div className="admin-card bg-cream p-5">
              <Sparkles className="h-4 w-4 text-gold-600" />
              <p className="mt-3 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
                Catatan liturgi
              </p>
              <p className="mt-1.5 text-[10px] leading-5 text-stone-500">
                Jadwal dapat berubah pada hari raya dan masa liturgi khusus.
                Gunakan catatan untuk memberi keterangan kepada umat.
              </p>
            </div>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
