import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  PenLine,
  Plus,
  Clock3,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllEvents } from "@/lib/admin-data";
import { deleteEventAction } from "@/lib/actions/events";
import { formatDateTimeID, timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin("events.manage");
  const { q, status } = await searchParams;
  const all = getAllEvents(q || "");
  const filtered = status && status !== "semua"
    ? all.filter((event) => event.status === status)
    : all;
  const counts = {
    semua: all.length,
    upcoming: all.filter((item) => item.status === "upcoming").length,
    ongoing: all.filter((item) => item.status === "ongoing").length,
    done: all.filter((item) => item.status === "done").length,
    draft: all.filter((item) => item.status === "draft").length,
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title="Agenda"
        description="Atur kegiatan pastoral, liturgi, pembinaan, dan karya pelayanan keuskupan yang tampil di halaman agenda publik."
        action={
          <PrimaryLink href="/admin/agenda/baru">
            <Plus className="h-3.5 w-3.5" /> Tambah Agenda
          </PrimaryLink>
        }
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: "Semua" },
            { key: "upcoming", label: "Akan datang" },
            { key: "ongoing", label: "Berlangsung" },
            { key: "done", label: "Selesai" },
            { key: "draft", label: "Draf" },
          ].map((item) => {
            const active = (status || "semua") === item.key;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (item.key !== "semua") params.set("status", item.key);
            const href = params.toString()
              ? `/admin/agenda?${params.toString()}`
              : "/admin/agenda";
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
          action="/admin/agenda"
          defaultValue={q}
          placeholder="Cari agenda, lokasi, kategori..."
          hidden={{ status }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[36%]">Agenda</th>
                  <th>Waktu</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th>Diperbarui</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-14 shrink-0 overflow-hidden bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={event.image || "/images/cathedral-altar.jpg"}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <p className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-wine-950">
                            {event.title}
                          </p>
                          <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.1em] text-gold-700">
                            {event.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-[10px]">
                      <span className="flex items-center gap-1.5 text-stone-700">
                        <CalendarDays className="h-3 w-3 text-gold-600" />
                        {formatDateTimeID(event.start_at)}
                      </span>
                    </td>
                    <td>
                      <span className="flex max-w-[170px] items-start gap-1.5 text-[10px] text-stone-600">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" />
                        <span className="line-clamp-2">{event.location}</span>
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="whitespace-nowrap text-[9px] text-stone-400">
                      {timeAgo(event.updated_at)}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-3">
                        {event.status !== "draft" && (
                          <Link
                            href={`/agenda/${event.slug}`}
                            target="_blank"
                            className="text-stone-400 transition hover:text-wine-900"
                            title="Lihat di situs"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/agenda/${event.id}`}
                          className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                        >
                          <PenLine className="h-3 w-3" /> Sunting
                        </Link>
                        <form action={deleteEventAction}>
                          <input type="hidden" name="id" value={event.id} />
                          <DeleteButton
                            message={`Hapus agenda “${event.title}” secara permanen?`}
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
              icon={<CalendarDays className="h-5 w-5" />}
              title="Tidak ada agenda ditemukan"
              description="Coba ubah filter status atau kata kunci, atau tambahkan agenda baru."
              action={
                <PrimaryLink href="/admin/agenda/baru">
                  <Plus className="h-3.5 w-3.5" /> Tambah Agenda
                </PrimaryLink>
              }
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <Clock3 className="h-3 w-3" />
        Agenda berstatus draf tidak akan tampil di situs publik sampai dipublikasikan.
      </p>
    </>
  );
}
