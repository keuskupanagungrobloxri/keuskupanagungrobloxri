import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  Clock3,
  MapPin,
  PenLine,
  Plus,
  Sparkles,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllMasses, getAllParishes } from "@/lib/admin-data";
import { deleteMassAction } from "@/lib/actions/liturgy";
import { formatTime } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminLiturgyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; parish?: string; status?: string }>;
}) {
  await requireAdmin("liturgy.manage");
  const { q, parish, status } = await searchParams;
  const parishes = getAllParishes();
  const all = getAllMasses();
  const keyword = (q || "").toLowerCase();

  const filtered = all.filter((mass) => {
    if (parish && parish !== "semua" && mass.parish_id !== parish) return false;
    if (status && status !== "semua" && mass.status !== status) return false;
    if (!keyword) return true;
    return [mass.day, mass.time, mass.type, mass.location || "", mass.note || "", mass.parish_name || ""]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });

  const activeCount = all.filter((mass) => mass.status === "active").length;
  const parishCount = new Set(all.map((mass) => mass.parish_id)).size;

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title="Liturgi & Jadwal Misa"
        description="Atur jadwal misa dan ibadat setiap paroki. Jadwal berstatus aktif akan tampil di halaman liturgi publik."
        action={
          <PrimaryLink href="/admin/liturgi/baru">
            <Plus className="h-3.5 w-3.5" /> Tambah Jadwal
          </PrimaryLink>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="admin-card flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-wine-50 text-wine-800">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-wine-950">
              {all.length}
            </p>
            <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.13em] text-stone-400">
              Total jadwal
            </p>
          </div>
        </div>
        <div className="admin-card flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-emerald-50 text-emerald-700">
            <CalendarClock className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-wine-950">
              {activeCount}
            </p>
            <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.13em] text-stone-400">
              Jadwal aktif
            </p>
          </div>
        </div>
        <div className="admin-card flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold-50 text-gold-700">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-wine-950">
              {parishCount}
            </p>
            <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.13em] text-stone-400">
              Paroki terlayani
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: "Semua" },
            { key: "active", label: "Aktif" },
            { key: "inactive", label: "Nonaktif" },
          ].map((item) => {
            const active = (status || "semua") === item.key;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (parish && parish !== "semua") params.set("parish", parish);
            if (item.key !== "semua") params.set("status", item.key);
            const href = params.toString()
              ? `/admin/liturgi?${params.toString()}`
              : "/admin/liturgi";
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
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form action="/admin/liturgi" className="flex items-center gap-2">
            {q ? <input type="hidden" name="q" value={q} /> : null}
            {status && status !== "semua" ? (
              <input type="hidden" name="status" value={status} />
            ) : null}
            <select
              name="parish"
              defaultValue={parish || "semua"}
              className="admin-input sm:w-52"
            >
              <option value="semua">Semua paroki</option>
              {parishes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="shrink-0 border border-stone-300 bg-white px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
            >
              Filter
            </button>
          </form>
          <SearchBox
            action="/admin/liturgi"
            defaultValue={q}
            placeholder="Cari hari, jenis, lokasi..."
            hidden={{ parish, status }}
          />
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[27%]">Paroki</th>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Jenis misa</th>
                  <th>Lokasi</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((mass) => (
                  <tr key={mass.id}>
                    <td>
                      <p className="font-display text-[14px] font-semibold leading-snug text-wine-950">
                        {mass.parish_name}
                      </p>
                      <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-stone-400">
                        Urutan {mass.order_index}
                      </p>
                    </td>
                    <td className="whitespace-nowrap text-[10px] font-semibold text-stone-700">
                      {mass.day}
                    </td>
                    <td className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-wine-900">
                        <Clock3 className="h-3 w-3 text-gold-600" />
                        {formatTime(mass.time)}
                      </span>
                    </td>
                    <td className="text-[10px]">{mass.type}</td>
                    <td>
                      <span className="flex max-w-[180px] items-start gap-1.5 text-[10px] text-stone-600">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" />
                        <span className="line-clamp-2">{mass.location || "—"}</span>
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={mass.status} />
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/liturgi/${mass.id}`}
                          className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                        >
                          <PenLine className="h-3 w-3" /> Sunting
                        </Link>
                        <form action={deleteMassAction}>
                          <input type="hidden" name="id" value={mass.id} />
                          <DeleteButton
                            message={`Hapus jadwal ${mass.day} ${mass.time} di ${mass.parish_name}?`}
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
              icon={<Sparkles className="h-5 w-5" />}
              title="Tidak ada jadwal ditemukan"
              description="Coba ubah filter paroki atau kata kunci, atau tambahkan jadwal misa baru."
              action={
                <PrimaryLink href="/admin/liturgi/baru">
                  <Plus className="h-3.5 w-3.5" /> Tambah Jadwal
                </PrimaryLink>
              }
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <ArrowUpRight className="h-3 w-3" />
        Jadwal nonaktif tetap tersimpan di panel namun tidak ditampilkan di halaman liturgi publik.
      </p>
    </>
  );
}
