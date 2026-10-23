import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  PenLine,
  Plus,
  Power,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { hasPermission, requireAdmin } from "@/lib/auth";
import { getAllUsers } from "@/lib/admin-data";
import { toggleUserActiveAction } from "@/lib/actions/users";
import { canManageUserRole, ROLE_META, ROLES } from "@/lib/permissions";
import { formatDateTimeID, initials, timeAgo } from "@/lib/utils";
import {
  AdminPageHeader,
  EmptyState,
  PrimaryLink,
  SearchBox,
  StatusBadge,
} from "@/components/admin/ui";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string }>;
}) {
  const actor = await requireAdmin("users.view");
  const { q, role, status } = await searchParams;
  const all = getAllUsers();
  const canManage = hasPermission(actor, "users.manage");
  const keyword = (q || "").toLowerCase();

  const filtered = all.filter((user) => {
    if (role && role !== "semua" && user.role !== role) return false;
    if (status === "active" && !user.active) return false;
    if (status === "inactive" && user.active) return false;
    if (!keyword) return true;
    return `${user.name} ${user.email} ${user.title || ""}`
      .toLowerCase()
      .includes(keyword);
  });

  const activeCount = all.filter((user) => user.active).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Administrasi Situs"
        title="Pengguna"
        description="Kelola akun pengurus, klerus, dan umat yang memiliki akses ke panel. Hak akses mengikuti matriks peran."
        action={
          canManage ? (
            <PrimaryLink href="/admin/pengguna/baru">
              <Plus className="h-3.5 w-3.5" /> Tambah Pengguna
            </PrimaryLink>
          ) : undefined
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="admin-card flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-wine-50 text-wine-800">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-wine-950">
              {all.length}
            </p>
            <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.13em] text-stone-400">
              Total akun
            </p>
          </div>
        </div>
        <div className="admin-card flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-wine-950">
              {activeCount}
            </p>
            <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.13em] text-stone-400">
              Akun aktif
            </p>
          </div>
        </div>
        <div className="admin-card flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold-50 text-gold-700">
            <UserCog className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none text-wine-950">
              {new Set(all.map((user) => user.role)).size}
            </p>
            <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.13em] text-stone-400">
              Peran terdaftar
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <form action="/admin/pengguna" className="flex items-center gap-2">
            {q ? <input type="hidden" name="q" value={q} /> : null}
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <select
              name="role"
              defaultValue={role || "semua"}
              className="admin-input sm:w-48"
            >
              <option value="semua">Semua peran</option>
              {ROLES.map((item) => (
                <option key={item} value={item}>
                  {ROLE_META[item].label}
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
          <div className="flex flex-wrap gap-2">
            {[
              { key: "", label: "Semua status" },
              { key: "active", label: "Aktif" },
              { key: "inactive", label: "Nonaktif" },
            ].map((item) => {
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (role && role !== "semua") params.set("role", role);
              if (item.key) params.set("status", item.key);
              const href = params.toString()
                ? `/admin/pengguna?${params.toString()}`
                : "/admin/pengguna";
              const active = (status || "") === item.key;
              return (
                <Link
                  key={item.key || "all"}
                  href={href}
                  className={`border px-3 py-2 text-[8px] font-extrabold uppercase tracking-[0.1em] transition ${
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
        </div>
        <SearchBox
          action="/admin/pengguna"
          defaultValue={q}
          placeholder="Cari nama, email, atau jabatan..."
          hidden={{ role, status }}
        />
      </div>

      <div className="admin-card overflow-hidden">
        {filtered.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-[34%]">Pengguna</th>
                  <th>Peran</th>
                  <th>Status</th>
                  <th>Login terakhir</th>
                  <th>Dibuat</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const roleMeta = ROLE_META[user.role];
                  const manageable =
                    canManage && canManageUserRole(actor.role, user.role);
                  const isSelf = actor.id === user.id;
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-wine-900 font-display text-[11px] text-gold-200">
                            {user.avatar ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatar}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              initials(user.name)
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 font-display text-[15px] font-semibold leading-snug text-wine-950">
                              {user.name}
                              {isSelf && (
                                <span className="text-[7px] font-extrabold uppercase tracking-[0.1em] text-gold-700">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-[9px] text-stone-400">
                              <Mail className="h-2.5 w-2.5" />
                              {user.email}
                            </p>
                            {user.title && (
                              <p className="mt-0.5 truncate text-[8px] text-stone-400">
                                {user.title}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${roleMeta.tone}`}>
                          {roleMeta.label}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={user.active ? "active" : "inactive"} />
                      </td>
                      <td className="whitespace-nowrap text-[9px] text-stone-500">
                        {user.last_login ? timeAgo(user.last_login) : "Belum pernah"}
                      </td>
                      <td className="whitespace-nowrap text-[9px] text-stone-400">
                        {formatDateTimeID(user.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2.5">
                          {manageable && (
                            <Link
                              href={`/admin/pengguna/${user.id}`}
                              className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
                            >
                              <PenLine className="h-3 w-3" /> Sunting
                            </Link>
                          )}
                          {manageable && !isSelf && (
                            <form action={toggleUserActiveAction}>
                              <input type="hidden" name="id" value={user.id} />
                              <ConfirmSubmitButton
                                message={
                                  user.active
                                    ? `Nonaktifkan akun ${user.name}? Sesi aktif akan diakhiri.`
                                    : `Aktifkan kembali akun ${user.name}?`
                                }
                                className={
                                  user.active
                                    ? "text-amber-600 hover:text-amber-700"
                                    : "text-emerald-600 hover:text-emerald-700"
                                }
                              >
                                <Power className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">
                                  {user.active ? "Nonaktifkan" : "Aktifkan"}
                                </span>
                              </ConfirmSubmitButton>
                            </form>
                          )}
                          {!manageable && !canManage && (
                            <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-stone-300">
                              Lihat
                            </span>
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
              icon={<Users className="h-5 w-5" />}
              title="Tidak ada pengguna ditemukan"
              description="Coba ubah filter peran atau kata kunci pencarian."
              action={
                canManage ? (
                  <PrimaryLink href="/admin/pengguna/baru">
                    <Plus className="h-3.5 w-3.5" /> Tambah Pengguna
                  </PrimaryLink>
                ) : undefined
              }
            />
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[9px] font-semibold text-stone-400">
        <ArrowUpRight className="h-3 w-3" />
        {canManage
          ? "Anda hanya dapat mengelola akun dengan peran di bawah kewenangan Anda."
          : "Peran Anda memiliki akses baca. Pengelolaan akun memerlukan izin users.manage."}
      </p>
    </>
  );
}
