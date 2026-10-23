import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Camera, ImageIcon } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getGalleryById } from "@/lib/admin-data";
import { saveGalleryAction } from "@/lib/actions/media";
import { ALBUMS } from "@/lib/constants";
import { formatDateTimeID } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import { ImageField } from "@/components/admin/ImageField";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function GalleryFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  await requireAdmin("media.manage");
  const item = isNew ? undefined : getGalleryById(id);
  if (!isNew && !item) notFound();

  return (
    <>
      <AdminPageHeader
        eyebrow="Konten & Publikasi"
        title={isNew ? "Tambah foto galeri" : "Sunting foto galeri"}
        description={
          isNew
            ? "Unggah dokumentasi kegiatan keuskupan dan tempatkan pada album yang sesuai."
            : "Perbarui judul, album, atau keterangan foto galeri."
        }
        action={
          <Link
            href="/media"
            target="_blank"
            className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
          >
            Lihat Galeri Publik <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <ActionForm
        action={saveGalleryAction}
        submitLabel={isNew ? "Simpan Foto" : "Simpan Perubahan"}
        cancelHref="/admin/galeri"
        footerNote="Foto akan langsung tampil pada album galeri publik setelah disimpan."
      >
        <input type="hidden" name="id" value={item?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Foto galeri">
              <div className="space-y-5">
                <ImageField
                  name="image"
                  label="Gambar *"
                  defaultValue={item?.image}
                  hint="Rasio ideal 4:3 atau landscape. Maks. 8 MB."
                />
                <div>
                  <label htmlFor="title" className="admin-label">
                    Judul foto *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={item?.title}
                    placeholder="Contoh: Misa Konselebrasi Awal Tahun"
                    className="admin-input text-[14px] font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="caption" className="admin-label">
                    Keterangan
                  </label>
                  <textarea
                    id="caption"
                    name="caption"
                    rows={4}
                    defaultValue={item?.caption || ""}
                    placeholder="Jelaskan momen, tempat, dan peristiwa dalam foto ini..."
                    className="admin-input min-h-[100px] resize-y leading-relaxed"
                  />
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Album & publikasi">
              <div className="space-y-5">
                <div>
                  <label htmlFor="album" className="admin-label">
                    Album
                  </label>
                  <select
                    id="album"
                    name="album"
                    defaultValue={item?.album || ALBUMS[0]}
                    className="admin-input"
                  >
                    {ALBUMS.map((album) => (
                      <option key={album} value={album}>
                        {album}
                      </option>
                    ))}
                    {item && !ALBUMS.includes(item.album) && (
                      <option value={item.album}>{item.album}</option>
                    )}
                  </select>
                  <p className="mt-1.5 text-[9px] leading-4 text-stone-400">
                    Album digunakan sebagai filter pada halaman media publik.
                  </p>
                </div>
                {item && (
                  <p className="border-t border-stone-100 pt-3 text-[9px] leading-4 text-stone-400">
                    Diunggah {formatDateTimeID(item.created_at)}
                  </p>
                )}
              </div>
            </Panel>

            <div className="admin-card bg-cream p-5">
              <Camera className="h-4 w-4 text-gold-600" />
              <p className="mt-3 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
                Panduan foto
              </p>
              <ul className="mt-2 space-y-1.5 text-[10px] leading-5 text-stone-500">
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                  Gunakan foto yang tajam dan tidak buram.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                  Pilih momen yang menggambarkan komunitas.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-600" />
                  Sertakan keterangan tempat dan kegiatan.
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-2 border border-stone-200 bg-white p-3.5 text-[9px] leading-4 text-stone-400">
              <ImageIcon className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" />
              Format yang didukung: JPG, PNG, WEBP, dan GIF.
            </div>
          </div>
        </div>
      </ActionForm>
    </>
  );
}
