import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Church,
  Clock3,
  FileText,
  Inbox,
  PenLine,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { requireAdmin, hasPermission } from "@/lib/auth";
import {
  getDashboardChart,
  getDashboardStats,
  getMessages,
  getRecentArticles,
  getRecentLogs,
} from "@/lib/admin-data";
import { ROLE_META } from "@/lib/permissions";
import { firstName, formatDateID, initials, timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  Panel,
  PrimaryLink,
  StatCard,
  StatusBadge,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAdmin("dashboard.view");
  const can = (permission: string) => hasPermission(user, permission);
  const stats = getDashboardStats();
  const articles = can("articles.view") ? getRecentArticles(5) : [];
  const logs = can("logs.view") ? getRecentLogs(7) : [];
  const chart = getDashboardChart();
  const messages = can("messages.view") ? getMessages().slice(0, 4) : [];
  const role = ROLE_META[user.role];

  const greetingName = firstName(user.name);
  const maxChart = Math.max(1, ...chart.map((item) => item.total));

  const quickActions = [
    can("articles.create") && {
      href: "/admin/berita/baru",
      label: "Tulis berita",
      icon: PenLine,
    },
    can("events.manage") && {
      href: "/admin/agenda/baru",
      label: "Tambah agenda",
      icon: CalendarDays,
    },
    can("announcements.manage") && {
      href: "/admin/pengumuman/baru",
      label: "Buat pengumuman",
      icon: FileText,
    },
    can("media.manage") && {
      href: "/admin/galeri/baru",
      label: "Unggah foto",
      icon: Church,
    },
  ].filter(Boolean) as { href: string; label: string; icon: typeof PenLine }[];

  return (
    <>
      <div className="mb-7 overflow-hidden bg-wine-950 text-white">
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <div className="absolute inset-0 bg-cross-pattern opacity-60" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-gold-400">
                {formatDateID(new Date(), {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h1 className="mt-3 font-display text-[2rem] font-medium leading-tight sm:text-[2.6rem]">
                Selamat datang, {greetingName}.
              </h1>
              <p className="mt-2 max-w-xl text-[11px] leading-6 text-white/50">
                Semoga pelayanan Anda hari ini menjadi berkat. Berikut ringkasan
                kehidupan keuskupan dan panel administrasi.
              </p>
            </div>
            <div className="flex items-center gap-3 border border-white/15 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-white/5 font-display text-sm text-gold-300">
                {initials(user.name)}
              </span>
              <div>
                <p className="text-[11px] font-bold text-white">{user.name}</p>
                <p className="mt-0.5 text-[7px] font-extrabold uppercase tracking-[0.14em] text-gold-400">
                  {role.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Berita terbit"
          value={stats.published}
          hint={`${stats.drafts} draf menunggu penyuntingan`}
          icon={<BookOpen className="h-4 w-4" />}
          href="/admin/berita"
          tone="wine"
        />
        <StatCard
          label="Agenda & kegiatan"
          value={stats.events}
          hint="Termasuk agenda mendatang"
          icon={<CalendarDays className="h-4 w-4" />}
          href={can("events.manage") ? "/admin/agenda" : undefined}
          tone="gold"
        />
        <StatCard
          label="Paroki aktif"
          value={stats.parishes}
          hint={`${stats.clergy} klerus terdaftar`}
          icon={<Church className="h-4 w-4" />}
          href={can("parishes.manage") ? "/admin/paroki" : undefined}
          tone="green"
        />
        {can("messages.view") && (
          <StatCard
            label="Pesan baru"
            value={stats.newMessages}
            hint="Belum ditindaklanjuti"
            icon={<Inbox className="h-4 w-4" />}
            href="/admin/pesan"
            tone={stats.newMessages ? "rose" : "blue"}
          />
        )}
      </div>

      {quickActions.length > 0 && (
        <div className="mb-7 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
            Aksi cepat
          </span>
          {quickActions.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 border border-stone-300 bg-white px-3 py-2 text-[9px] font-bold text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
            >
              <Icon className="h-3 w-3 text-gold-600" />
              {label}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.32fr_.68fr]">
        <div className="space-y-5">
          <Panel
            title="Berita terbaru"
            description="Pembaruan konten terakhir di panel"
            action={
              <Link
                href="/admin/berita"
                className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-wine-800 transition hover:text-gold-700"
              >
                Kelola berita <ArrowRight className="h-3 w-3" />
              </Link>
            }
            bodyClassName="p-0"
          >
            {articles.length ? (
              <div className="table-wrap">
                <table className="data-table min-w-[620px]">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Status</th>
                      <th>Kategori</th>
                      <th>Diperbarui</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => (
                      <tr key={article.id}>
                        <td>
                          <Link
                            href={`/admin/berita/${article.id}`}
                            className="font-display text-[15px] font-semibold leading-snug text-wine-950 transition hover:text-gold-700"
                          >
                            {article.title}
                          </Link>
                          <p className="mt-0.5 text-[9px] text-stone-400">
                            {article.author_name || "Redaksi"} · {article.views} dibaca
                          </p>
                        </td>
                        <td>
                          <StatusBadge status={article.status} />
                        </td>
                        <td className="text-[10px]">{article.category}</td>
                        <td className="whitespace-nowrap text-[10px] text-stone-400">
                          {timeAgo(article.updated_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-5">
                <EmptyState
                  icon={<BookOpen className="h-5 w-5" />}
                  title="Belum ada berita"
                  description="Mulai dengan menulis berita pertama untuk situs keuskupan."
                  action={
                    can("articles.create") ? (
                      <PrimaryLink href="/admin/berita/baru">
                        <Plus className="h-3.5 w-3.5" /> Tulis Berita
                      </PrimaryLink>
                    ) : undefined
                  }
                />
              </div>
            )}
          </Panel>

          <div className={`grid gap-5${can("logs.view") ? " md:grid-cols-2" : ""}`}>
            <Panel title="Produktivitas publikasi" description="Enam bulan terakhir">
              {chart.length ? (
                <div className="flex h-[150px] items-end gap-2.5">
                  {chart.map((item) => {
                    const month = new Date(`${item.month}-01T00:00:00`).toLocaleDateString(
                      "id-ID",
                      { month: "short" },
                    );
                    return (
                      <div
                        key={item.month}
                        className="flex flex-1 flex-col items-center justify-end gap-1.5"
                      >
                        <span className="text-[9px] font-bold text-stone-500">
                          {item.total}
                        </span>
                        <div
                          className="w-full bg-wine-800/85 transition hover:bg-gold-500"
                          style={{
                            height: `${Math.max(8, (item.total / maxChart) * 100)}px`,
                          }}
                        />
                        <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-stone-400">
                          {month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-[11px] text-stone-400">
                  Belum ada data publikasi.
                </p>
              )}
            </Panel>

            {can("logs.view") && (
            <Panel
              title="Log aktivitas"
              description="Jejak terbaru pengguna panel"
              action={
                can("logs.view") ? (
                  <Link
                    href="/admin/log"
                    className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-wine-800"
                  >
                    Semua
                  </Link>
                ) : undefined
              }
            >
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                      <Activity className="h-3 w-3" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold leading-4 text-stone-700">
                        {log.action}
                      </p>
                      <p className="truncate text-[9px] text-stone-400">
                        {log.user_name} · {timeAgo(log.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="py-6 text-center text-[11px] text-stone-400">
                    Belum ada aktivitas.
                  </p>
                )}
              </div>
            </Panel>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <Panel
            title="Pesan umat"
            description="Pesan terbaru dari formulir kontak"
            action={
              can("messages.view") ? (
                <Link
                  href="/admin/pesan"
                  className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-wine-800"
                >
                  Semua
                </Link>
              ) : undefined
            }
            bodyClassName="p-0"
          >
            {can("messages.view") ? (
              messages.length ? (
                <div className="divide-y divide-stone-100">
                  {messages.map((message) => (
                    <Link
                      key={message.id}
                      href={`/admin/pesan/${message.id}`}
                      className="group block px-5 py-4 transition hover:bg-cream/50"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-wine-950">
                          {message.name}
                        </span>
                        <StatusBadge status={message.status} />
                      </div>
                      <p className="mt-1 truncate text-[10px] font-semibold text-stone-600">
                        {message.subject}
                      </p>
                      <p className="mt-0.5 text-[8px] uppercase tracking-[0.08em] text-stone-400">
                        {timeAgo(message.created_at)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-10 text-center text-[11px] text-stone-400">
                  Belum ada pesan masuk.
                </p>
              )
            ) : (
              <div className="px-5 py-8 text-center">
                <ShieldCheck className="mx-auto h-6 w-6 text-stone-300" />
                <p className="mt-2 text-[10px] text-stone-400">
                  Peran Anda tidak memiliki akses pesan umat.
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Ringkasan panel" description="Data yang Anda kelola">
            <dl className="space-y-3 text-[10px]">
              {[
                { label: "Total berita", value: stats.articles, icon: BookOpen },
                { label: "Draf", value: stats.drafts, icon: PenLine },
                { label: "Klerus", value: stats.clergy, icon: Users },
                { label: "Foto galeri", value: stats.gallery, icon: Church },
                { label: "Pengguna", value: stats.users, icon: ShieldCheck },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-stone-100 pb-2.5 last:border-0 last:pb-0"
                >
                  <dt className="flex items-center gap-2 text-stone-500">
                    <Icon className="h-3 w-3 text-gold-600" />
                    {label}
                  </dt>
                  <dd className="font-display text-base font-semibold text-wine-950">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <div className="admin-card bg-cream p-5">
            <Clock3 className="h-4 w-4 text-gold-600" />
            <p className="mt-3 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
              Peran Anda
            </p>
            <p className="mt-1 font-display text-xl font-semibold text-wine-950">
              {role.label}
            </p>
            <p className="mt-1.5 text-[10px] leading-5 text-stone-500">
              {role.description}
            </p>
            <Link
              href="/admin/akun"
              className="mt-3 inline-flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-wine-800 transition hover:text-gold-700"
            >
              Lihat hak akses <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
