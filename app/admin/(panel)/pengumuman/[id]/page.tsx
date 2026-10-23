import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BellRing,
  CalendarClock,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAnnouncementById } from "@/lib/admin-data";
import { saveAnnouncementAction } from "@/lib/actions/announcements";
import { formatDateTimeID, toDateTimeLocal } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AnnouncementFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  await requireAdmin("announcements.manage");
  const item = isNew ? undefined : getAnnouncementById(id);
  if (!isNew && !item) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title={isNew ? "Buat pengumuman" : "Sunting pengumuman"}
        description={
          isNew
            ? "Tulis pemberitahuan singkat yang akan tampil di bilah pengumuman seluruh halaman publik."
            : "Perbarui isi, jenis, dan periode tayang pengumuman keuskupan."
        }
        action={
          <Link
            href="/pengumuman"
            target="_blank"
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
          >
            Lihat Pengumuman <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <ActionForm
        action={saveAnnouncementAction}
        submitLabel={isNew ? "Simpan Pengumuman" : "Simpan Perubahan"}
        cancelHref="/admin/pengumuman"
        footerNote="Pengumuman aktif dan berada dalam periode tayang akan tampil di situs publik."
      >
        <input type="hidden" name="id" value={item?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Isi pengumuman">
              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="admin-label">
                    Judul pengumuman *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={item?.title}
                    placeholder="Contoh: Perubahan Jadwal Misa Hari Raya"
                    className="admin-input text-[14px] font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="admin-label">
                    Isi pengumuman *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    defaultValue={item?.message}
                    placeholder="Tuliskan informasi yang perlu diketahui umat secara jelas dan singkat..."
                    className="admin-input min-h-[150px] resize-y leading-relaxed"
                  />
                  <p className="mt-1.5 text-[9px] text-stone-400">
                    Gunakan bahasa yang ringkas karena teks tampil pada bilah
                    informasi di bagian atas situs.
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Jenis pengumuman">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: "info",
                    label: "Informasi",
                    description: "Kabar umum dan pemberitahuan biasa.",
                    icon: Megaphone,
                  },
                  {
                    value: "important",
                    label: "Penting",
                    description: "Informasi mendesak yang perlu perhatian.",
                    icon: BellRing,
                  },
                  {
                    value: "liturgy",
                    label: "Liturgi",
                    description: "Jadwal dan catatan perayaan liturgi.",
                    icon: Sparkles,
                  },
                ].map((tone) => {
                  const Icon = tone.icon;
                  return (
                    <label
                      key={tone.value}
                      className="group flex cursor-pointer gap-3 border border-stone-200 bg-white p-3.5 transition has-[:checked]:border-gold-500 has-[:checked]:bg-gold-50/45"
                    >
                      <input
                        type="radio"
                        name="tone"
                        value={tone.value}
                        defaultChecked={
                          (item?.tone || "info") === tone.value
                        }
                        className="mt-0.5 h-3.5 w-3.5 accent-[#531824]"
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-wine-950">
                          <Icon className="h-3 w-3 text-gold-600" />
                          {tone.label}
                        </span>
                        <span className="mt-0.5 block text-[9px] leading-4 text-stone-400">
                          {tone.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Publikasi">
              <div className="space-y-5">
                <label className="flex cursor-pointer items-start gap-3 border border-stone-200 bg-stone-50 p-3.5">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={isNew ? true : Boolean(item?.active)}
                    className="mt-0.5 h-4 w-4 accent-[#531824]"
                  />
                  <span>
                    <span className="block text-[10px] font-bold text-wine-950">
                      Aktifkan pengumuman
                    </span>
                    <span className="mt-0.5 block text-[9px] leading-4 text-stone-400">
                      Jika dinonaktifkan, pengumuman disimpan tanpa ditampilkan.
                    </span>
                  </span>
                </label>

                <div>
                  <label htmlFor="starts_at" className="admin-label">
                    Mulai tayang
                  </label>
                  <div className="relative">
                    <CalendarClock className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="starts_at"
                      name="starts_at"
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(item?.starts_at)}
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="ends_at" className="admin-label">
                    Berakhir
                  </label>
                  <div className="relative">
                    <CalendarClock className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="ends_at"
                      name="ends_at"
                      type="datetime-local"
                      defaultValue={toDateTimeLocal(item?.ends_at)}
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <p className="border-t border-stone-100 pt-3 text-[9px] leading-4 text-stone-400">
                  Kosongkan jadwal untuk menayangkan pengumuman sepanjang waktu
                  selama status aktif.
                </p>
              </div>
            </Panel>

            {item && (
              <Panel title="Informasi">
                <dl className="space-y-2.5 text-[10px]">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <dt className="text-stone-400">Dibuat</dt>
                    <dd className="text-right font-semibold text-stone-700">
                      {formatDateTimeID(item.created_at)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-stone-400">Status</dt>
                    <dd className="font-semibold text-stone-700">
                      {item.active ? "Aktif" : "Nonaktif"}
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
