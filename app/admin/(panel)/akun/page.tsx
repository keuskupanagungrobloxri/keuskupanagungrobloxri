import { redirect } from "next/navigation";
import {
  CalendarDays,
  Check,
  KeyRound,
  LogOut,
  Mail,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction, updateAccountAction, updateOwnAvatarAction } from "@/lib/actions/auth";
import { PERMISSION_GROUPS, ROLE_META } from "@/lib/permissions";
import { formatDateTimeID, initials } from "@/lib/utils";
import { ActionForm } from "@/components/admin/ActionForm";
import { ImageField } from "@/components/admin/ImageField";
import { AdminPageHeader, InfoRow, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const role = ROLE_META[user.role];

  return (
    <>
      <AdminPageHeader
        eyebrow="Akun"
        title="Akun Saya"
        description="Kelola identitas, foto profil, dan kata sandi akun panel Anda. Perubahan profil tidak mengubah peran atau hak akses."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <div className="space-y-5">
          <Panel
            title="Identitas akun"
            description="Nama dan keterangan ini tampil pada log aktivitas dan sapaan panel."
          >
            <div className="mb-5 flex items-center gap-4 border-b border-stone-100 pb-4">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-wine-900 font-display text-lg text-gold-200">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(user.name)
                )}
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold text-wine-950">
                  {user.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-stone-500">
                  <Mail className="h-3 w-3 text-gold-600" />
                  {user.email}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.12em] text-gold-700">
                  {role.label}
                </p>
              </div>
            </div>

            <ActionForm
              action={updateAccountAction}
              submitLabel="Simpan Profil"
              footerNote="Jika kata sandi diubah, sesi lain akan diakhiri dan sesi ini diperbarui."
            >
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
                    defaultValue={user.name}
                    className="admin-input text-[14px] font-semibold"
                  />
                </div>
                <div>
                  <label htmlFor="title" className="admin-label">
                    Jabatan
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={user.title || ""}
                    placeholder="Contoh: Ketua Seksi Komunikasi Sosial"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="admin-label">
                    Telepon
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    defaultValue={user.phone || ""}
                    placeholder="0812-..."
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
                    defaultValue={user.bio || ""}
                    placeholder="Keterangan singkat tentang pelayanan Anda..."
                    className="admin-input min-h-[84px] resize-y leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 border-t border-stone-100 pt-4">
                  <p className="flex items-center gap-2 text-[10px] font-bold text-wine-950">
                    <KeyRound className="h-3.5 w-3.5 text-gold-600" /> Ubah kata sandi
                  </p>
                  <p className="mt-1 text-[9px] leading-4 text-stone-400">
                    Kosongkan ketiga kolom jika tidak ingin mengubah kata sandi.
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="current_password" className="admin-label">
                    Kata sandi saat ini
                  </label>
                  <input
                    id="current_password"
                    name="current_password"
                    type="password"
                    autoComplete="current-password"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="new_password" className="admin-label">
                    Kata sandi baru
                  </label>
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Minimal 8 karakter"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label htmlFor="confirm_password" className="admin-label">
                    Konfirmasi kata sandi baru
                  </label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    className="admin-input"
                  />
                </div>
              </div>
            </ActionForm>
          </Panel>

          <Panel
            title="Foto profil"
            description="Foto ini tampil pada header panel dan log aktivitas."
          >
            <ActionForm
              action={updateOwnAvatarAction}
              submitLabel="Simpan Foto"
              footerNote="Gunakan foto persegi agar tampil optimal pada avatar."
              compact
            >
              <ImageField
                name="avatar"
                label="Foto profil"
                defaultValue={user.avatar}
                hint="Rasio 1:1, maks. 8 MB."
              />
            </ActionForm>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Informasi akun">
            <dl className="space-y-0">
              <InfoRow label="Peran" value={role.label} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow
                label="Status"
                value={user.active ? "Aktif" : "Nonaktif"}
              />
              <InfoRow
                label="Dibuat"
                value={formatDateTimeID(user.created_at)}
              />
              <InfoRow
                label="Login terakhir"
                value={
                  user.last_login ? formatDateTimeID(user.last_login) : "Sesi ini"
                }
              />
            </dl>
            <div className="mt-4 flex items-start gap-2 border-t border-stone-100 pt-3 text-[9px] leading-4 text-stone-400">
              <CalendarDays className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" />
              Peran dan hak akses hanya dapat diubah oleh pengguna dengan izin
              administrasi pengguna.
            </div>
          </Panel>

          <Panel title="Hak akses saya">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <ShieldCheck className="h-4 w-4 text-gold-600" />
              <p className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-stone-500">
                {user.permissions.length} izin aktif
              </p>
            </div>
            <div className="mt-3 space-y-3">
              {PERMISSION_GROUPS.map((group) => {
                const granted = group.permissions.filter((permission) =>
                  user.permissions.includes(permission.key),
                );
                if (!granted.length) return null;
                return (
                  <div key={group.label}>
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
                  </div>
                );
              })}
              {!user.permissions.length && (
                <p className="py-3 text-center text-[10px] leading-5 text-stone-400">
                  Peran Anda tidak memiliki izin panel. Anda tetap dapat mengakses
                  situs publik.
                </p>
              )}
            </div>
          </Panel>

          <div className="admin-card p-5">
            <p className="flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-stone-400">
              <UserCog className="h-3 w-3 text-gold-600" /> Sesi panel
            </p>
            <p className="mt-2 text-[10px] leading-5 text-stone-500">
              Keluar dari panel pada perangkat ini. Sesi akan tetap aktif hingga
              kedaluwarsa pada perangkat lain yang sudah masuk.
            </p>
            <form action={logoutAction} className="mt-3">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 border border-wine-900 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-wine-900 transition hover:bg-wine-900 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Keluar dari panel
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
