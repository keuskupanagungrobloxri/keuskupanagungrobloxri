import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Church,
  Clock3,
  HeartHandshake,
  MapPin,
  Megaphone,
  Quote,
  Users,
} from "lucide-react";
import {
  getActiveAnnouncements,
  getBishop,
  getFeaturedArticles,
  getGallery,
  getKatedralMasses,
  getParishes,
  getPublishedArticles,
  getSettings,
  getUpcomingEvents,
  setting,
} from "@/lib/content";
import {
  formatDateID,
  formatDateTimeID,
  formatNumber,
} from "@/lib/utils";
import { ArticleCard, ArticleRow } from "@/components/site/ArticleCard";
import { EventCard } from "@/components/site/EventCard";
import { ParishCard } from "@/components/site/ParishCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Crest } from "@/components/site/Crest";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const settings = getSettings();
  const articles = getPublishedArticles(7);
  const featured = getFeaturedArticles(1);
  const latest = articles.filter((article) => article.id !== featured[0]?.id);
  const events = getUpcomingEvents(4);
  const parishes = getParishes().slice(0, 3);
  const masses = getKatedralMasses();
  const announcements = getActiveAnnouncements();
  const gallery = getGallery(6);
  const bishop = getBishop(settings);

  const sundayMasses = masses.filter((mass) => mass.day === "Minggu").slice(0, 3);
  const stats = [
    {
      value: setting(settings, "stat_parishes", "8"),
      label: setting(settings, "stat_parishes_label", "Paroki"),
      icon: Church,
    },
    {
      value: setting(settings, "stat_priests", "24"),
      label: setting(settings, "stat_priests_label", "Klerus"),
      icon: Users,
    },
    {
      value: setting(settings, "stat_faithful", "7.480"),
      label: setting(settings, "stat_faithful_label", "Umat"),
      icon: HeartHandshake,
    },
    {
      value: setting(settings, "stat_works", "18"),
      label: setting(settings, "stat_works_label", "Karya Pastoral"),
      icon: BookOpen,
    },
  ];

  return (
    <>
      <section className="grain relative isolate min-h-[700px] overflow-hidden bg-wine-950 text-white md:min-h-[760px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={setting(settings, "hero_image", "/images/hero-church.jpg")}
          alt="Suasana Katedral Keuskupan Agung ROBLOX"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-950 via-wine-950/85 to-wine-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-transparent to-wine-950/30" />
        <div className="absolute inset-0 bg-cross-pattern" />

        <div className="container-site relative z-10 flex min-h-[700px] flex-col justify-center py-20 md:min-h-[760px] md:py-24">
          <div className="max-w-[830px]">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-3 border border-gold-400/30 bg-white/[0.04] px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.24em] text-gold-300 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {setting(settings, "hero_eyebrow", "Keuskupan Agung ROBLOX")}
              </span>
            </div>
            <h1
              className="mt-7 animate-fade-up font-display text-[clamp(3rem,6.7vw,6.2rem)] font-medium leading-[0.94] tracking-[-0.035em] text-balance"
              style={{ animationDelay: "100ms" }}
            >
              {setting(
                settings,
                "hero_title",
                "Menjadi Gereja yang hidup, berjalan bersama, dan berbuah dalam kasih.",
              )}
            </h1>
            <p
              className="mt-7 max-w-xl animate-fade-up text-[13px] leading-7 text-white/65 md:text-[14px]"
              style={{ animationDelay: "220ms" }}
            >
              {setting(settings, "hero_description")}
            </p>
            <div
              className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "320ms" }}
            >
              <Link href="/profil" className="btn-gold group">
                Jelajahi Keuskupan
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link href="/liturgi" className="btn-outline-light">
                <CalendarDays className="h-4 w-4 text-gold-300" />
                Jadwal Misa
              </Link>
            </div>
          </div>

          <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex">
            <span className="h-16 w-px bg-gradient-to-b from-transparent to-gold-400/60" />
            <span
              className="text-[8px] font-bold uppercase tracking-[0.42em] text-gold-300/70"
              style={{ writingMode: "vertical-rl" }}
            >
              {setting(settings, "motto_latin", "Ut Unum Sint")}
            </span>
            <Crest className="h-10 opacity-50" />
            <span className="h-16 w-px bg-gradient-to-b from-gold-400/60 to-transparent" />
          </div>
        </div>

        <div className="absolute bottom-6 right-6 hidden items-center gap-4 border border-white/15 bg-wine-950/40 px-5 py-4 backdrop-blur-sm lg:flex">
          <span className="font-display text-4xl font-medium leading-none text-gold-300">
            100
          </span>
          <span className="text-[8px] font-bold uppercase leading-[1.7] tracking-[0.16em] text-white/55">
            Tahun Karya
            <br />
            Misi 1926–2026
          </span>
        </div>
      </section>

      <section className="relative z-20 -mt-14 pb-10 md:-mt-16">
        <div className="container-site">
          <div className="grid overflow-hidden border border-wine-900/10 bg-paper shadow-soft md:grid-cols-3">
            <div className="group border-b border-wine-900/10 p-7 md:border-b-0 md:border-r">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <Clock3 className="h-4 w-4" />
                </span>
                <Link
                  href="/liturgi"
                  className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-wine-800/50 transition hover:text-wine-900"
                >
                  Semua jadwal
                </Link>
              </div>
              <p className="mt-5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                Misa Minggu · Katedral
              </p>
              <div className="mt-3 flex items-end gap-5">
                {sundayMasses.length ? (
                  sundayMasses.map((mass, index) => (
                    <div key={mass.id} className="flex items-end gap-5">
                      {index > 0 && <span className="mb-2 h-8 w-px bg-wine-900/10" />}
                      <div>
                        <p className="font-display text-3xl font-semibold leading-none text-wine-950">
                          {mass.time.replace(":", ".")}
                        </p>
                        <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.11em] text-stone/60">
                          WIB
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="font-display text-2xl text-wine-900">Lihat jadwal</p>
                )}
              </div>
            </div>

            <div className="group border-b border-wine-900/10 p-7 md:border-b-0 md:border-r">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-wine-50 text-wine-700">
                  <Megaphone className="h-4 w-4" />
                </span>
                <Link
                  href="/pengumuman"
                  className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-wine-800/50 transition hover:text-wine-900"
                >
                  Baca
                </Link>
              </div>
              <p className="mt-5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                Pengumuman
              </p>
              <h3 className="mt-2 line-clamp-2 font-display text-[1.35rem] font-semibold leading-tight text-wine-950">
                {announcements[0]?.title ||
                  "Layanan sekretariat keuskupan siap membantu umat."}
              </h3>
            </div>

            <div className="group p-7">
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <Link
                  href="/agenda"
                  className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-wine-800/50 transition hover:text-wine-900"
                >
                  Agenda
                </Link>
              </div>
              <p className="mt-5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                Kegiatan terdekat
              </p>
              <h3 className="mt-2 line-clamp-1 font-display text-[1.35rem] font-semibold leading-tight text-wine-950">
                {events[0]?.title || "Temu pastoral keuskupan"}
              </h3>
              {events[0] && (
                <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-stone">
                  {formatDateTimeID(events[0].start_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-wine-900/10 bg-cream">
        <div className="container-site grid grid-cols-2 divide-x divide-wine-900/10 py-1 md:grid-cols-4">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 px-4 py-7 md:px-8">
              <Icon className="hidden h-5 w-5 text-gold-600/60 sm:block" />
              <div>
                <p className="font-display text-[2rem] font-semibold leading-none text-wine-950">
                  {value}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone/60">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad overflow-hidden">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr] lg:gap-20">
          <div className="relative">
            <div className="relative aspect-[4/5] max-h-[620px] overflow-hidden bg-wine-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero-stained.jpg"
                alt="Jendela kaca patri di Katedral"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950/50 to-transparent" />
            </div>
            <div className="absolute -bottom-8 -right-4 w-[250px] border border-gold-400/20 bg-wine-950 p-6 text-white shadow-soft sm:-right-8 sm:w-[290px]">
              <Quote className="h-7 w-7 text-gold-400" />
              <p className="mt-4 font-display text-[1.35rem] italic leading-snug text-white/85">
                “{setting(settings, "motto_id", "Agar mereka semua menjadi satu.")}”
              </p>
              <p className="mt-4 text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-300">
                {setting(settings, "motto_reference", "Yohanes 17:21")}
              </p>
            </div>
            <div className="absolute -left-4 -top-4 hidden h-24 w-24 border-l border-t border-gold-500/40 sm:block" />
          </div>

          <div>
            <span className="eyebrow">
              {setting(settings, "welcome_title", "Sapaan Gembala")}
            </span>
            <h2 className="section-title mt-5 text-balance">
              Berjalan bersama,{" "}
              <span className="italic text-gold-700">menjadi saksi kasih.</span>
            </h2>
            <p className="mt-6 font-display text-2xl italic leading-snug text-wine-900">
              “{setting(settings, "welcome_lead")}”
            </p>
            <div className="mt-5 space-y-4 text-[13px] leading-7 text-stone">
              {setting(settings, "welcome_message")
                .split("\n\n")
                .slice(0, 2)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-wine-900/10 pt-6">
              <div>
                <p className="font-display text-[1.55rem] font-semibold leading-tight text-wine-950">
                  {setting(settings, "bishop_name")}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.16em] text-gold-700">
                  {setting(settings, "bishop_title")}
                </p>
              </div>
              <Link href="/profil/uskup" className="btn-outline group ml-auto">
                Profil Gembala
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-wine-950 py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-cross-pattern" />
        <div className="container-site relative">
          <SectionHeading
            eyebrow="Warta Keuskupan"
            title="Kabar hidup dari tengah umat."
            description="Cerita pelayanan, perayaan iman, dan karya kasih yang bertumbuh di paroki-paroki Keuskupan Agung ROBLOX."
            href="/berita"
            light
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            {featured[0] ? (
              <ArticleCard
                article={featured[0]}
                featured
                className="border-white/10 bg-white/[0.045] text-white [&_h3]:text-white [&_p]:text-white/50"
              />
            ) : (
              latest[0] && <ArticleCard article={latest[0]} className="bg-white" />
            )}
            <div className="border border-white/10 bg-white/[0.035] p-6 md:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-300">
                  Berita terkini
                </p>
                <Link
                  href="/berita"
                  className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/40 transition hover:text-white"
                >
                  Semua berita
                </Link>
              </div>
              <div className="mt-2">
                {latest.slice(0, 4).map((article) => (
                  <div
                    key={article.id}
                    className="border-b border-white/10 py-4 last:border-0 [&_a]:text-white [&_h4]:text-white [&_p]:text-white/40"
                  >
                    <ArticleRow article={article} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {latest.slice(4, 7).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                className="border-white/10 bg-white/[0.045] [&_h3]:text-white [&_p]:text-white/50 [&_span]:text-white/45"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gold-400 py-16 md:py-20">
        <div className="absolute inset-0 bg-[url('/images/hero-stained.jpg')] bg-cover bg-center opacity-10" />
        <div className="container-site relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div className="max-w-4xl">
            <Quote className="h-9 w-9 text-wine-900/25" />
            <blockquote className="mt-3 font-display text-[clamp(1.9rem,4vw,3.35rem)] font-medium italic leading-[1.16] tracking-[-0.02em] text-wine-950">
              “{setting(settings, "liturgy_verse")}”
            </blockquote>
            <p className="mt-5 text-[9px] font-extrabold uppercase tracking-[0.22em] text-wine-900/60">
              {setting(settings, "liturgy_verse_ref", "Matius 18:20")}
            </p>
          </div>
          <Link
            href="/liturgi"
            className="inline-flex shrink-0 items-center gap-3 border border-wine-900/25 px-6 py-4 text-[9px] font-extrabold uppercase tracking-[0.16em] text-wine-950 transition hover:bg-wine-950 hover:text-white"
          >
            Hidup Liturgi <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading
            eyebrow="Agenda & Karya"
            title="Ruang untuk bertemu dan bertumbuh."
            description="Ikuti kegiatan pastoral, pembinaan iman, dan karya pelayanan yang terbuka bagi seluruh umat."
            href="/agenda"
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="border-t border-wine-900/10">
              {events.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="relative min-h-[420px] overflow-hidden bg-wine-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={setting(settings, "campaign_image", "/images/bible.jpg")}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/55 to-wine-950/10" />
              <div className="relative flex h-full flex-col justify-end p-8 text-white md:p-10">
                <span className="eyebrow eyebrow-light">
                  {setting(settings, "campaign_label")}
                </span>
                <h3 className="mt-4 max-w-md font-display text-[2.4rem] font-medium leading-[1.05] tracking-[-0.02em]">
                  {setting(settings, "campaign_title")}
                </h3>
                <p className="mt-4 max-w-md text-[12px] leading-6 text-white/60">
                  {setting(settings, "campaign_text")}
                </p>
                <Link
                  href={setting(settings, "campaign_link", "/berita")}
                  className="mt-7 inline-flex w-fit items-center gap-2 bg-gold-400 px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-wine-950 transition hover:bg-gold-300"
                >
                  Ikuti Kegiatan <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-wine-900/10 bg-cream py-20 md:py-24">
        <div className="absolute right-0 top-0 font-display text-[18rem] leading-none text-wine-900/[0.025]">
          ✛
        </div>
        <div className="container-site relative">
          <SectionHeading
            eyebrow="Paroki Kami"
            title="Rumah iman di tengah kota."
            description="Temukan paroki terdekat, jadwal misa, dan pastor yang siap mendampingi perjalanan iman Anda."
            href="/paroki"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {parishes.map((parish) => (
              <ParishCard key={parish.id} parish={parish} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-end">
            <SectionHeading
              eyebrow="Galeri Keuskupan"
              title="Jejak-jejak iman yang hidup."
              description="Momen perayaan, pelayanan, dan kebersamaan umat dalam bingkai dokumentasi keuskupan."
              href="/media"
            />
            <div className="grid grid-cols-3 gap-2.5">
              {gallery.slice(0, 6).map((item, index) => (
                <Link
                  key={item.id}
                  href="/media"
                  className={`group relative overflow-hidden bg-wine-950 ${
                    index === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                      index === 0 ? "aspect-square" : "aspect-square"
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-wine-950/0 transition group-hover:bg-wine-950/30" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-wine-950 py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-cross-pattern" />
        <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-gold-400/10" />
        <div className="container-site relative grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <span className="eyebrow eyebrow-light">Karya Kasih</span>
            <h2 className="mt-5 max-w-2xl font-display text-[clamp(2.4rem,5vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.03em]">
              {setting(settings, "donation_title")}
            </h2>
            <p className="mt-6 max-w-xl text-[13px] leading-7 text-white/55">
              {setting(settings, "donation_description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kontak" className="btn-gold">
                Hubungi Sekretariat <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/profil" className="btn-outline-light">
                Kenali Karya Kami
              </Link>
            </div>
          </div>
          <div className="border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm">
            <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-300">
              Dukungan Pelayanan
            </p>
            <div className="mt-5 space-y-4 border-t border-white/10 pt-5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40">
                  Bank
                </span>
                <span className="text-right font-display text-xl text-white">
                  {setting(settings, "bank_name")}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40">
                  Nomor
                </span>
                <span className="text-right font-mono text-base tracking-wider text-gold-300">
                  {setting(settings, "bank_account")}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/40">
                  Atas nama
                </span>
                <span className="text-right text-[12px] font-semibold text-white">
                  {setting(settings, "bank_holder")}
                </span>
              </div>
            </div>
            <p className="mt-6 flex items-start gap-2 border-t border-white/10 pt-4 text-[10px] leading-5 text-white/35">
              <HeartHandshake className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
              Setiap dukungan dikelola secara transparan untuk karya pastoral dan
              pelayanan kasih keuskupan.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
