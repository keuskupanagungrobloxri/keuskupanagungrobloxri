import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Eye,
  Info,
  LockKeyhole,
  Star,
} from "lucide-react";
import { hasPermission, requireAdmin } from "@/lib/auth";
import { getArticleById } from "@/lib/admin-data";
import { saveArticleAction } from "@/lib/actions/articles";
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import { formatDateTimeID } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { ImageField } from "@/components/admin/ImageField";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function ArticleFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  const user = await requireAdmin(isNew ? "articles.create" : "articles.edit");
  const article = isNew ? undefined : getArticleById(id);
  if (!isNew && !article) notFound();

  const canPublish = hasPermission(user, "articles.publish");

  if (article && article.status === "published" && !canPublish) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Konten & Publikasi"
          title="Berita terbit"
          description="Berita yang telah terbit hanya dapat disunting oleh pengguna dengan izin publikasi."
        />
        <div className="admin-card max-w-2xl p-7 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-wine-950">
            Akses penyuntingan terbatas
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[11px] leading-6 text-stone-500">
            Anda dapat melihat berita ini, tetapi peran Anda belum memiliki izin
            <span className="font-semibold text-stone-700"> articles.publish</span>.
            Hubungi pengurus keuskupan bila perlu melakukan perubahan.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link href="/admin/berita" className="btn-outline">
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </Link>
            <Link
              href={`/berita/${article.slug}`}
              target="_blank"
              className="btn-primary"
            >
              Lihat di Situs <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Konten & Publikasi"
        title={isNew ? "Tulis berita baru" : "Sunting berita"}
        description={
          isNew
            ? "Susun warta keuskupan dengan judul yang jelas, gambar yang bermakna, dan isi yang membangun."
            : "Perbarui isi berita. Perubahan pada berita terbit akan langsung tampil di situs publik."
        }
        action={
          !isNew && article?.status === "published" ? (
            <Link
              href={`/berita/${article.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 border border-stone-300 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
            >
              Lihat Publikasi <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          ) : undefined
        }
      />

      <ActionForm
        action={saveArticleAction}
        submitLabel={isNew ? "Simpan Berita" : "Simpan Perubahan"}
        cancelHref="/admin/berita"
        footerNote={
          canPublish
            ? "Status terbit akan langsung memperbarui halaman berita publik."
            : "Peran Anda hanya dapat menyimpan draf. Publikasi memerlukan izin tambahan."
        }
      >
        <input type="hidden" name="id" value={article?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Naskah berita">
              <div className="space-y-5">
                <div>
                  <label htmlFor="title" className="admin-label">
                    Judul berita *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    defaultValue={article?.title}
                    placeholder="Tuliskan judul yang jelas dan menarik..."
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
                    defaultValue={article?.slug}
                    placeholder="otomatis-dari-judul"
                    className="admin-input font-mono text-[11px]"
                  />
                  <p className="mt-1.5 text-[9px] leading-4 text-stone-400">
                    Biarkan kosong untuk dibuat otomatis. URL publik:{" "}
                    <span className="font-mono">/berita/slug-berita</span>
                  </p>
                </div>
                <div>
                  <label htmlFor="excerpt" className="admin-label">
                    Ringkasan
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={3}
                    defaultValue={article?.excerpt}
                    placeholder="Ringkasan singkat yang tampil pada kartu berita..."
                    className="admin-input min-h-[84px] resize-y leading-relaxed"
                  />
                  <p className="mt-1.5 text-[9px] text-stone-400">
                    Maksimal dua baris tampil di kartu. Kosongkan untuk dibuat otomatis
                    dari isi berita.
                  </p>
                </div>
                <ContentEditor
                  defaultValue={article?.content}
                  label="Isi berita *"
                  hint="Gunakan ## untuk subjudul, > untuk kutipan, - untuk daftar, **teks** untuk tebal, dan [teks](url) untuk tautan."
                />
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
                    defaultValue={article?.status || "draft"}
                    className="admin-input"
                    disabled={!canPublish}
                  >
                    <option value="draft">Draf — belum tampil</option>
                    {canPublish && <option value="published">Terbit — tampil publik</option>}
                    {canPublish && <option value="archived">Arsip — disimpan</option>}
                  </select>
                  {!canPublish && (
                    <>
                      <input type="hidden" name="status" value="draft" />
                      <p className="mt-2 flex items-start gap-1.5 text-[9px] leading-4 text-amber-700">
                        <Info className="mt-0.5 h-3 w-3 shrink-0" />
                        Anda belum memiliki izin menerbitkan berita.
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <label htmlFor="category" className="admin-label">
                    Kategori
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={article?.category || ARTICLE_CATEGORIES[0]}
                    className="admin-input"
                  >
                    {ARTICLE_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                    {article && !ARTICLE_CATEGORIES.includes(article.category) && (
                      <option value={article.category}>{article.category}</option>
                    )}
                  </select>
                </div>
                <label className="flex cursor-pointer items-start gap-3 border border-stone-200 bg-stone-50 p-3.5">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={Boolean(article?.featured)}
                    className="mt-0.5 h-4 w-4 accent-[#531824]"
                  />
                  <span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-wine-950">
                      <Star className="h-3 w-3 text-gold-600" /> Berita utama
                    </span>
                    <span className="mt-0.5 block text-[9px] leading-4 text-stone-400">
                      Tampil lebih menonjol di beranda dan halaman berita.
                    </span>
                  </span>
                </label>
              </div>
            </Panel>

            <Panel title="Gambar sampul">
              <ImageField
                name="cover_image"
                label="Gambar utama"
                defaultValue={article?.cover_image}
                hint="Rasio ideal 16:10."
              />
            </Panel>

            {article && (
              <Panel title="Informasi">
                <dl className="space-y-3 text-[10px]">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <dt className="flex items-center gap-1.5 text-stone-400">
                      <Eye className="h-3 w-3" /> Dibaca
                    </dt>
                    <dd className="font-semibold text-stone-700">{article.views} kali</dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <dt className="flex items-center gap-1.5 text-stone-400">
                      <CalendarDays className="h-3 w-3" /> Dibuat
                    </dt>
                    <dd className="text-right font-semibold text-stone-700">
                      {formatDateTimeID(article.created_at)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-stone-400">
                      <CalendarDays className="h-3 w-3" /> Diperbarui
                    </dt>
                    <dd className="text-right font-semibold text-stone-700">
                      {formatDateTimeID(article.updated_at)}
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
