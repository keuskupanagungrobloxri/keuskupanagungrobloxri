import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Quote, Users } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Crest } from "@/components/site/Crest";
import { getBishop, getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Uskup Agung",
};

export default function UskupPage() {
  const settings = getSettings();
  const bishop = getBishop(settings);

  const timeline = [
    { year: "1972", text: "Lahir di Kota Vianney, dibaptis di Paroki Santo Petrus." },
    { year: "2001", text: "Ditahbiskan menjadi imam untuk Keuskupan Agung ROBLOX." },
    { year: "2011", text: "Dipercaya memimpin Komisi Pendidikan dan Katekese Keuskupan." },
    { year: "2015", text: "Ditahbiskan sebagai Uskup Auksilier dan bertugas di Kevikepan Maranatha." },
    { year: "2021", text: "Ditunjuk sebagai Uskup Agung ROBLOX dan memulai masa pelayanan sebagai gembala keuskupan." },
  ];

  const focus = [
    {
      icon: Users,
      title: "Persaudaraan",
      text: "Membangun budaya mendengarkan dan berjalan bersama di keluarga, paroki, dan komunitas.",
    },
    {
      icon: BookOpen,
      title: "Pewartaan",
      text: "Menghadirkan Injil secara kreatif dan kontekstual, termasuk di ruang digital.",
    },
    {
      icon: HeartHandshake,
      title: "Belas Kasih",
      text: "Menguatkan karya diakonia yang berpihak kepada kaum miskin dan terpinggirkan.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Gembala Keuskupan"
        title={bishop?.name || settings.bishop_name}
        description={settings.bishop_title}
        image="/images/hero-stained.jpg"
        breadcrumbs={[{ label: "Profil", href: "/profil" }, { label: "Uskup Agung" }]}
      />

      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <div className="sticky top-40">
              <div className="relative overflow-hidden border border-wine-900/10 bg-wine-950">
                <div className="flex aspect-[4/5] flex-col items-center justify-center p-8 text-center">
                  <div className="absolute inset-0 bg-[url('/images/hero-stained.jpg')] bg-cover bg-center opacity-25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/75 to-wine-950/35" />
                  <div className="relative">
                    <Crest className="mx-auto h-28" />
                    <p className="mt-8 text-[8px] font-extrabold uppercase tracking-[0.26em] text-gold-300">
                      Uskup Agung ROBLOX
                    </p>
                    <h2 className="mt-3 font-display text-[2.3rem] font-medium leading-[1.05] text-white">
                      {bishop?.name || settings.bishop_name}
                    </h2>
                    <p className="mt-3 font-display text-base italic text-white/55">
                      “{settings.motto_latin}”
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 bg-wine-950 px-5 py-4">
                  <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/40">
                    Sejak 2021
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-gold-400">
                    Archidioecesis Robloxiana
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/profil/klerus"
                  className="border border-wine-900/15 px-4 py-3 text-center text-[8px] font-extrabold uppercase tracking-[0.13em] text-wine-900 transition hover:bg-wine-900 hover:text-white"
                >
                  Direktori Klerus
                </Link>
                <Link
                  href="/kontak"
                  className="bg-gold-400 px-4 py-3 text-center text-[8px] font-extrabold uppercase tracking-[0.13em] text-wine-950 transition hover:bg-gold-300"
                >
                  Hubungi
                </Link>
              </div>
            </div>
          </div>

          <div>
            <span className="eyebrow">Sapaan & Pelayanan</span>
            <h2 className="mt-5 font-display text-[clamp(2.4rem,4.5vw,4rem)] font-medium leading-[1.02] tracking-[-0.025em] text-wine-950">
              Menjadi gembala yang berjalan{" "}
              <span className="italic text-gold-700">di tengah umat.</span>
            </h2>
            <p className="mt-6 text-[13px] leading-7 text-stone">
              {bishop?.bio ||
                "Uskup Agung ROBLOX menggembalakan umat dengan semangat persaudaraan, pelayanan, dan dialog."}
            </p>
            <p className="mt-4 text-[13px] leading-7 text-stone">
              Dalam pelayanannya, Bapa Uskup menekankan pentingnya membangun Gereja
              yang dekat dengan kehidupan umat. Ia sering mengunjungi paroki,
              mendengarkan pengalaman keluarga muda, dan mendampingi karya sosial
              keuskupan. Baginya, kepemimpinan gerejawi bukanlah kekuasaan, melainkan
              pelayanan yang membebaskan dan memberi harapan.
            </p>

            <div className="mt-8 border-l-2 border-gold-400 bg-gold-50/60 px-6 py-5">
              <Quote className="h-6 w-6 text-gold-500" />
              <blockquote className="mt-3 font-display text-2xl italic leading-snug text-wine-900">
                “Gereja yang hidup selalu berani keluar, mendengarkan, dan merangkul.
                Kita tidak dipanggil untuk nyaman, tetapi untuk setia.”
              </blockquote>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {focus.map(({ icon: Icon, title, text }) => (
                <div key={title} className="border-t border-wine-900/15 pt-4">
                  <Icon className="h-4 w-4 text-gold-600" />
                  <h3 className="mt-3 font-display text-xl font-semibold text-wine-950">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-6 text-stone">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-wine-900/10 pt-10">
              <span className="eyebrow">Jejak Pelayanan</span>
              <h3 className="mt-4 font-display text-4xl font-medium text-wine-950">
                Perjalanan panggilan.
              </h3>
              <div className="mt-8">
                {timeline.map((item, index) => (
                  <div key={item.year} className="grid grid-cols-[64px_1fr] gap-5">
                    <div className="relative border-r border-wine-900/10 pb-7 text-right">
                      <span className="pr-4 font-display text-lg font-semibold text-gold-700">
                        {item.year}
                      </span>
                      {index < timeline.length - 1 && (
                        <span className="absolute -right-[3.5px] top-2 h-1.5 w-1.5 rounded-full bg-gold-500" />
                      )}
                    </div>
                    <p className="pb-7 text-[12px] leading-6 text-stone">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col items-start justify-between gap-5 bg-wine-950 p-7 text-white sm:flex-row sm:items-center">
              <div>
                <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-300">
                  Doa Bersama Gembala
                </p>
                <p className="mt-2 font-display text-2xl italic">
                  “Tuhan, jadikanlah kami Gereja yang berbelarasa.”
                </p>
              </div>
              <Link
                href="/profil/klerus"
                className="inline-flex shrink-0 items-center gap-2 border border-white/20 px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.14em] transition hover:bg-white/10"
              >
                Lihat Klerus <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
