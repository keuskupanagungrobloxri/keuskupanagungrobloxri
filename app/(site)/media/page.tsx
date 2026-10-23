import Link from "next/link";
import { Camera, Images, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { getGallery, getGalleryAlbums } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media & Galeri",
  description:
    "Dokumentasi perayaan, pelayanan, dan kebersamaan umat Keuskupan Agung ROBLOX dalam bingkai foto.",
};

export default function MediaPage() {
  const items = getGallery();
  const albums = getGalleryAlbums();

  return (
    <>
      <PageHero
        eyebrow="Galeri Keuskupan"
        title="Jejak Iman yang Hidup"
        description="Momen perayaan, pelayanan, dan kebersamaan umat dalam bingkai dokumentasi keuskupan."
        image="/images/hero-stained.jpg"
        breadcrumbs={[{ label: "Media" }]}
      />

      <section className="relative z-20 -mt-14 pb-10 md:-mt-16">
        <div className="container-site">
          <div className="grid overflow-hidden border border-wine-900/10 bg-paper shadow-soft sm:grid-cols-3">
            <div className="flex items-center gap-4 border-b border-wine-900/10 p-6 sm:border-b-0 sm:border-r">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                <Camera className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-3xl font-semibold leading-none text-wine-950">
                  {items.length}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-stone/60">
                  Foto terdokumentasi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 border-b border-wine-900/10 p-6 sm:border-b-0 sm:border-r">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                <Images className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-3xl font-semibold leading-none text-wine-950">
                  {albums.length}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-stone/60">
                  Album kegiatan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display text-3xl font-semibold leading-none text-wine-950">
                  {new Date().getFullYear()}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-stone/60">
                  Tahun dokumentasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-8">
        <div className="container-site">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="eyebrow">Dokumentasi</span>
              <h2 className="section-title mt-5">
                Setiap gambar{" "}
                <span className="italic text-gold-700">menyimpan kisah.</span>
              </h2>
              <p className="mt-5 text-[13px] leading-7 text-stone">
                Telusuri album kegiatan keuskupan. Klik salah satu foto untuk melihat
                versi lengkap beserta keterangannya.
              </p>
            </div>
            <Link href="/kontak" className="btn-outline shrink-0">
              Kirim Dokumentasi
            </Link>
          </div>

          <GalleryGrid items={items} albums={albums} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-wine-950 py-16 text-white">
        <div className="absolute inset-0 bg-cross-pattern" />
        <div className="container-site relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="eyebrow eyebrow-light">Arsip Media</span>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-tight md:text-4xl">
              Memiliki dokumentasi kegiatan paroki?
            </h2>
            <p className="mt-3 max-w-xl text-[12px] leading-6 text-white/55">
              Kirimkan foto dan keterangannya kepada redaksi keuskupan untuk
              dipublikasikan di galeri resmi.
            </p>
          </div>
          <Link href="/kontak" className="btn-gold shrink-0">
            Hubungi Redaksi
          </Link>
        </div>
      </section>
    </>
  );
}
