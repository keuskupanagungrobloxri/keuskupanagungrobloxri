import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass, Search } from "lucide-react";

export default function SiteNotFound() {
  return (
    <section className="section-pad">
      <div className="container-site">
        <div className="mx-auto max-w-2xl border border-wine-900/10 bg-paper px-6 py-16 text-center md:px-12 md:py-20">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-700">
            <Compass className="h-7 w-7" />
          </span>
          <p className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.24em] text-gold-700">
            Halaman tidak ditemukan
          </p>
          <h1 className="mt-4 font-display text-5xl font-medium text-wine-950 md:text-6xl">
            Tersesat sejenak.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[13px] leading-7 text-stone">
            Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan
            kembali ke beranda atau gunakan tautan berikut.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary">
              <ArrowLeft className="h-4 w-4" /> Beranda
            </Link>
            <Link href="/berita" className="btn-outline">
              <Search className="h-4 w-4" /> Cari Berita
            </Link>
          </div>
          <div className="mt-10 grid gap-2 border-t border-wine-900/10 pt-6 text-left sm:grid-cols-2">
            {[
              ["Direktori Paroki", "/paroki"],
              ["Jadwal Misa", "/liturgi"],
              ["Agenda Keuskupan", "/agenda"],
              ["Hubungi Sekretariat", "/kontak"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between border-b border-wine-900/8 py-3 text-[11px] font-semibold text-ink/65 transition hover:pl-1 hover:text-wine-900"
              >
                {label}
                <ArrowRight className="h-3 w-3 text-gold-600 opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
