import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  HeartHandshake,
  Info,
  MapPin,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { LiturgyExplorer } from "@/components/site/LiturgyExplorer";
import {
  getKatedralMasses,
  getMassesWithParish,
  getSettings,
  setting,
} from "@/lib/content";
import { formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Liturgi & Jadwal Misa",
  description:
    "Jadwal misa harian, mingguan, dan devosi di paroki-paroki Keuskupan Agung ROBLOX.",
};

const services = [
  {
    icon: HeartHandshake,
    title: "Sakramen Tobat",
    text: "Pelayanan pengakuan dosa tersedia sebelum misa atau dengan perjanjian di sekretariat paroki.",
  },
  {
    icon: BookOpen,
    title: "Baptis & Pernikahan",
    text: "Pendaftaran dan pendampingan sakramen dilakukan melalui sekretariat paroki setempat.",
  },
  {
    icon: Clock3,
    title: "Adorasi & Doa",
    text: "Adorasi Ekaristi, doa rosario, dan ibadat lingkungan sesuai jadwal masing-masing paroki.",
  },
];

export default function LiturgiPage() {
  const masses = getMassesWithParish();
  const cathedral = getKatedralMasses();
  const settings = getSettings();
  const sunday = cathedral.filter((mass) => mass.day === "Minggu");

  return (
    <>
      <PageHero
        eyebrow="Hidup Liturgi"
        title="Jadwal Misa & Pelayanan"
        description="Ekaristi adalah sumber dan puncak hidup Gereja. Temukan jadwal perayaan dan pelayanan sakramen di paroki Anda."
        image="/images/liturgy-candles.jpg"
        breadcrumbs={[{ label: "Liturgi" }]}
      />

      <section className="relative z-20 -mt-14 pb-10 md:-mt-16">
        <div className="container-site">
          <div className="grid overflow-hidden border border-wine-900/10 bg-paper shadow-soft md:grid-cols-[1.2fr_.8fr]">
            <div className="border-b border-wine-900/10 p-7 md:border-b-0 md:border-r md:p-8">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                Misa Minggu · Katedral
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-7">
                {sunday.map((mass, index) => (
                  <div key={mass.id} className="flex items-end gap-7">
                    {index > 0 && <span className="mb-2 h-9 w-px bg-wine-900/10" />}
                    <div>
                      <p className="font-display text-4xl font-semibold leading-none text-wine-950">
                        {formatTime(mass.time)}
                      </p>
                      <p className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-stone/60">
                        {mass.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[11px] leading-5 text-stone">
                Katedral Santa Maria Diangkat ke Surga · {setting(settings, "city")}
              </p>
            </div>
            <div className="bg-wine-950 p-7 text-white md:p-8">
              <div className="flex items-center gap-2 text-gold-300">
                <Info className="h-4 w-4" />
                <p className="text-[8px] font-extrabold uppercase tracking-[0.18em]">
                  Catatan Penting
                </p>
              </div>
              <p className="mt-4 text-[11px] leading-6 text-white/65">
                {setting(settings, "mass_notes")}
              </p>
              <Link
                href="/pengumuman"
                className="mt-5 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-gold-300 transition hover:text-white"
              >
                Lihat Pengumuman <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-8">
        <div className="container-site">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow">Jadwal Lengkap</span>
            <h2 className="section-title mt-5">
              Setiap perayaan,{" "}
              <span className="italic text-gold-700">satu perjumpaan.</span>
            </h2>
            <p className="mt-5 text-[13px] leading-7 text-stone">
              Pilih hari atau paroki untuk melihat jadwal misa dan pelayanan. Jadwal
              dapat berubah pada hari raya dan masa liturgi khusus.
            </p>
          </div>

          <LiturgyExplorer masses={masses} />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-wine-900/10 bg-cream py-20">
        <div className="absolute right-0 top-0 font-display text-[16rem] leading-none text-wine-900/[0.025]">
          ✛
        </div>
        <div className="container-site relative">
          <div className="max-w-2xl">
            <span className="eyebrow">Pelayanan Sakramen</span>
            <h2 className="section-title mt-5">Datang dan terlibatlah.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="border border-wine-900/10 bg-paper p-6 transition hover:border-gold-400"
              >
                <Icon className="h-5 w-5 text-gold-600" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-wine-950">
                  {title}
                </h3>
                <p className="mt-2 text-[12px] leading-6 text-stone">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4 border border-wine-900/10 bg-paper p-6">
            <MapPin className="h-5 w-5 shrink-0 text-gold-600" />
            <p className="flex-1 text-[12px] leading-6 text-stone">
              <span className="font-semibold text-wine-950">
                {setting(settings, "site_name")}
              </span>{" "}
              · {setting(settings, "address")}, {setting(settings, "city")}
            </p>
            <Link href="/paroki" className="btn-outline">
              Cari Paroki Terdekat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
