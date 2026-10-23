import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Church,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose } from "@/components/site/Prose";
import {
  getMassesByParish,
  getParishes,
  getParishBySlug,
  getSettings,
  setting,
} from "@/lib/content";
import { formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parish = getParishBySlug(slug);
  if (!parish) return { title: "Paroki tidak ditemukan" };
  return {
    title: parish.name,
    description: parish.description,
  };
}

const DAY_ORDER = [
  "Minggu",
  "Sabtu",
  "Jumat Pertama",
  "Jumat",
  "Kamis",
  "Rabu",
  "Selasa",
  "Senin",
  "Senin–Jumat",
  "Setiap Hari",
];

export default async function ParishDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parish = getParishBySlug(slug);
  if (!parish) notFound();

  const masses = getMassesByParish(parish.id).sort(
    (a, b) =>
      (DAY_ORDER.indexOf(a.day) === -1 ? 99 : DAY_ORDER.indexOf(a.day)) -
        (DAY_ORDER.indexOf(b.day) === -1 ? 99 : DAY_ORDER.indexOf(b.day)) ||
      a.time.localeCompare(b.time),
  );
  const parishes = getParishes();
  const settings = getSettings();
  const related = parishes.filter((item) => item.id !== parish.id).slice(0, 3);

  const contact = [
    { icon: MapPin, label: "Alamat", value: `${parish.address}, ${parish.city}` },
    { icon: Phone, label: "Telepon", value: parish.phone || "Belum tersedia" },
    { icon: Mail, label: "Email", value: parish.email || "Belum tersedia" },
    { icon: UserRound, label: "Pastor Paroki", value: parish.pastor_name || "—" },
  ];

  return (
    <>
      <PageHero
        eyebrow={parish.vicariate}
        title={parish.name}
        description={`Pelindung: ${parish.patron} · ${parish.city}`}
        image={parish.image || "/images/cathedral-exterior.jpg"}
        breadcrumbs={[
          { label: "Paroki", href: "/paroki" },
          { label: parish.name },
        ]}
      />

      <section className="section-pad">
        <div className="container-site">
          <Link
            href="/paroki"
            className="group inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-wine-800 transition hover:text-gold-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
            Kembali ke direktori paroki
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1.35fr_.65fr] lg:gap-16">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="border border-gold-500/40 bg-gold-50 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-gold-800">
                  {parish.vicariate}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone">
                  Paroki Keuskupan Agung ROBLOX
                </span>
              </div>

              <h2 className="mt-5 font-display text-4xl font-medium text-wine-950 md:text-5xl">
                {parish.name}
              </h2>
              <p className="mt-2 font-display text-xl italic text-gold-700">
                Pelindung: {parish.patron}
              </p>

              <div className="mt-8 border-y border-wine-900/10 py-7">
                <Prose content={parish.description} />
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold-600" />
                  <h3 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                    Jadwal Misa & Pelayanan
                  </h3>
                </div>

                {masses.length ? (
                  <div className="mt-5 overflow-hidden border border-wine-900/10 bg-paper">
                    <div className="grid grid-cols-[110px_90px_1fr] gap-3 border-b border-wine-900/10 bg-cream/70 px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.14em] text-stone">
                      <span>Hari</span>
                      <span>Waktu</span>
                      <span>Keterangan</span>
                    </div>
                    {masses.map((mass) => (
                      <div
                        key={mass.id}
                        className="grid grid-cols-[110px_90px_1fr] items-start gap-3 border-b border-wine-900/8 px-5 py-4 last:border-0"
                      >
                        <span className="text-[11px] font-bold text-wine-950">
                          {mass.day}
                        </span>
                        <span className="font-display text-lg font-semibold text-wine-900">
                          {formatTime(mass.time)}
                        </span>
                        <span className="text-[11px] leading-5 text-stone">
                          <span className="block font-semibold text-ink/75">
                            {mass.type}
                          </span>
                          {mass.location && (
                            <span className="text-[10px] text-stone/70">
                              {mass.location}
                            </span>
                          )}
                          {mass.note && (
                            <span className="mt-0.5 block text-[10px] italic text-gold-700">
                              {mass.note}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 border border-dashed border-wine-900/20 bg-paper px-5 py-8 text-[12px] text-stone">
                    Jadwal misa belum tersedia. Silakan hubungi sekretariat paroki.
                  </p>
                )}

                {parish.mass_note && (
                  <p className="mt-4 border-l-2 border-gold-500 bg-gold-50/60 px-4 py-3 text-[11px] leading-6 text-wine-900">
                    {parish.mass_note}
                  </p>
                )}

                <p className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-stone/70">
                  <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                  {setting(settings, "mass_notes")}
                </p>
              </div>
            </div>

            <aside className="h-fit space-y-5 lg:sticky lg:top-40">
              <div className="border border-wine-900/10 bg-paper p-6">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                  Informasi Paroki
                </p>
                <dl className="mt-5 space-y-4">
                  {contact.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-3">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                      <div>
                        <dt className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-stone/60">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-[11px] leading-5 text-ink/80">
                          {value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
                {parish.phone && (
                  <a
                    href={`tel:${parish.phone}`}
                    className="mt-6 flex items-center justify-center gap-2 bg-wine-900 px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-wine-950"
                  >
                    <Phone className="h-3.5 w-3.5 text-gold-300" />
                    Hubungi Paroki
                  </a>
                )}
              </div>

              <div className="border border-wine-900/10 bg-cream p-6">
                <Church className="h-5 w-5 text-gold-600" />
                <p className="mt-4 font-display text-xl font-semibold leading-tight text-wine-950">
                  Butuh pendampingan pastoral?
                </p>
                <p className="mt-2 text-[11px] leading-5 text-stone">
                  Sampaikan kebutuhan sakramen, doa, atau pendampingan keluarga melalui
                  sekretariat paroki atau keuskupan.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-wine-800 transition hover:text-gold-700"
                >
                  Hubungi Sekretariat <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16 border-t border-wine-900/10 pt-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="eyebrow">Paroki lainnya</span>
                  <h2 className="mt-4 font-display text-3xl font-medium text-wine-950">
                    Jelajahi rumah iman di sekitar.
                  </h2>
                </div>
                <Link href="/paroki" className="btn-outline group">
                  Semua Paroki
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/paroki/${item.slug}`}
                    className="group border border-wine-900/10 bg-paper p-5 transition hover:border-gold-400"
                  >
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-gold-700">
                      {item.vicariate}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-wine-950 transition group-hover:text-wine-700">
                      {item.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-[10px] text-stone">
                      <MapPin className="h-3 w-3 text-gold-600" />
                      {item.city}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
