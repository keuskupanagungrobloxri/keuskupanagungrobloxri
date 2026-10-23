import Link from "next/link";
import { Activity, Clock3, ShieldCheck, UserCog } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllLogs } from "@/lib/admin-data";
import { formatDateTimeID, timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  SearchBox,
  StatCard,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const ENTITY_LABEL: Record<string, string> = {
  articles: "Berita",
  events: "Agenda",
  masses: "Liturgi",
  parishes: "Paroki",
  clergy: "Klerus",
  announcements: "Pengumuman",
  pages: "Halaman",
  galleries: "Galeri",
  messages: "Pesan",
  users: "Pengguna",
  roles: "Matriks Peran",
  settings: "Pengaturan",
  auth: "Autentikasi",
};

const ENTITY_STYLE: Record<string, string> = {
  articles: "bg-blue-50 text-blue-700 border-blue-200",
  events: "bg-emerald-50 text-emerald-700 border-emerald-200",
  masses: "bg-gold-50 text-gold-800 border-gold-200",
  parishes: "bg-violet-50 text-violet-700 border-violet-200",
  clergy: "bg-cyan-50 text-cyan-700 border-cyan-200",
  announcements: "bg-amber-50 text-amber-700 border-amber-200",
  pages: "bg-stone-100 text-stone-600 border-stone-200",
  galleries: "bg-rose-50 text-rose-700 border-rose-200",
  messages: "bg-indigo-50 text-indigo-700 border-indigo-200",
  users: "bg-wine-50 text-wine-800 border-wine-100",
  roles: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  settings: "bg-teal-50 text-teal-700 border-teal-200",
  auth: "bg-stone-100 text-stone-600 border-stone-200",
};

export default async function AdminLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; entity?: string }>;
}) {
  await requireAdmin("logs.view");
  const { q, entity } = await searchParams;
  const all = getAllLogs(300);
  const keyword = (q || "").toLowerCase();
  const filtered = all.filter((log) => {
    if (entity && entity !== "semua" && log.entity !== entity) return false;
    if (!keyword) return true;
    return `${log.user_name} ${log.action} ${log.details || ""} ${log.entity}`
      .toLowerCase()
      .includes(keyword);
  });

  const entities = Array.from(new Set(all.map((log) => log.entity)));
  const uniqueUsers = new Set(all.map((log) => log.user_id || log.user_name)).size;
  const today = all.filter(
    (log) => new Date(log.created_at).toDateString() === new Date().toDateString(),
  ).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Administrasi Situs"
        title="Log Aktivitas"
        description="Jejak audit tindakan pengguna panel: publikasi, perubahan data, pengaturan pengguna, dan aktivitas masuk."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Catatan terbaru"
          value={all.length}
          hint="Hingga 300 aktivitas terakhir"
          icon={<Activity className="h-4 w-4" />}
          tone="wine"
        />
        <StatCard
          label="Aktivitas hari ini"
          value={today}
          hint="Sejak tengah malam waktu lokal"
          icon={<Clock3 className="h-4 w-4" />}
          tone="gold"
        />
        <StatCard
          label="Pengguna tercatat"
          value={uniqueUsers}
          hint="Termasuk aktivitas autentikasi"
          icon={<UserCog className="h-4 w-4" />}
          tone="green"
        />
      </div>

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href={q ? `/admin/log?q=${encodeURIComponent(q)}` : "/admin/log"}
            className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
              !entity || entity === "semua"
                ? "border-wine-900 bg-wine-900 text-white"
                : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
            }`}
          >
            Semua
          </Link>
          {entities.map((name) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            params.set("entity", name);
            return (
              <Link
                key={name}
                href={`/admin/log?${params.toString()}`}
                className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
                  entity === name
                    ? "border-wine-900 bg-wine-900 text-white"
                    : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
                }`}
              >
                {ENTITY_LABEL[name] || name}
              </Link>
            );
          })}
        </div>
        <SearchBox
          action="/admin/log"
          defaultValue={q}
          placeholder="Cari pengguna, tindakan, atau detail..."
          hidden={{ entity }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[22%]">Waktu</th>
                  <th>Pengguna</th>
                  <th className="w-[30%]">Tindakan</th>
                  <th>Modul</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id}>
                    <td className="whitespace-nowrap">
                      <span className="block text-[10px] font-semibold text-stone-700">
                        {formatDateTimeID(log.created_at)}
                      </span>
                      <span className="mt-0.5 block text-[8px] uppercase tracking-[0.08em] text-stone-400">
                        {timeAgo(log.created_at)}
                      </span>
                    </td>
                    <td>
                      <span className="flex items-center gap-2 text-[10px] font-semibold text-wine-950">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-wine-900 font-display text-[8px] text-gold-200">
                          {log.user_name.slice(0, 2).toUpperCase()}
                        </span>
                        {log.user_name}
                      </span>
                    </td>
                    <td className="text-[10px] font-semibold text-stone-700">
                      {log.action}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          ENTITY_STYLE[log.entity] || ENTITY_STYLE.auth
                        }`}
                      >
                        {ENTITY_LABEL[log.entity] || log.entity}
                      </span>
                    </td>
                    <td>
                      <span className="line-clamp-2 max-w-[260px] text-[9px] leading-4 text-stone-500">
                        {log.details || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Tidak ada aktivitas ditemukan"
              description="Coba ubah filter modul atau kata kunci pencarian."
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <ShieldCheck className="h-3 w-3" />
        Log aktivitas bersifat catatan audit dan tidak dapat disunting dari panel.
      </p>
    </>
  );
}
