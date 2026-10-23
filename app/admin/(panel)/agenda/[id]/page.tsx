import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getEventById } from "@/lib/admin-data";
import { saveEventAction } from "@/lib/actions/events";
import { EVENT_CATEGORIES } from "@/lib/constants";
import { formatDateTimeID, toDateTimeLocal } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import { ImageField } from "@/components/admin/ImageField";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function EventFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  await requireAdmin("events.manage");
  const event = isNew ? undefined : getEventById(id);
  if (!isNew && !event) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title={isNew ? "Tambah agenda" : "Sunting agenda"}
        description={
          isNew
            ? "Buat kegiatan baru yang akan tampil di halaman agenda keuskupan."
            : "Perbarui informasi kegiatan, waktu, dan lokasi pelaksanaan."
        }
        action={
          event && event.status !== "draft" ? (
            <Link
              href={`/agenda/${event.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
            >
              Lihat Publikasi <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : undefined
        }
      />

      <ActionForm
        action={saveEventAction}
        submitLabel={isNew ? "Simpan Agenda" : "Simpan Perubahan"}
        cancelHref="/admin/agenda"
        footerNote="Agenda akan tampil di halaman publik sesuai status yang dipilih."
      >
        <input type="hidden" name="id" value={event?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Informasi agenda">
              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="admin-label">
                    Nama agenda *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={event?.title}
                    placeholder="Contoh: Misa Peringatan 100 Tahun Karya Misi"
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
                    defaultValue={event?.slug}
                    placeholder="otomatis-dari-nama-agenda"
                    className="admin-input font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="admin-label">
                    Deskripsi kegiatan *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    defaultValue={event?.description}
                    placeholder="Jelaskan tujuan, peserta, dan rangkaian kegiatan..."
                    className="admin-input min-h-[150px] resize-y leading-relaxed"
                  />
                  <p className="mt-1.5 text-[9px] text-stone-400">
                    Mendukung format sederhana: ## subjudul, - daftar, &gt; kutipan.
                  </p>
                </div>
                <div>
                  <label htmlFor="location" className="admin-label">
                    Lokasi *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      defaultValue={event?.location}
                      placeholder="Nama gereja, aula, atau tempat kegiatan"
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Waktu & status">
              <div className="space-y-5">
                <div>
                  <label htmlFor="start_at" className="admin-label">
                    Mulai *
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="start_at"
                      name="start_at"
                      type="datetime-local"
                      required
                      defaultValue={toDateTimeLocal(event?.start_at)}
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="end_at" className="admin-label">
                    Selesai
                  </label>
                  <div className="relative">
                    <Clock3 className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="end_at"
                      name="end_at"
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(event?.end_at)}
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="admin-label">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={event?.category || EVENT_CATEGORIES[0]}
                    className="admin-input"
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    {event && !EVENT_CATEGORIES.includes(event.category) && (
                      <option value={event.category}>{event.category}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="admin-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={event?.status || "upcoming"}
                    className="admin-input"
                  >
                    <option value="upcoming">Akan datang</option>
                    <option value="ongoing">Berlangsung</option>
                    <option value="done">Selesai</option>
                    <option value="draft">Draf — belum tampil</option>
                  </select>
                </div>
                {event && (
                  <p className="border-t border-stone-100 pt-3 text-[9px] leading-4 text-stone-400">
                    Dibuat {formatDateTimeID(event.created_at)}
                    <br />
                    Diperbarui {formatDateTimeID(event.updated_at)}
                  </p>
                )}
              </div>
            </Panel>

            <Panel title="Gambar agenda">
              <ImageField
                name="image"
                label="Gambar kegiatan"
                defaultValue={event?.image}
                hint="Rasio ideal 4:3 atau 16:9."
              />
            </Panel>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
