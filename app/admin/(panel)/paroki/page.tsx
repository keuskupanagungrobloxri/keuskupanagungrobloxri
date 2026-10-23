import Link from "next/link";
import {
  ArrowUpRight,
  Church,
  MapPin,
  PenLine,
  Plus,
  UserRound,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAllParishes } from "@/lib/admin-data";
import { deleteParishAction } from "@/lib/actions/parishes";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminParishesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin("parishes.manage");
  const { q, status } = await searchParams;
  const all = getAllParishes(q || "");
  const filtered = status && status !== "semua"
    ? all.filter((parish) => parish.status === status)
    : all;

  return (
    <>
      <AdminPageHeader
        eyebrow="Pelayanan & Data"
        title="Paroki"
        description="Kelola direktori paroki, alamat, pastor, dan informasi pelayanan yang tampil di situs publik."
        action={
          <PrimaryLink href="/admin/paroki/baru">
            <Plus className="h-3.5 w-3.5" /> Tambah Paroki
          </PrimaryLink>
        }
      />

      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "semua", label: `Semua (${all.length})` },
            {
              key: "active",
              label: `Aktif (${all.filter((item) => item.status === "active").length})`,
            },
            {
              key: "inactive",
              label: `Nonaktif (${all.filter((item) => item.status === "inactive").length})`,
            },
          ].map((item) => {
            const active = (status || "semua") === item.key;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (item.key !== "semua") params.set("status", item.key);
            const href = params.toString()
              ? `/admin/paroki?${params.toString()}`
              : "/admin/paroki";
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
        <SearchBox
          action="/admin/paroki"
          defaultValue={q}
          placeholder="Cari paroki, kevikepan, kota..."
          hidden={{ status }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[34%]">Paroki</th>
                  <th>Kevikepan</th>
                  <th>Pastor</th>
                  <th>Status</th>
                  <th>Urutan</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((parish) => (
                  <tr key={parish.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-14 shrink-0 overflow-hidden bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={parish.image || "/images/cathedral-exterior.jpg"}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-wine-950">
                            {parish.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-[9px] text-stone-400">
                            <MapPin className="h-2.5 w-2.5 text-gold-600" />
                            {parish.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-[10px]">{parish.vicariate}</td>
                    <td>
                      <span className="flex items-center gap-1.5 text-[10px] text-stone-600">
                        <UserRound className="h-3 w-3 text-gold-600" />
                        {parish.pastor_name || "—"}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={parish.status} />
                    </td>
                    <td className="text-[10px] font-semibold text-stone-500">
                      {parish.order_index}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-3">
                        {parish.status === "active" && (
                          <Link
                            href={`/paroki/${parish.slug}`}
                            target="_blank"
                            className="text-stone-400 transition hover:text-wine-900"
                            title="Lihat di situs"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/paroki/${parish.id}`}
                          className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                        >
                          <PenLine className="h-3 w-3" /> Sunting
                        </Link>
                        <form action={deleteParishAction}>
                          <input type="hidden" name="id" value={parish.id} />
                          <DeleteButton
                            message={`Hapus paroki “${parish.name}” beserta jadwal misanya?`}
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
              icon={<Church className="h-5 w-5" />}
              title="Tidak ada paroki ditemukan"
              description="Coba ubah kata kunci atau filter status, atau tambahkan paroki baru."
              action={
                <PrimaryLink href="/admin/paroki/baru">
                  <Plus className="h-3.5 w-3.5" /> Tambah Paroki
                </PrimaryLink>
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
