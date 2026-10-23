import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Crest } from "@/components/site/Crest";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk Panel Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(
      user.role === "owner" || user.permissions.includes("dashboard.view")
        ? "/admin"
        : "/admin/akses-terbatas",
    );
  }
  const { returnTo } = await searchParams;

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.02fr_.98fr]">
      <section className="grain relative hidden overflow-hidden bg-wine-950 text-white lg:flex lg:flex-col lg:justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/cathedral-exterior.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-wine-950 via-wine-950/90 to-wine-900/60" />
        <div className="absolute inset-0 bg-cross-pattern" />
        <Crest className="absolute -bottom-20 -right-10 h-[380px] w-auto opacity-[0.07]" />

        <div className="relative z-10 p-10 xl:p-14">
          <Link href="/" className="flex items-center gap-4">
            <Crest className="h-14 w-auto" />
            <span>
              <span className="block text-[8px] font-extrabold uppercase tracking-[0.28em] text-gold-400">
                Keuskupan Agung
              </span>
              <span className="block font-display text-3xl font-semibold leading-none">
                ROBLOX
              </span>
              <span className="mt-1 block font-display text-[10px] italic text-white/40">
                Archidioecesis Robloxiana
              </span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg p-10 xl:p-14">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-gold-300">
            Panel Administrasi
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,4vw,4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
            Melayani dengan tertib,{" "}
            <span className="italic text-gold-300">berbuah dalam kasih.</span>
          </h1>
          <p className="mt-6 max-w-md text-[12px] leading-7 text-white/55">
            Kelola berita, agenda, liturgi, data paroki, dan pelayanan digital
            keuskupan dalam satu ruang kerja yang aman.
          </p>
          <div className="mt-8 flex items-center gap-3 border border-white/15 bg-white/[0.04] px-4 py-3 backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4 shrink-0 text-gold-400" />
            <p className="text-[10px] leading-5 text-white/55">
              Setiap tindakan tercatat dalam log aktivitas dan dibatasi sesuai peran.
            </p>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 p-10 xl:p-14">
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/30">
            Ut Unum Sint · Agar mereka semua menjadi satu
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-cream px-5 py-12 sm:px-10">
        <div className="w-full max-w-[430px]">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <Crest className="h-11 w-auto" />
              <span className="font-display text-2xl font-semibold text-wine-950">
                ROBLOX
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-wine-800"
            >
              <ArrowLeft className="h-3 w-3" /> Situs
            </Link>
          </div>

          <p className="text-[8px] font-extrabold uppercase tracking-[0.24em] text-gold-700">
            Selamat datang kembali
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-wine-950">
            Masuk ke panel.
          </h2>
          <p className="mt-3 text-[12px] leading-6 text-stone-500">
            Gunakan akun yang telah terdaftar oleh pengurus keuskupan. Hubungi
            Holder jika Anda memerlukan akses baru.
          </p>

          <div className="mt-8 border border-wine-900/10 bg-paper p-6 shadow-soft sm:p-7">
            <LoginForm returnTo={returnTo} />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 text-[9px] font-semibold text-stone-400">
            <Link href="/" className="transition hover:text-wine-900">
              ← Kembali ke situs publik
            </Link>
            <span className="uppercase tracking-[0.1em]">Akses terbatas</span>
          </div>
        </div>
      </section>
    </main>
  );
}
