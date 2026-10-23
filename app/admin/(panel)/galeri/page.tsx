import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  GalleryHorizontalEnd,
  ImageIcon,
  PenLine,
  Plus,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllGalleries } from "@/lib/admin-data";
import { deleteGalleryAction } from "@/lib/actions/media";
import { ALBUMS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
} from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; album?: string }>;
}) {
  await requireAdmin("media.manage");
  const { q, album } = await searchParams;
  const all = getAllGalleries();
  const keyword = (q || "").toLowerCase();
  const filtered = all.filter((item) => {
    if (album && album !== "semua" && item.album !== album) return false;
    if (!keyword) return true;
    return `${item.title} ${item.caption || ""} ${item.album}`
      .toLowerCase()
      .includes(keyword);
  });
  const albumCounts = new Map<string, number>();
  for (const item of all) {
    albumCounts.set(item.album, (albumCounts.get(item.album) || 0) + 1);
  }
  const albums = Array.from(new Set([...ALBUMS, ...all.map((item) => item.album)]));

  return (
    <>
      <AdminPageHeader
        eyebrow="Konten & Publikasi"
        title="Galeri"
        description="Kelola dokumentasi foto liturgi, karya pastoral, dan kehidupan keuskupan yang tampil di halaman media publik."
        action={
          <PrimaryLink href="/admin/galeri/baru">
            <Plus className="h-3.5 w-3.5" /> Tambah Foto
          </PrimaryLink>
        }
      />

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href={q ? `/admin/galeri?q=${encodeURIComponent(q)}` : "/admin/galeri"}
            className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
              !album || album === "semua"
                ? "border-wine-900 bg-wine-900 text-white"
                : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
            }`}
          >
            Semua ({all.length})
          </Link>
          {albums.map((name) => {
            const count = albumCounts.get(name) || 0;
            if (!count) return null;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            params.set("album", name);
            return (
              <Link
                key={name}
                href={`/admin/galeri?${params.toString()}`}
                className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
                  album === name
                    ? "border-wine-900 bg-wine-900 text-white"
                    : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
                }`}
              >
                {name} ({count})
              </Link>
            );
          })}
        </div>
        <SearchBox
          action="/admin/galeri"
          defaultValue={q}
          placeholder="Cari judul atau keterangan foto..."
          hidden={{ album }}
        />
      </div>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="admin-card group flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <span className="absolute left-2.5 top-2.5 border border-white/25 bg-wine-950/70 px-2 py-0.5 text-[7px] font-extrabold uppercase tracking-[0.12em] text-gold-200 backdrop-blur-sm">
                  {item.album}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-wine-950">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-stone-500">
                    {item.caption}
                  </p>
                )}
                <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.08em] text-stone-400">
                  {timeAgo(item.created_at)}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
                  <a
                    href={item.image}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-stone-400 transition hover:text-wine-900"
                    title="Buka gambar"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/admin/galeri/${item.id}`}
                      className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                    >
                      <PenLine className="h-3 w-3" /> Sunting
                    </Link>
                    <form action={deleteGalleryAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <DeleteButton
                        message={`Hapus foto “${item.title}” dari galeri?`}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-card p-5">
          <EmptyState
            icon={<Camera className="h-5 w-5" />}
            title="Tidak ada foto ditemukan"
            description="Unggah dokumentasi kegiatan pertama untuk memperkaya galeri keuskupan."
            action={
              <PrimaryLink href="/admin/galeri/baru">
                <Plus className="h-3.5 w-3.5" /> Tambah Foto
              </PrimaryLink>
            }
          />
        </div>
      )}

      <p className="mt-5 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <GalleryHorizontalEnd className="h-3 w-3" />
        {filtered.length} dari {all.length} foto ditampilkan
        {album && album !== "semua" ? ` · album ${album}` : ""}
        <ImageIcon className="ml-1 h-3 w-3" />
      </p>
    </>
  );
}
