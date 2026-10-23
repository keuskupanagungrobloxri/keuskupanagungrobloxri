import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  PenLine,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllClergy } from "@/lib/admin-data";
import { deleteClergyAction } from "@/lib/actions/clergy";
import { CLERGY_RANKS } from "@/lib/constants";
import { initials } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminClergyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rank?: string }>;
}) {
  await requireAdmin("clergy.manage");
  const { q, rank } = await searchParams;
  const all = getAllClergy().filter((person) => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return [person.name, person.title, person.rank, person.assignment]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(needle));
  });
  const filtered = rank && rank !== "semua"
    ? all.filter((person) => person.rank === rank)
    : all;

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title="Klerus"
        description="Kelola direktori uskup, imam, diakon, dan frater yang tampil pada halaman profil keuskupan."
        action={
          <PrimaryLink href="/admin/klerus/baru">
            <Plus className="h-3.5 w-3.5" /> Tambah Klerus
          </PrimaryLink>
        }
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href={q ? `/admin/klerus?q=${encodeURIComponent(q)}` : "/admin/klerus"}
            className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
              !rank || rank === "semua"
                ? "border-wine-900 bg-wine-900 text-white"
                : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
            }`}
          >
            Semua ({all.length})
          </Link>
          {CLERGY_RANKS.map((item) => {
            const total = all.filter((person) => person.rank === item).length;
            if (!total) return null;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            params.set("rank", item);
            return (
              <Link
                key={item}
                href={`/admin/klerus?${params.toString()}`}
                className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
                  rank === item
                    ? "border-wine-900 bg-wine-900 text-white"
                    : "border-stone-300 bg-white text-stone-500 hover:border-stone-400 hover:text-wine-900"
                }`}
              >
                {item} ({total})
              </Link>
            );
          })}
        </div>
        <SearchBox
          action="/admin/klerus"
          defaultValue={q}
          placeholder="Cari nama, jabatan, penugasan..."
          hidden={{ rank }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[34%]">Nama</th>
                  <th>Panggilan</th>
                  <th>Penugasan</th>
                  <th>Status</th>
                  <th>Urutan</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((person) => (
                  <tr key={person.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-stone-200 bg-wine-950 font-display text-xs text-gold-300">
                          {person.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={person.image}
                              alt={person.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials(person.name)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-[15px] font-semibold leading-snug text-wine-950">
                            {person.name}
                          </p>
                          <p className="mt-0.5 text-[9px] text-stone-400">
                            {person.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="flex items-center gap-1.5 text-[10px] text-stone-600">
                        <ShieldCheck className="h-3 w-3 text-gold-600" />
                        {person.rank}
                      </span>
                    </td>
                    <td className="text-[10px]">
                      <span className="flex max-w-[200px] items-start gap-1.5">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" />
                        <span className="line-clamp-2">{person.assignment || "—"}</span>
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={person.status} />
                    </td>
                    <td className="text-[10px] font-semibold text-stone-500">
                      {person.order_index}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href="/profil/klerus"
                          target="_blank"
                          className="text-stone-400 transition hover:text-wine-900"
                          title="Lihat direktori publik"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          href={`/admin/klerus/${person.id}`}
                          className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                        >
                          <PenLine className="h-3 w-3" /> Sunting
                        </Link>
                        <form action={deleteClergyAction}>
                          <input type="hidden" name="id" value={person.id} />
                          <DeleteButton
                            message={`Hapus data klerus “${person.name}” dari direktori?`}
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
              icon={<Users className="h-5 w-5" />}
              title="Tidak ada data klerus"
              description="Coba ubah filter atau kata kunci, atau tambahkan data klerus baru."
              action={
                <PrimaryLink href="/admin/klerus/baru">
                  <Plus className="h-3.5 w-3.5" /> Tambah Klerus
                </PrimaryLink>
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
