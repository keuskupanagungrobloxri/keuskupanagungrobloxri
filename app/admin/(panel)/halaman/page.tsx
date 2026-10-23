import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Layers,
  LockKeyhole,
  PenLine,
  Plus,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllPages } from "@/lib/admin-data";
import { deletePageAction } from "@/lib/actions/pages";
import { timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

const CORE_PAGES = ["profil", "sejarah", "visi-misi"];

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin("pages.manage");
  const { q, status } = await searchParams;
  const all = getAllPages();
  const keyword = (q || "").toLowerCase();
  const searched = keyword
    ? all.filter((page) =>
        `${page.title} ${page.slug} ${page.subtitle}`
          .toLowerCase()
          .includes(keyword),
      )
    : all;
  const filtered =
    status && status !== "semua"
      ? searched.filter((page) => page.status === status)
      : searched;

  const counts = {
    semua: all.length,
    published: all.filter((page) => page.status === "published").length,
    draft: all.filter((page) => page.status === "draft").length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Konten & Publikasi"
        title="Halaman"
        description="Kelola halaman statis keuskupan seperti profil, sejarah, visi-misi, dan dokumen pastoral. Konten dikelola dari panel ini."
        action={
          <PrimaryLink href="/admin/halaman/baru">
            <Plus className="h-3.5 w-3.5" /> Buat Halaman
          </PrimaryLink>
        }
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: "Semua" },
            { key: "published", label: "Terbit" },
            { key: "draft", label: "Draf" },
          ].map((item) => {
            const active = (status || "semua") === item.key;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (item.key !== "semua") params.set("status", item.key);
            const href = params.toString()
              ? `/admin/halaman?${params.toString()}`
              : "/admin/halaman";
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
          action="/admin/halaman"
          defaultValue={q}
          placeholder="Cari judul atau slug halaman..."
          hidden={{ status }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[44%]">Halaman</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Diperbarui</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((page) => {
                  const locked = CORE_PAGES.includes(page.slug);
                  return (
                    <tr key={page.id}>
                      <td>
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-cream text-gold-700">
                            <FileText className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 font-display text-[15px] font-semibold leading-snug text-wine-950">
                              {page.title}
                              {locked && (
                                <LockKeyhole className="h-3 w-3 text-stone-300" />
                              )}
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-stone-500">
                              {page.subtitle}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-[9px] text-stone-500">
                          /halaman/{page.slug}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={page.status} />
                      </td>
                      <td className="whitespace-nowrap text-[9px] text-stone-400">
                        {timeAgo(page.updated_at)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-3">
                          {page.status === "published" && (
                            <Link
                              href={`/halaman/${page.slug}`}
                              target="_blank"
                              className="text-stone-400 transition hover:text-wine-900"
                              title="Lihat di situs"
                            >
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          <Link
                            href={`/admin/halaman/${page.id}`}
                            className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                          >
                            <PenLine className="h-3 w-3" /> Sunting
                          </Link>
                          {!locked && (
                            <form action={deletePageAction}>
                              <input type="hidden" name="id" value={page.id} />
                              <DeleteButton
                                message={`Hapus halaman “${page.title}” secara permanen?`}
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
              icon={<Layers className="h-5 w-5" />}
              title="Tidak ada halaman ditemukan"
              description="Buat halaman baru untuk menambah konten statis di situs keuskupan."
              action={
                <PrimaryLink href="/admin/halaman/baru">
                  <Plus className="h-3.5 w-3.5" /> Buat Halaman
                </PrimaryLink>
              }
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <LockKeyhole className="h-3 w-3" />
        Halaman inti keuskupan (profil, sejarah, visi-misi) tidak dapat dihapus.
      </p>
    </>
  );
}
