import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Info,
  Layers,
  LockKeyhole,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getPageById } from "@/lib/admin-data";
import { savePageAction } from "@/lib/actions/pages";
import { formatDateTimeID } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const CORE_PAGES = ["profil", "sejarah", "visi-misi"];

export default async function PageFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  await requireAdmin("pages.manage");
  const page = isNew ? undefined : getPageById(id);
  if (!isNew && !page) notFound();
  const locked = page ? CORE_PAGES.includes(page.slug) : false;

  return (
    <>
      <AdminPageHeader
        eyebrow="Konten & Publikasi"
        title={isNew ? "Buat halaman baru" : "Sunting halaman"}
        description={
          isNew
            ? "Susun halaman statis untuk profil, sejarah, dokumen, atau informasi pelayanan keuskupan."
            : "Perbarui judul, ringkasan, dan isi halaman. Perubahan halaman terbit langsung tampil di situs."
        }
        action={
          page?.status === "published" ? (
            <Link
              href={`/halaman/${page.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
            >
              Lihat Halaman <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : undefined
        }
      />

      {locked && (
        <div className="mb-5 flex items-start gap-3 border-l-2 border-gold-500 bg-gold-50 px-4 py-3 text-[11px] leading-5 text-gold-900">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Halaman ini merupakan halaman inti keuskupan dan tidak dapat dihapus.
            Halaman profil utama juga harus tetap berstatus terbit.
          </p>
        </div>
      )}

      <ActionForm
        action={savePageAction}
        submitLabel={isNew ? "Simpan Halaman" : "Simpan Perubahan"}
        cancelHref="/admin/halaman"
        footerNote="Halaman terbit akan tersedia pada alamat /halaman/slug dan dapat ditautkan dari menu situs."
      >
        <input type="hidden" name="id" value={page?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Identitas halaman">
              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="admin-label">
                    Judul halaman *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={page?.title}
                    placeholder="Contoh: Sejarah Keuskupan"
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
                    defaultValue={page?.slug}
                    placeholder="otomatis-dari-judul"
                    className="admin-input font-mono text-[11px]"
                  />
                  <p className="mt-1.5 text-[9px] leading-4 text-stone-400">
                    Biarkan kosong untuk dibuat otomatis. URL publik:{" "}
                    <span className="font-mono">/halaman/slug-halaman</span>
                  </p>
                </div>
                <div>
                  <label htmlFor="subtitle" className="admin-label">
                    Subjudul / ringkasan *
                  </label>
                  <textarea
                    id="subtitle"
                    name="subtitle"
                    required
                    rows={3}
                    defaultValue={page?.subtitle}
                    placeholder="Ringkasan singkat yang tampil di bawah judul halaman..."
                    className="admin-input min-h-[84px] resize-y leading-relaxed"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Isi halaman">
              <ContentEditor
                defaultValue={page?.content}
                label="Konten halaman *"
                hint="Gunakan ## untuk subjudul, > untuk kutipan, - untuk daftar, **teks** untuk tebal, dan [teks](url) untuk tautan."
              />
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
                    defaultValue={page?.status || "published"}
                    className="admin-input"
                  >
                    <option value="published">Terbit — tampil publik</option>
                    <option value="draft">Draf — belum tampil</option>
                  </select>
                </div>
                {page && (
                  <p className="border-t border-stone-100 pt-3 text-[9px] leading-4 text-stone-400">
                    Dibuat {formatDateTimeID(page.created_at)}
                    <br />
                    Diperbarui {formatDateTimeID(page.updated_at)}
                  </p>
                )}
              </div>
            </Panel>

            <div className="admin-card bg-cream p-5">
              <Layers className="h-4 w-4 text-gold-600" />
              <p className="mt-3 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
                Tentang halaman
              </p>
              <p className="mt-1.5 text-[10px] leading-5 text-stone-500">
                Halaman statis cocok untuk dokumen, pedoman, profil karya, dan
                informasi yang tidak berubah sering.
              </p>
            </div>

            {isNew && (
              <div className="flex items-start gap-2 border border-stone-200 bg-white p-3.5 text-[9px] leading-4 text-stone-400">
                <Info className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" />
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-2.5 w-2.5" />
                  Tanggal dibuat akan tercatat otomatis saat halaman disimpan.
                </span>
              </div>
            )}
          </div>
        </div>
      </ActionForm>
    </>
  );
}
