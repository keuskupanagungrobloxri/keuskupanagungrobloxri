import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Crest } from "./Crest";
import { InstagramIcon, TikTokIcon, YoutubeIcon } from "./SocialIcons";
import type { SettingsMap } from "@/lib/types";
import { setting } from "@/lib/utils";

export function SiteFooter({ settings }: { settings: SettingsMap }) {
  return (
    <footer className="relative overflow-hidden bg-wine-950 text-white">
      <div className="absolute inset-0 bg-cross-pattern" />
      <div className="absolute -right-32 -top-48 h-[480px] w-[480px] rounded-full border border-gold-400/10" />
      <div className="absolute -right-20 -top-32 h-[360px] w-[360px] rounded-full border border-gold-400/10" />

      <div className="relative">
        <div className="border-b border-white/10">
          <div className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="eyebrow eyebrow-light">Terhubung dengan kami</span>
              <h2 className="mt-5 max-w-2xl font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-white md:text-5xl">
                {setting(
                  settings,
                  "newsletter_title",
                  "Tetap terhubung dengan hidup keuskupan",
                )}
              </h2>
              <p className="mt-4 max-w-xl text-[13px] leading-7 text-white/55">
                {setting(settings, "newsletter_text")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center gap-2 bg-gold-400 px-7 py-4 text-[10px] font-extrabold uppercase tracking-[0.17em] text-wine-950 transition hover:bg-gold-300"
              >
                Kirim Pesan <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/agenda"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-4 text-[10px] font-extrabold uppercase tracking-[0.17em] text-white transition hover:border-gold-300 hover:bg-white/5"
              >
                Lihat Agenda
              </Link>
            </div>
          </div>
        </div>

        <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-4">
              <Crest className="h-16 w-auto" />
              <span>
                <span className="block text-[8px] font-extrabold uppercase tracking-[0.28em] text-gold-400">
                  Keuskupan Agung
                </span>
                <span className="block font-display text-[34px] font-semibold leading-none text-white">
                  ROBLOX
                </span>
                <span className="mt-1 block font-display text-[10px] italic tracking-wide text-white/45">
                  Archidioecesis Robloxiana
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-[12px] leading-7 text-white/50">
              {setting(settings, "footer_text")}
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { href: setting(settings, "instagram"), icon: InstagramIcon, label: "Instagram" },
                { href: setting(settings, "tiktok"), icon: TikTokIcon, label: "TikTok" },
                { href: setting(settings, "youtube"), icon: YoutubeIcon, label: "YouTube" },
                { href: `mailto:${setting(settings, "email")}`, icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href || "#"}
                  target={href?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition hover:border-gold-400 hover:bg-gold-400 hover:text-wine-950"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-400">
              Jelajahi
            </h3>
            <ul className="mt-5 space-y-3 text-[11px] font-medium text-white/55">
              {[
                ["Profil Keuskupan", "/profil"],
                ["Uskup Agung", "/profil/uskup"],
                ["Direktori Klerus", "/profil/klerus"],
                ["Sejarah", "/halaman/sejarah"],
                ["Visi & Misi", "/halaman/visi-misi"],
                ["Arah Dasar", "/halaman/arah-dasar"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link className="link-underline transition hover:text-white" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-400">
              Pelayanan
            </h3>
            <ul className="mt-5 space-y-3 text-[11px] font-medium text-white/55">
              {[
                ["Paroki", "/paroki"],
                ["Jadwal Misa", "/liturgi"],
                ["Agenda", "/agenda"],
                ["Berita", "/berita"],
                ["Galeri", "/media"],
                ["Kontak", "/kontak"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link className="link-underline transition hover:text-white" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-gold-400">
              Sekretariat
            </h3>
            <ul className="mt-5 space-y-4 text-[11px] leading-6 text-white/55">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-400" />
                <span>
                  {setting(settings, "address")}
                  <br />
                  {setting(settings, "city")} {setting(settings, "postal_code")}
                </span>
              </li>
              <li>
                <a
                  href={`tel:${setting(settings, "phone")}`}
                  className="flex gap-3 transition hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                  {setting(settings, "phone")}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${setting(settings, "email")}`}
                  className="flex gap-3 transition hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                  {setting(settings, "email")}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock3 className="h-3.5 w-3.5 shrink-0 text-gold-400" />
                {setting(settings, "office_hours")}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-site flex flex-col gap-3 py-6 text-[9px] font-medium uppercase tracking-[0.12em] text-white/35 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {setting(settings, "site_name")}. Semua hak
              dilayani untuk kemuliaan Allah.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/kontak" className="transition hover:text-white">
                Kebijakan Privasi
              </Link>
              <Link href="/kontak" className="transition hover:text-white">
                Ketentuan Penggunaan
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-1 text-gold-400/70 transition hover:text-gold-300"
              >
                Panel Admin <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
