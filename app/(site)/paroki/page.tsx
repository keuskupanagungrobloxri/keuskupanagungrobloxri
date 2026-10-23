import { Church, HeartHandshake, MapPinned, Users } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ParishExplorer } from "@/components/site/ParishExplorer";
import { getParishes, getSettings } from "@/lib/content";
import { setting } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paroki",
  description:
    "Direktori paroki Keuskupan Agung ROBLOX beserta alamat, pastor, dan informasi pelayanan.",
};

export default function ParokiPage() {
  const parishes = getParishes();
  const settings = getSettings();
  const vicariates = Array.from(
    new Set(parishes.map((parish) => parish.vicariate)),
  );
  const cities = Array.from(new Set(parishes.map((parish) => parish.city)));

  const highlights = [
    {
      icon: Church,
      value: parishes.length,
      label: "Paroki aktif",
      text: "Rumah iman yang tersebar di wilayah keuskupan.",
    },
    {
      icon: MapPinned,
      value: vicariates.length,
      label: "Kevikepan",
      text: "Wilayah pastoral yang saling mendukung.",
    },
    {
      icon: Users,
      value: cities.length,
      label: "Kota & distrik",
      text: "Komunitas umat yang beragam dan hidup.",
    },
    {
      icon: HeartHandshake,
      value: setting(settings, "stat_faithful", "7.480"),
      label: "Umat terlayani",
      text: "Satu keluarga iman yang berjalan bersama.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Rumah Iman"
        title="Paroki Kami"
        description="Temukan paroki terdekat, jadwal misa, dan pastor yang siap mendampingi perjalanan iman Anda."
        image="/images/church-blue.jpg"
        breadcrumbs={[{ label: "Paroki" }]}
      />

      <section className="relative z-20 -mt-14 pb-10 md:-mt-16">
        <div className="container-site">
          <div className="grid overflow-hidden border border-wine-900/10 bg-paper shadow-soft sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, value, label, text }) => (
              <div
                key={label}
                className="border-b border-wine-900/10 p-6 last:border-b-0 sm:border-r lg:border-b-0 [&:nth-child(2)]:sm:border-r-0 [&:nth-child(2)]:lg:border-r [&:nth-child(3)]:sm:border-b-0 [&:nth-child(4)]:sm:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="font-display text-3xl font-semibold leading-none text-wine-950">
                    {value}
                  </p>
                </div>
                <p className="mt-4 text-[8px] font-extrabold uppercase tracking-[0.16em] text-gold-700">
                  {label}
                </p>
                <p className="mt-1.5 text-[10px] leading-5 text-stone">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad pt-8">
        <div className="container-site">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow">Direktori Paroki</span>
            <h2 className="section-title mt-5">
              Temukan rumah iman{" "}
              <span className="italic text-gold-700">terdekat.</span>
            </h2>
            <p className="mt-5 text-[13px] leading-7 text-stone">
              Setiap paroki memiliki kekhasan pelayanan dan komunitasnya sendiri.
              Gunakan pencarian atau pilih kevikepan untuk menemukan informasi yang
              Anda butuhkan.
            </p>
          </div>

          <ParishExplorer parishes={parishes} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-wine-950 py-20 text-white">
        <div className="absolute inset-0 bg-cross-pattern" />
        <div className="container-site relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="eyebrow eyebrow-light">Belum menemukan paroki?</span>
            <h2 className="mt-5 max-w-2xl font-display text-4xl font-medium leading-tight">
              Sekretariat keuskupan siap membantu Anda.
            </h2>
            <p className="mt-4 max-w-xl text-[12px] leading-6 text-white/55">
              Hubungi kami untuk informasi jadwal sakramen, pendaftaran kegiatan, atau
              pendampingan pastoral di paroki terdekat.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={`tel:${setting(settings, "phone")}`} className="btn-gold">
              {setting(settings, "phone")}
            </a>
            <a
              href={`mailto:${setting(settings, "email")}`}
              className="btn-outline-light"
            >
              Kirim Email
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
