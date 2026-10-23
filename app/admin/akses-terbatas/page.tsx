import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Globe2,
  LockKeyhole,
  LogOut,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { PERMISSION_GROUPS, ROLE_META } from "@/lib/permissions";
import { initials } from "@/lib/utils";
import { Crest } from "@/components/site/Crest";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Akses Terbatas",
  robots: { index: false, follow: false },
};

export default async function RestrictedAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ izin?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const { izin } = await searchParams;
  const hasDashboard = hasPermission(user, "dashboard.view");
  if (hasDashboard && !izin) redirect("/admin");

  const role = ROLE_META[user.role];
  const requested = izin
    ? PERMISSION_GROUPS.flatMap((group) => group.permissions).find(
        (permission) => permission.key === izin,
      )
    : undefined;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-wine-950 px-5 py-14 text-white">
      <div className="absolute inset-0 bg-cross-pattern opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(194,154,74,.16),transparent_55%)]" />
      <Crest className="pointer-events-none absolute -bottom-24 -right-16 h-[420px] w-auto opacity-[0.06]" />

      <div className="relative w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Crest className="h-11 w-auto" />
            <span>
              <span className="block text-[7px] font-extrabold uppercase tracking-[0.24em] text-gold-400">
                Keuskupan Agung
              </span>
              <span className="block font-display text-2xl font-semibold leading-none">
                ROBLOX
              </span>
            </span>
          </Link>
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white/50 transition hover:text-gold-300 sm:flex"
          >
            <Globe2 className="h-3 w-3" /> Situs publik
          </Link>
        </div>

        <div className="border border-white/12 bg-white/[0.045] p-7 backdrop-blur-sm sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <p className="mt-5 text-[8px] font-extrabold uppercase tracking-[0.24em] text-gold-400">
            Akses terbatas
          </p>
          <h1 className="mt-3 font-display text-[2.2rem] font-medium leading-tight sm:text-[2.7rem]">
            {hasDashboard ? (
              <>
                Modul ini tidak tersedia
                <span className="block italic text-gold-300">untuk peran Anda.</span>
              </>
            ) : (
              <>
                Panel administrasi belum
                <span className="block italic text-gold-300">tersedia untuk peran Anda.</span>
              </>
            )}
          </h1>
          <p className="mt-4 max-w-lg text-[12px] leading-7 text-white/55">
            {hasDashboard ? (
              <>
                Peran{" "}
                <span className="font-semibold text-white">{role.label}</span>{" "}
                tidak memiliki izin untuk membuka modul yang Anda tuju. Anda
                tetap dapat mengelola bagian panel lain yang menjadi tanggung
                jawab Anda.
              </>
            ) : (
              <>Akun Anda berhasil masuk, tetapi peran{" "}
                <span className="font-semibold text-white">{role.label}</span> tidak
                memiliki izin dasar untuk membuka dasbor panel. Anda tetap dapat
                mengakses seluruh konten situs publik keuskupan.</>
            )}
          </p>

          {requested && (
            <div className="mt-5 flex items-start gap-2.5 border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-[10px] leading-5 text-amber-100">
              <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                Izin yang dibutuhkan:{" "}
                <span className="font-semibold">{requested.label}</span>{" "}
                <span className="font-mono text-[9px] text-amber-200/70">
                  ({requested.key})
                </span>
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gold-400/30 bg-white/5 font-display text-sm text-gold-300">
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
              <div>
                <p className="text-[11px] font-bold text-white">{user.name}</p>
                <p className="mt-0.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-gold-400">
                  {role.label}
                </p>
              </div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.13em] text-white/65 transition hover:border-gold-400/50 hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Keluar
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-[9px] font-semibold text-white/35 sm:flex-row">
          <Link
            href={hasDashboard ? "/admin" : "/"}
            className="inline-flex items-center gap-1.5 transition hover:text-gold-300"
          >
            <ArrowLeft className="h-3 w-3" />{" "}
            {hasDashboard ? "Kembali ke dasbor" : "Kembali ke situs publik"}
          </Link>
          <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.1em]">
            <ShieldCheck className="h-3 w-3" /> Ut Unum Sint
          </span>
        </div>
      </div>
    </main>
  );
}
