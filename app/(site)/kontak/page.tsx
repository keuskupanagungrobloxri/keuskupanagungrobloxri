import Link from "next/link";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/site/SocialIcons";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import { getSettings, setting } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontak & Pelayanan",
  description:
    "Hubungi sekretariat Keuskupan Agung ROBLOX untuk informasi pelayanan, sakramen, kegiatan, dan kerja sama.",
};

export default function KontakPage() {
  const settings = getSettings();

  const channels = [
    {
      icon: MapPin,
      label: "Alamat Sekretariat",
      value: `${setting(settings, "address")}, ${setting(settings, "city")} ${setting(
        settings,
        "postal_code",
      )}`,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${setting(settings, "address")} ${setting(settings, "city")}`,
      )}`,
    },
    {
      icon: Phone,
      label: "Telepon",
      value: setting(settings, "phone"),
      href: `tel:${setting(settings, "phone")}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: setting(settings, "whatsapp"),
      href: `https://wa.me/${setting(settings, "whatsapp").replace(/[^0-9]/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: setting(settings, "email"),
      href: `mailto:${setting(settings, "email")}`,
    },
  ];

  const socials = [
    { icon: InstagramIcon, label: "Instagram", href: setting(settings, "instagram") },
    { icon: TikTokIcon, label: "TikTok", href: setting(settings, "tiktok") },
    { icon: YoutubeIcon, label: "YouTube", href: setting(settings, "youtube") },
  ];

  return (
    <>
      <PageHero
        eyebrow="Terhubung dengan Kami"
        title="Kontak & Pelayanan"
        description="Sekretariat keuskupan siap membantu Anda. Sampaikan pertanyaan, permohonan doa, atau kebutuhan pelayanan melalui kanal berikut."
        image="/images/church-wood.jpg"
        breadcrumbs={[{ label: "Kontak" }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
            <div>
              <span className="eyebrow">Sekretariat Keuskupan</span>
              <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-wine-950">
                Kami siap mendengarkan.
              </h2>
              <p className="mt-5 text-[13px] leading-7 text-stone">
                Baik untuk informasi sakramen, jadwal kegiatan, karya sosial, maupun
                kerja sama media, sampaikan pesan Anda dan tim kami akan menindaklanjuti.
              </p>

              <div className="mt-8 space-y-3">
                {channels.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-start gap-4 border border-wine-900/10 bg-paper p-5 transition hover:border-gold-400"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone/60">
                        {label}
                      </p>
                      <p className="mt-1 text-[12px] font-semibold leading-5 text-wine-950 transition group-hover:text-wine-700">
                        {value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-4 border border-wine-900/10 bg-cream p-5">
                <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-gold-700">
                    Jam Pelayanan
                  </p>
                  <p className="mt-1.5 text-[12px] font-semibold text-wine-950">
                    {setting(settings, "office_hours")}
                  </p>
                  <p className="mt-1 text-[10px] leading-5 text-stone">
                    Layanan konsultasi di luar jam kerja dapat dilakukan dengan
                    perjanjian.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-stone/60">
                  Media sosial
                </span>
                <div className="flex gap-2">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href || "#"}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center border border-wine-900/15 text-wine-800 transition hover:border-gold-500 hover:bg-gold-400 hover:text-wine-950"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-wine-900/10 bg-paper p-6 shadow-soft md:p-9">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                Formulir Pesan
              </p>
              <h3 className="mt-3 font-display text-3xl font-medium text-wine-950">
                Tuliskan pesan Anda.
              </h3>
              <p className="mt-2 text-[11px] leading-6 text-stone">
                Kami akan merespons melalui email atau telepon yang Anda cantumkan.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="mt-16 overflow-hidden border border-wine-900/10 bg-paper">
            <div className="grid md:grid-cols-[1fr_1.2fr]">
              <div className="p-7 md:p-9">
                <MapPin className="h-5 w-5 text-gold-600" />
                <h3 className="mt-4 font-display text-2xl font-semibold text-wine-950">
                  Kunjungi kami
                </h3>
                <p className="mt-2 text-[11px] leading-6 text-stone">
                  {setting(settings, "address")}
                  <br />
                  {setting(settings, "city")}, {setting(settings, "province")}{" "}
                  {setting(settings, "postal_code")}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${setting(settings, "address")} ${setting(settings, "city")}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline mt-6"
                >
                  Buka Peta
                </a>
              </div>
              <div className="relative min-h-[260px] overflow-hidden bg-wine-950">
                <div className="absolute inset-0 bg-cross-pattern opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-wine-900 via-wine-950 to-wine-900" />
                <div className="relative flex h-full flex-col items-center justify-center p-8 text-center text-white">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-400/40">
                    <MapPin className="h-6 w-6 text-gold-300" />
                  </span>
                  <p className="mt-5 font-display text-2xl font-semibold">
                    {setting(settings, "site_name")}
                  </p>
                  <p className="mt-2 max-w-xs text-[11px] leading-5 text-white/55">
                    {setting(settings, "address")}, {setting(settings, "city")}
                  </p>
                  <Link
                    href="/paroki"
                    className="mt-5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-gold-300 transition hover:text-white"
                  >
                    Lihat Paroki Terdekat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
