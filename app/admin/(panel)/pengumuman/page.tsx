import Link from "next/link";
import {
  BellRing,
  CalendarDays,
  Megaphone,
  PenLine,
  Plus,
  Power,
  Sparkles,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllAnnouncements } from "@/lib/admin-data";
import {
  deleteAnnouncementAction,
  toggleAnnouncementAction,
} from "@/lib/actions/announcements";
import { formatDateTimeID, timeAgo } from "@/lib/utils";
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

const TONE_LABEL: Record<string, string> = {
  info: "Informasi",
  important: "Penting",
  liturgy: "Liturgi",
};

const TONE_STYLE: Record<string, string> = {
  info: "border-blue-200 bg-blue-50 text-blue-700",
  important: "border-rose-200 bg-rose-50 text-rose-700",
  liturgy: "border-gold-300 bg-gold-50 text-gold-800",
};

export default async function AdminAnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin("announcements.manage");
  const { q, status } = await searchParams;
  const all = getAllAnnouncements();
  const keyword = (q || "").toLowerCase();
  const searched = keyword
    ? all.filter((item) =>
        `${item.title} ${item.message} ${item.tone}`
          .toLowerCase()
          .includes(keyword),
      )
    : all;
  const filtered =
    status && status !== "semua"
      ? searched.filter((item) => (status === "active" ? item.active : !item.active))
      : searched;

  const counts = {
    semua: all.length,
    active: all.filter((item) => item.active).length,
    inactive: all.filter((item) => !item.active).length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title="Pengumuman"
        description="Sampaikan kabar penting, informasi liturgi, dan pemberitahuan pastoral yang tampil di seluruh halaman publik."
        action={
          <PrimaryLink href="/admin/pengumuman/baru">
            <Plus className="h-3.5 w-3.5" /> Buat Pengumuman
          </PrimaryLink>
        }
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: "Semua" },
            { key: "active", label: "Aktif" },
            { key: "inactive", label: "Nonaktif" },
          ].map((item) => {
            const active = (status || "semua") === item.key;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (item.key !== "semua") params.set("status", item.key);
            const href = params.toString()
              ? `/admin/pengumuman?${params.toString()}`
              : "/admin/pengumuman";
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
          action="/admin/pengumuman"
          defaultValue={q}
          placeholder="Cari judul atau isi pengumuman..."
          hidden={{ status }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[42%]">Pengumuman</th>
                  <th>Jenis</th>
                  <th>Periode tayang</th>
                  <th>Status</th>
                  <th>Dibuat</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream text-gold-700">
                          {item.tone === "important" ? (
                            <BellRing className="h-3.5 w-3.5" />
                          ) : item.tone === "liturgy" ? (
                            <Sparkles className="h-3.5 w-3.5" />
                          ) : (
                            <Megaphone className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-display text-[15px] font-semibold leading-snug text-wine-950">
                            {item.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-stone-500">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          TONE_STYLE[item.tone] || TONE_STYLE.info
                        }`}
                      >
                        {TONE_LABEL[item.tone] || item.tone}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-[9px] text-stone-500">
                      {item.starts_at || item.ends_at ? (
                        <>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3 w-3 text-gold-600" />
                            {item.starts_at
                              ? formatDateTimeID(item.starts_at)
                              : "Sekarang"}
                          </span>
                          <span className="mt-0.5 block pl-4 text-[8px] text-stone-400">
                            s.d.{" "}
                            {item.ends_at
                              ? formatDateTimeID(item.ends_at)
                              : "tanpa batas"}
                          </span>
                        </>
                      ) : (
                        <span className="text-[9px] text-stone-400">
                          Selalu tampil
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={item.active ? "active" : "inactive"} />
                    </td>
                    <td className="whitespace-nowrap text-[9px] text-stone-400">
                      {timeAgo(item.created_at)}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2.5">
                        <form action={toggleAnnouncementAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <ConfirmSubmitButton
                            message={
                              item.active
                                ? `Nonaktifkan pengumuman “${item.title}”?`
                                : `Aktifkan pengumuman “${item.title}” agar tampil di situs?`
                            }
                            className={
                              item.active
                                ? "text-amber-600 hover:text-amber-700"
                                : "text-emerald-600 hover:text-emerald-700"
                            }
                          >
                            <Power className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only">
                              {item.active ? "Nonaktifkan" : "Aktifkan"}
                            </span>
                          </ConfirmSubmitButton>
                        </form>
                        <Link
                          href={`/admin/pengumuman/${item.id}`}
                          className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                        >
                          <PenLine className="h-3 w-3" /> Sunting
                        </Link>
                        <form action={deleteAnnouncementAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <DeleteButton
                            message={`Hapus pengumuman “${item.title}” secara permanen?`}
                          />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={<Megaphone className="h-5 w-5" />}
              title="Tidak ada pengumuman ditemukan"
              description="Buat pengumuman baru untuk menyampaikan kabar penting kepada umat."
              action={
                <PrimaryLink href="/admin/pengumuman/baru">
                  <Plus className="h-3.5 w-3.5" /> Buat Pengumuman
                </PrimaryLink>
              }
            />
          </div>
        )}
      </div>

      <p className="mt-4 text-[9px] font-semibold text-stone-400">
        Pengumuman aktif ditampilkan pada bilah informasi di bagian atas situs publik.
      </p>
    </>
  );
}
