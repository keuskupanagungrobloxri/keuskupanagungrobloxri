import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  Info,
  Megaphone,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import {
  getActiveAnnouncements,
  getSettings,
  setting,
} from "@/lib/content";
import { formatDateID, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengumuman",
  description:
    "Pengumuman resmi dan informasi pelayanan terbaru dari Keuskupan Agung ROBLOX.",
};

const TONE: Record<
  string,
  { label: string; icon: typeof Info; badge: string; bar: string }
> = {
  important: {
    label: "Penting",
    icon: BellRing,
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    bar: "bg-rose-500",
  },
  liturgy: {
    label: "Liturgi",
    icon: Sparkles,
    badge: "border-gold-300 bg-gold-50 text-gold-800",
    bar: "bg-gold-500",
  },
  info: {
    label: "Informasi",
    icon: Info,
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    bar: "bg-blue-500",
  },
};

export default function PengumumanPage() {
  const announcements = getActiveAnnouncements();
  const settings = getSettings();

  return (
    <>
      <PageHero
        eyebrow="Informasi Resmi"
        title="Pengumuman"
        description="Informasi terbaru seputar liturgi, pelayanan sakramen, kegiatan, dan kehidupan keuskupan."
        image="/images/candles.jpg"
        breadcrumbs={[{ label: "Pengumuman" }]}
      />

      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-wine-900/10 pb-6">
              <div>
                <span className="eyebrow">Papan Pengumuman</span>
                <h2 className="mt-4 font-display text-4xl font-medium text-wine-950">
                  Kabar untuk umat.
                </h2>
              </div>
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-stone">
                <Megaphone className="h-4 w-4 text-gold-600" />
                {announcements.length} pengumuman aktif
              </span>
            </div>

            {announcements.length ? (
              <div className="mt-8 space-y-5">
                {announcements.map((item) => {
                  const tone = TONE[item.tone] || TONE.info;
                  const Icon = tone.icon;
                  return (
                    <article
                      key={item.id}
                      className="relative overflow-hidden border border-wine-900/10 bg-paper p-6 pl-7 transition hover:border-gold-400 md:p-8 md:pl-9"
                    >
                      <span className={`absolute inset-y-0 left-0 w-1 ${tone.bar}`} />
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`badge ${tone.badge}`}>
                          <Icon className="h-3 w-3" />
                          {tone.label}
                        </span>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-stone/60">
                          {timeAgo(item.created_at)}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-[1.8rem] font-semibold leading-tight text-wine-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-[12px] leading-6 text-stone">
                        {item.message}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-wine-900/10 pt-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-stone/60">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3 w-3 text-gold-600" />
                          Dipublikasikan{" "}
                          {formatDateID(item.created_at, {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        {item.ends_at && (
                          <span className="flex items-center gap-1.5">
                            Berlaku hingga{" "}
                            {formatDateID(item.ends_at, {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 border border-dashed border-wine-900/20 bg-paper px-6 py-20 text-center">
                <Megaphone className="mx-auto h-9 w-9 text-gold-600" />
                <h3 className="mt-4 font-display text-2xl text-wine-950">
                  Belum ada pengumuman aktif
                </h3>
                <p className="mt-2 text-[12px] text-stone">
                  Silakan periksa kembali dalam beberapa waktu ke depan.
                </p>
              </div>
            )}
          </div>

          <aside className="h-fit space-y-6 lg:sticky lg:top-40">
            <div className="border border-wine-900/10 bg-paper p-6">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                Tautan Cepat
              </p>
              <nav className="mt-4 space-y-1">
                {[
                  ["Jadwal Misa", "/liturgi"],
                  ["Agenda Keuskupan", "/agenda"],
                  ["Direktori Paroki", "/paroki"],
                  ["Berita Terbaru", "/berita"],
                  ["Hubungi Sekretariat", "/kontak"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center justify-between border-b border-wine-900/8 py-3 text-[11px] font-semibold text-ink/65 transition hover:pl-1 hover:text-wine-900 last:border-0"
                  >
                    {label}
                    <ArrowRight className="h-3 w-3 text-gold-600 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="bg-wine-950 p-6 text-white">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-400">
                Sekretariat Keuskupan
              </p>
              <p className="mt-3 text-[11px] leading-6 text-white/60">
                {setting(settings, "office_hours")}
                <br />
                {setting(settings, "phone")}
                <br />
                {setting(settings, "email")}
              </p>
              <p className="mt-4 border-t border-white/10 pt-3 text-[10px] italic leading-5 text-white/40">
                {setting(settings, "address")}, {setting(settings, "city")}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
