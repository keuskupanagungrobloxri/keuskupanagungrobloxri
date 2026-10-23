import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  PenLine,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { hasPermission, requireAdmin } from "@/lib/auth";
import { getAllArticles } from "@/lib/admin-data";
import { deleteArticleAction, toggleFeaturedAction } from "@/lib/actions/articles";
import { formatDateID, timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";
import {
  ConfirmSubmitButton,
  DeleteButton,
} from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const user = await requireAdmin("articles.view");
  const { q, status } = await searchParams;
  const all = getAllArticles(q || "");
  const filtered = status && status !== "semua"
    ? all.filter((article) => article.status === status)
    : all;

  const counts = {
    semua: all.length,
    published: all.filter((item) => item.status === "published").length,
    draft: all.filter((item) => item.status === "draft").length,
    archived: all.filter((item) => item.status === "archived").length,
  };

  const canPublish = hasPermission(user, "articles.publish");
  const canEdit = hasPermission(user, "articles.edit");
  const canDelete = hasPermission(user, "articles.delete");
  const canCreate = hasPermission(user, "articles.create");

  return (
    <>
      <AdminPageHeader
        eyebrow="Konten & Publikasi"
        title="Berita"
        description="Kelola warta, renungan, dan kabar pelayanan keuskupan. Perubahan akan langsung tampil di situs publik setelah diterbitkan."
        action={
          canCreate ? (
            <PrimaryLink href="/admin/berita/baru">
              <Plus className="h-3.5 w-3.5" /> Tulis Berita
            </PrimaryLink>
          ) : undefined
        }
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: "Semua" },
            { key: "published", label: "Terbit" },
            { key: "draft", label: "Draf" },
            { key: "archived", label: "Arsip" },
          ].map((item) => {
            const active = (status || "semua") === item.key;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (item.key !== "semua") params.set("status", item.key);
            const href = params.toString()
              ? `/admin/berita?${params.toString()}`
              : "/admin/berita";
            return (
              <Link
                key={item.key}
                href={href}
                className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
                  active
                    ? "border-wine-900 bg-wine-900 text-white"
                    : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
                }`}
              >
                {item.label} ({counts[item.key as keyof typeof counts]})
              </Link>
            );
          })}
        </div>
        <SearchBox
          action="/admin/berita"
          defaultValue={q}
          placeholder="Cari judul, kategori, atau status..."
          hidden={{ status }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[46%]">Berita</th>
                  <th>Status</th>
                  <th>Kategori</th>
                  <th>Penulis</th>
                  <th>Diperbarui</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((article) => {
                  const editable =
                    canEdit &&
                    (article.status !== "published" || canPublish);
                  return (
                    <tr key={article.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 shrink-0 overflow-hidden bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={article.cover_image || "/images/hero-church.jpg"}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-wine-950">
                              {article.title}
                            </p>
                            <p className="mt-1 flex items-center gap-2 text-[8px] font-semibold text-stone-400">
                              {article.featured ? (
                                <span className="flex items-center gap-1 text-gold-700">
                                  <Star className="h-2.5 w-2.5 fill-current" /> Utama
                                </span>
                              ) : null}
                              <span>{article.views} dibaca</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={article.status} />
                      </td>
                      <td className="text-[10px]">{article.category}</td>
                      <td className="text-[10px]">
                        {article.author_name || "Redaksi"}
                      </td>
                      <td className="whitespace-nowrap text-[10px] text-stone-400">
                        <span className="block">{timeAgo(article.updated_at)}</span>
                        <span className="text-[8px]">
                          {formatDateID(article.updated_at, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <form action={toggleFeaturedAction}>
                              <input type="hidden" name="id" value={article.id} />
                              <ConfirmSubmitButton
                                message={
                                  article.featured
                                    ? "Lepas tanda berita utama?"
                                    : "Jadikan berita ini sebagai berita utama?"
                                }
                              >
                                <Star
                                  className={`h-3.5 w-3.5 ${
                                    article.featured
                                      ? "fill-gold-500 text-gold-600"
                                      : ""
                                  }`}
                                />
                                <span className="sr-only">Ubah berita utama</span>
                              </ConfirmSubmitButton>
                            </form>
                          )}
                          {article.status === "published" && (
                            <Link
                              href={`/berita/${article.slug}`}
                              target="_blank"
                              className="text-stone-400 transition hover:text-wine-900"
                              title="Lihat di situs"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          {editable && (
                            <Link
                              href={`/admin/berita/${article.id}`}
                              className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                            >
                              <PenLine className="h-3 w-3" /> Sunting
                            </Link>
                          )}
                          {canDelete && (
                            <form action={deleteArticleAction}>
                              <input type="hidden" name="id" value={article.id} />
                              <DeleteButton
                                message={`Hapus berita “${article.title}” secara permanen?`}
                                label="Hapus"
                              />
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={<BookOpen className="h-5 w-5" />}
              title="Tidak ada berita ditemukan"
              description={
                q || status
                  ? "Coba ubah kata kunci atau filter status untuk menemukan berita."
                  : "Belum ada berita di panel. Mulai dengan menulis berita pertama."
              }
              action={
                canCreate ? (
                  <PrimaryLink href="/admin/berita/baru">
                    <Plus className="h-3.5 w-3.5" /> Tulis Berita
                  </PrimaryLink>
                ) : undefined
              }
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <Trash2 className="h-3 w-3" />
        Tindakan seperti menghapus dan mengubah berita utama memerlukan konfirmasi.
      </p>
    </>
  );
}
