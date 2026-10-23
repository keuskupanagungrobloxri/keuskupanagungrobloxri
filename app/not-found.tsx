import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Crest } from "@/components/site/Crest";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-wine-950 px-5 py-20 text-white">
      <div className="absolute inset-0 bg-cross-pattern" />
      <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-gold-400/10" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-gold-400/10" />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <Crest className="mx-auto h-16 w-auto" />
        <p className="mt-8 text-[9px] font-extrabold uppercase tracking-[0.28em] text-gold-300">
          Halaman tidak ditemukan
        </p>
        <h1 className="mt-4 font-display text-7xl font-medium leading-none text-white md:text-8xl">
          404
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[13px] leading-7 text-white/55">
          Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
          Mari kembali ke rumah digital keuskupan.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-gold">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <Link href="/kontak" className="btn-outline-light">
            <Compass className="h-4 w-4 text-gold-300" /> Hubungi Kami
          </Link>
        </div>
      </div>
    </main>
  );
}
