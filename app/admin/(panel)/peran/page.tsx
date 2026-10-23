import {
  Check,
  Info,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getRoleMatrix } from "@/lib/admin-data";
import { saveRoleMatrixAction } from "@/lib/actions/users";
import { PERMISSION_GROUPS, ROLE_META, ROLES } from "@/lib/permissions";
import { ActionForm } from "@/components/admin/ActionForm";
import { AdminPageHeader, Panel } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function RoleMatrixPage() {
  await requireAdmin("roles.manage");
  const matrix = getRoleMatrix();
  const editableRoles = ROLES.filter((role) => role !== "owner");
  const allRoles = ROLES;

  return (
    <>
      <AdminPageHeader
        eyebrow="Administrasi Situs"
        title="Matriks Peran"
        description="Tentukan izin setiap peran pengguna. Perubahan berlaku segera pada navigasi dan tindakan panel, serta tercatat di log aktivitas."
      />

      <div className="mb-5 flex items-start gap-3 border-l-2 border-gold-500 bg-gold-50 px-4 py-3 text-[10px] leading-5 text-gold-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-bold">Holder Keuskupan selalu memiliki seluruh izin.</p>
          <p className="mt-0.5 text-gold-800/80">
            Kolom Holder tidak dapat diubah. Peran Pengurus Keuskupan wajib
            mempertahankan izin <span className="font-mono">dashboard.view</span>{" "}
            agar tetap dapat mengakses panel.
          </p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {allRoles.slice(0, 4).map((role) => (
          <div key={role} className="admin-card flex items-start gap-3 p-4">
            <span
              className="mt-0.5 h-8 w-1 shrink-0 rounded-sm"
              style={{ backgroundColor: ROLE_META[role].color }}
            />
            <div>
              <p className="text-[10px] font-bold text-wine-950">
                {ROLE_META[role].label}
              </p>
              <p className="mt-0.5 text-[8px] font-extrabold uppercase tracking-[0.1em] text-stone-400">
                {role === "owner"
                  ? `${matrix[role].length} izin · penuh`
                  : `${matrix[role].length} izin diberikan`}
              </p>
            </div>
          </div>
        ))}
      </div>

      <ActionForm
        action={saveRoleMatrixAction}
        submitLabel="Simpan Matriks Peran"
        footerNote="Izin yang tidak dicentang akan dicabut untuk peran tersebut. Pastikan setiap peran tetap memiliki akses dasbor yang diperlukan."
      >
        <Panel
          title="Hak akses per peran"
          description="Centang izin yang diberikan. Angka pada kepala kolom menunjukkan jumlah izin aktif."
          bodyClassName="p-0"
        >
          <div className="table-wrap">
            <table className="w-full min-w-[1060px] border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-cream/60">
                  <th className="sticky left-0 z-10 min-w-[260px] bg-cream/95 px-5 py-4 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-500">
                    Izin
                  </th>
                  {allRoles.map((role) => (
                    <th
                      key={role}
                      className="min-w-[92px] border-l border-stone-200/70 px-2.5 py-4 text-center align-top"
                    >
                      <span className="mx-auto mb-1.5 block h-1 w-6 rounded-full" style={{ backgroundColor: ROLE_META[role].color }} />
                      <span className="block text-[9px] font-extrabold leading-tight text-wine-950">
                        {ROLE_META[role].short}
                      </span>
                      <span className="mt-0.5 block text-[7px] font-semibold uppercase tracking-[0.08em] text-stone-400">
                        {matrix[role]?.length || 0} izin
                      </span>
                      {role === "owner" && (
                        <LockKeyhole className="mx-auto mt-1 h-2.5 w-2.5 text-stone-300" />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_GROUPS.map((group) => (
                  <FragmentGroup
                    key={group.label}
                    label={group.label}
                    permissions={group.permissions}
                    roles={allRoles}
                    matrix={matrix}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="admin-card p-5">
            <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-gold-700">
              Ringkasan peran
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {allRoles.map((role) => (
                <div key={role} className="border border-stone-100 bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold text-wine-950">
                      {ROLE_META[role].label}
                    </p>
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-stone-400">
                      {matrix[role]?.length || 0}
                    </span>
                  </div>
                  <p className="mt-1 text-[9px] leading-4 text-stone-500">
                    {ROLE_META[role].description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card bg-cream p-5">
            <ShieldCheck className="h-4 w-4 text-gold-600" />
            <p className="mt-3 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone-400">
              Catatan penting
            </p>
            <ul className="mt-2 space-y-2 text-[10px] leading-5 text-stone-500">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                Izin diperiksa di server pada setiap tindakan.
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                Menu panel hanya menampilkan modul yang diizinkan.
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
                Pengguna dengan peran tanpa akses dasbor diarahkan ke halaman
                akses terbatas.
              </li>
            </ul>
            <p className="mt-4 flex items-center gap-1.5 border-t border-stone-200/70 pt-3 text-[8px] font-semibold uppercase tracking-[0.08em] text-stone-400">
              <Sparkles className="h-2.5 w-2.5" /> Ut Unum Sint
            </p>
          </div>
        </div>
      </ActionForm>
    </>
  );
}

function FragmentGroup({
  label,
  permissions,
  roles,
  matrix,
}: {
  label: string;
  permissions: { key: string; label: string; description: string }[];
  roles: string[];
  matrix: Record<string, string[]>;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={roles.length + 1}
          className="sticky left-0 z-10 border-y border-stone-200 bg-stone-50 px-5 py-2.5 text-[8px] font-extrabold uppercase tracking-[0.18em] text-wine-800"
        >
          {label}
        </td>
      </tr>
      {permissions.map((permission) => (
        <tr key={permission.key} className="border-b border-stone-100 last:border-0">
          <td className="sticky left-0 z-10 bg-white px-5 py-3">
            <p className="text-[10px] font-semibold text-stone-800">
              {permission.label}
            </p>
            <p className="mt-0.5 text-[9px] leading-4 text-stone-400">
              {permission.description}
            </p>
            <p className="mt-1 font-mono text-[8px] text-stone-300">
              {permission.key}
            </p>
          </td>
          {roles.map((role) => {
            const checked =
              role === "owner" || (matrix[role] || []).includes(permission.key);
            return (
              <td
                key={role}
                className="border-l border-stone-100 px-2.5 py-3 text-center"
              >
                <input
                  type="checkbox"
                  name={`perm_${role}_${permission.key}`}
                  defaultChecked={checked}
                  disabled={role === "owner"}
                  aria-label={`${permission.label} untuk ${ROLE_META[role as keyof typeof ROLE_META].label}`}
                  className="h-4 w-4 cursor-pointer accent-[#531824] disabled:cursor-not-allowed disabled:opacity-55"
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
