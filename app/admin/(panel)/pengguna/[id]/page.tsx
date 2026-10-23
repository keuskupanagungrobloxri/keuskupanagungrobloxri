import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Info,
  KeyRound,
  Mail,
  Phone,
  Power,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import {
  hasPermission,
  permissionsForRole,
  requireAdmin,
} from "@/lib/auth";
import { getUserById } from "@/lib/admin-data";
import {
  resetUserPasswordAction,
  saveUserAction,
  toggleUserActiveAction,
} from "@/lib/actions/users";
import {
  canManageUserRole,
  PERMISSION_GROUPS,
  ROLE_META,
  ROLES,
} from "@/lib/permissions";
import { formatDateTimeID, initials } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import {
  AdminPageHeader,
  InfoRow,
  Panel,
  StatusBadge,
} from "@/components/admin/ui";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export const dynamic = "force-dynamic";

export default async function UserFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "baru";
  const actor = await requireAdmin("users.view");
  const canManage = hasPermission(actor, "users.manage");
  const existing = isNew ? undefined : getUserById(id);
  if (!isNew && !existing) notFound();

  const isSelf = existing?.id === actor.id;
  const manageable =
    canManage &&
    (!existing || canManageUserRole(actor.role, existing.role));

  if (!manageable) {
    return (
      <>
        <AdminPageHeader
          eyebrow="Administrasi Situs"
          title="Akun pengguna"
          description="Detail akun dan hak aksesnya."
          action={
            <Link href="/admin/pengguna" className="btn-outline">
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </Link>
          }
        />
        {existing ? (
          <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
            <Panel title="Identitas pengguna">
              <dl className="space-y-0">
                <InfoRow label="Nama" value={existing.name} />
                <InfoRow label="Email" value={existing.email} />
                <InfoRow label="Jabatan" value={existing.title || "—"} />
                <InfoRow label="Telepon" value={existing.phone || "—"} />
                <InfoRow
                  label="Peran"
                  value={
                    <span className={`badge ${ROLE_META[existing.role].tone}`}>
                      {ROLE_META[existing.role].label}
                    </span>
                  }
                />
                <InfoRow
                  label="Status"
                  value={<StatusBadge status={existing.active ? "active" : "inactive"} />}
                />
              </dl>
            </Panel>
            <div className="admin-card p-5">
              <Info className="h-5 w-5 text-amber-600" />
              <p className="mt-3 font-display text-lg font-semibold text-wine-950">
                Akses terbatas
              </p>
              <p className="mt-1.5 text-[10px] leading-5 text-stone-500">
                Peran Anda tidak berwenang mengelola akun dengan peran ini.
                Hubungi Holder Keuskupan untuk perubahan lebih lanjut.
              </p>
            </div>
          </div>
        ) : (
          <div className="admin-card p-7 text-center">
            <UserCog className="mx-auto h-6 w-6 text-stone-300" />
            <p className="mt-3 text-[11px] text-stone-500">
              Peran Anda tidak memiliki izin membuat atau menyunting akun.
            </p>
          </div>
        )}
      </>
    );
  }

  const assignableRoles = ROLES.filter(
    (role) => canManageUserRole(actor.role, role) || existing?.role === role,
  );
  const roleOptions = assignableRoles.length
    ? assignableRoles
    : [existing?.role || "umat"];
  const effectivePermissions =
    existing && !isNew ? permissionsForRole(existing.role) : [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Administrasi Situs"
        title={isNew ? "Tambah pengguna" : "Sunting pengguna"}
        description={
          isNew
            ? "Buat akun baru dan tentukan perannya. Hak akses mengikuti matriks peran yang berlaku."
            : "Perbarui identitas, peran, dan status akun pengguna panel."
        }
        action={
          <Link href="/admin/pengguna" className="btn-outline">
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali
          </Link>
        }
      />

      <ActionForm
        action={saveUserAction}
        submitLabel={isNew ? "Buat Akun" : "Simpan Perubahan"}
        cancelHref="/admin/pengguna"
        footerNote={
          isNew
            ? "Kata sandi awal wajib diberikan. Pengguna dapat mengubahnya melalui menu Akun Saya."
            : "Mengubah kata sandi akan mengakhiri seluruh sesi aktif pengguna tersebut."
        }
      >
        <input type="hidden" name="id" value={existing?.id || ""} />
        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <Panel title="Identitas pengguna">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="admin-label">
                    Nama lengkap *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={existing?.name || ""}
                    placeholder="Nama lengkap pengguna"
                    className="admin-input text-[14px] font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="admin-label">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    defaultValue={existing?.email || ""}
                    placeholder="nama@keuskupanroblox.org"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="admin-label">
                    Telepon
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      defaultValue={existing?.phone || ""}
                      placeholder="0812-..."
                      className="admin-input pl-9"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="title" className="admin-label">
                    Jabatan
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={existing?.title || ""}
                    placeholder="Contoh: Ketua Seksi Komunikasi Sosial"
                    className="admin-input"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="admin-label">
                    Biografi singkat
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    defaultValue={existing?.bio || ""}
                    placeholder="Keterangan singkat tentang pelayanan pengguna..."
                    className="admin-input min-h-[84px] resize-y leading-relaxed"
                  />
                </div>
              </div>
            </Panel>

            <Panel title="Peran & keamanan">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="role" className="admin-label">
                    Peran *
                  </label>
                  {isSelf ? (
                    <>
                      <input
                        type="hidden"
                        name="role"
                        value={existing?.role || "umat"}
                      />
                      <input
                        type="text"
                        disabled
                        value={ROLE_META[existing?.role || "umat"].label}
                        className="admin-input disabled:bg-stone-50 disabled:text-stone-400"
                      />
                      <p className="mt-1.5 text-[9px] leading-4 text-stone-400">
                        Anda tidak dapat mengubah peran akun sendiri.
                      </p>
                    </>
                  ) : (
                    <select
                      id="role"
                      name="role"
                      defaultValue={existing?.role || "umat"}
                      className="admin-input"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_META[role].label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="admin-label">
                    {isNew ? "Kata sandi awal *" : "Kata sandi baru"}
                  </label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required={isNew}
                      minLength={isNew ? 8 : undefined}
                      autoComplete="new-password"
                      placeholder={isNew ? "Minimal 8 karakter" : "Kosongkan jika tetap"}
                      className="admin-input pl-9"
                    />
                  </div>
                  <p className="mt-1.5 text-[9px] leading-4 text-stone-400">
                    {isNew
                      ? "Minimal 8 karakter. Sampaikan kepada pengguna secara aman."
                      : "Isi hanya jika ingin mengatur ulang kata sandi."}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 border border-stone-200 bg-stone-50 p-3.5">
                    <input
                      type="checkbox"
                      name="active"
                      defaultChecked={
                        isNew ? true : Boolean(existing?.active)
                      }
                      disabled={isSelf}
                      className="mt-0.5 h-4 w-4 accent-[#531824] disabled:opacity-50"
                    />
                    <span>
                      <span className="block text-[10px] font-bold text-wine-950">
                        Akun aktif
                      </span>
                      <span className="mt-0.5 block text-[9px] leading-4 text-stone-400">
                        {isSelf
                          ? "Anda tidak dapat menonaktifkan akun sendiri."
                          : "Akun nonaktif tidak dapat masuk ke panel administrasi."}
                      </span>
                    </span>
                  </label>
                  {isSelf && <input type="hidden" name="active" value="on" />}
                </div>
              </div>
            </Panel>

            {isNew && (
              <div className="flex items-start gap-3 border-l-2 border-gold-500 bg-gold-50 px-4 py-3 text-[10px] leading-5 text-gold-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  Hak akses akun ditentukan oleh peran yang dipilih. Setelah akun
                  dibuat, sesuaikan izin peran melalui menu{" "}
                  <Link href="/admin/peran" className="font-bold underline">
                    Matriks Peran
                  </Link>{" "}
                  bila diperlukan.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <Panel title="Ringkasan peran">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-900 font-display text-sm text-gold-200">
                  {existing ? initials(existing.name) : <UserCog className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-[11px] font-bold text-wine-950">
                    {existing?.name || "Akun baru"}
                  </p>
                  <p className="mt-0.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-gold-700">
                    {existing ? ROLE_META[existing.role].label : "Belum ditentukan"}
                  </p>
                </div>
              </div>
              <p className="mt-4 border-t border-stone-100 pt-3 text-[10px] leading-5 text-stone-500">
                {existing
                  ? ROLE_META[existing.role].description
                  : "Peran menentukan modul panel yang dapat diakses pengguna."}
              </p>
              {existing && (
                <dl className="mt-4 space-y-2.5 border-t border-stone-100 pt-3 text-[9px]">
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-stone-400">
                      <CalendarDays className="h-3 w-3" /> Dibuat
                    </dt>
                    <dd className="text-right font-semibold text-stone-700">
                      {formatDateTimeID(existing.created_at)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-stone-400">
                      <ShieldCheck className="h-3 w-3" /> Izin
                    </dt>
                    <dd className="font-semibold text-stone-700">
                      {effectivePermissions.length} izin
                    </dd>
                  </div>
                </dl>
              )}
            </Panel>

            {existing && !isNew && (
              <>
                <Panel title="Status akun">
                  <div className="flex items-center justify-between">
                    <StatusBadge
                      status={existing.active ? "active" : "inactive"}
                    />
                    {!isSelf && (
                      <form action={toggleUserActiveAction}>
                        <input type="hidden" name="id" value={existing.id} />
                        <ConfirmSubmitButton
                          message={
                            existing.active
                              ? `Nonaktifkan akun ${existing.name}? Sesi aktif akan diakhiri.`
                              : `Aktifkan kembali akun ${existing.name}?`
                          }
                          className={
                            existing.active
                              ? "text-amber-700 hover:text-amber-800"
                              : "text-emerald-700 hover:text-emerald-800"
                          }
                        >
                          <Power className="h-3.5 w-3.5" />
                          {existing.active ? "Nonaktifkan" : "Aktifkan"}
                        </ConfirmSubmitButton>
                      </form>
                    )}
                  </div>
                  {isSelf && (
                    <p className="mt-3 text-[9px] leading-4 text-stone-400">
                      Ini adalah akun Anda sendiri.
                    </p>
                  )}
                </Panel>

                <Panel title="Atur ulang kata sandi">
                  <form action={resetUserPasswordAction} className="space-y-3">
                    <input type="hidden" name="id" value={existing.id} />
                    <input
                      type="password"
                      name="new_password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Kata sandi baru minimal 8 karakter"
                      className="admin-input"
                    />
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 border border-wine-900 bg-white px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-wine-900 transition hover:bg-wine-900 hover:text-white"
                    >
                      <KeyRound className="h-3.5 w-3.5" /> Atur ulang sandi
                    </button>
                    <p className="text-[9px] leading-4 text-stone-400">
                      Seluruh sesi pengguna akan diakhiri setelah sandi diubah.
                    </p>
                  </form>
                </Panel>
              </>
            )}

            {existing && effectivePermissions.length > 0 && (
              <Panel title="Izin efektif">
                <ul className="space-y-2">
                  {PERMISSION_GROUPS.map((group) => {
                    const granted = group.permissions.filter((permission) =>
                      effectivePermissions.includes(permission.key),
                    );
                    if (!granted.length) return null;
                    return (
                      <li key={group.label}>
                        <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-stone-400">
                          {group.label}
                        </p>
                        <ul className="mt-1 space-y-1">
                          {granted.map((permission) => (
                            <li
                              key={permission.key}
                              className="flex items-start gap-1.5 text-[9px] leading-4 text-stone-600"
                            >
                              <Check className="mt-0.5 h-2.5 w-2.5 shrink-0 text-emerald-600" />
                              {permission.label}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            )}

            {existing && (
              <div className="admin-card bg-cream p-5">
                <Mail className="h-4 w-4 text-gold-600" />
                <p className="mt-3 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
                  Kontak akun
                </p>
                <a
                  href={`mailto:${existing.email}`}
                  className="mt-1 block break-all text-[10px] font-semibold text-wine-900 underline decoration-gold-400 underline-offset-2"
                >
                  {existing.email}
                </a>
                {existing.phone && (
                  <p className="mt-1 text-[10px] text-stone-500">{existing.phone}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </ActionForm>
    </>
  );
}
