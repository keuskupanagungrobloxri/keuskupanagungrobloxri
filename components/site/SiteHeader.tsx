"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { Crest } from "./Crest";
import { InstagramIcon, TikTokIcon, YoutubeIcon } from "./SocialIcons";
import type { SettingsMap } from "@/lib/types";
import { cn, setting } from "@/lib/utils";

const nav = [
  { href: "/", label: "Beranda" },
  {
    href: "/profil",
    label: "Profil",
    children: [
      { href: "/profil", label: "Profil Keuskupan" },
      { href: "/profil/uskup", label: "Uskup Agung" },
      { href: "/profil/klerus", label: "Direktori Klerus" },
      { href: "/halaman/sejarah", label: "Sejarah" },
      { href: "/halaman/visi-misi", label: "Visi & Misi" },
      { href: "/halaman/arah-dasar", label: "Arah Dasar" },
    ],
  },
  { href: "/paroki", label: "Paroki" },
  { href: "/berita", label: "Berita" },
  {
    href: "/liturgi",
    label: "Liturgi",
    children: [
      { href: "/liturgi", label: "Jadwal Misa" },
      { href: "/agenda", label: "Agenda Keuskupan" },
    ],
  },
  { href: "/media", label: "Media" },
  { href: "/kontak", label: "Kontak" },
];

type Props = {
  settings: SettingsMap;
  isAdmin: boolean;
  announcement?: { title: string; message: string; tone: string } | null;
};

export function SiteHeader({ settings, isAdmin, announcement }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [noticeVisible, setNoticeVisible] = useState(true);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-wine-950 text-white/75">
        <div className="container-site flex h-9 items-center justify-between gap-6 text-[9px] font-semibold uppercase tracking-[0.13em]">
          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-2 sm:flex">
              <MapPin className="h-3 w-3 text-gold-400" />
              {setting(settings, "city", "Kota Vianney")}
            </span>
            <a
              href={`tel:${setting(settings, "phone")}`}
              className="hidden items-center gap-2 transition hover:text-gold-300 md:flex"
            >
              <Phone className="h-3 w-3 text-gold-400" />
              {setting(settings, "phone")}
            </a>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-gold-400" />
              {setting(settings, "tagline", "Ut Unum Sint")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 border-r border-white/15 pr-4 sm:flex">
              <a
                href={setting(settings, "instagram") || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="transition hover:text-gold-300"
              >
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href={setting(settings, "tiktok") || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="transition hover:text-gold-300"
              >
                <TikTokIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href={setting(settings, "youtube") || "#"}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="transition hover:text-gold-300"
              >
                <YoutubeIcon className="h-3.5 w-3.5" />
              </a>
            </div>
            <Link
              href={isAdmin ? "/admin" : "/admin/login"}
              className="flex items-center gap-1.5 text-gold-300 transition hover:text-white"
            >
              {isAdmin ? "Panel Admin" : "Login Admin"}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-wine-950/10 bg-paper/95 backdrop-blur-md">
        <div className="container-site flex h-[82px] items-center justify-between gap-6">
          <Link href="/" className="group flex shrink-0 items-center gap-3.5">
            <Crest className="h-[51px] w-auto transition duration-500 group-hover:-translate-y-0.5" />
            <span className="hidden border-l border-wine-900/15 pl-3.5 sm:block">
              <span className="block text-[8px] font-extrabold uppercase tracking-[0.3em] text-gold-700">
                Keuskupan Agung
              </span>
              <span className="block font-display text-[26px] font-semibold leading-[0.95] tracking-[-0.02em] text-wine-950">
                ROBLOX
              </span>
              <span className="mt-0.5 block font-display text-[9px] italic tracking-wide text-stone">
                Archidioecesis Robloxiana
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex">
            {nav.map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1 py-7 text-[9.5px] font-extrabold uppercase tracking-[0.15em] transition",
                    isActive(item.href)
                      ? "text-wine-900"
                      : "text-ink/55 hover:text-wine-900",
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="h-3 w-3 text-gold-600 transition group-hover:rotate-180" />
                  )}
                  <span
                    className={cn(
                      "absolute bottom-[17px] left-0 h-px bg-gold-500 transition-all duration-300",
                      isActive(item.href) ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full w-60 -translate-x-1/2 translate-y-2 border-t-2 border-gold-500 bg-white opacity-0 shadow-soft transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2.5 text-[11px] font-semibold text-ink/65 transition hover:bg-cream hover:pl-6 hover:text-wine-900"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/kontak"
              className="hidden items-center gap-2 border border-wine-900/15 px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.15em] text-wine-950 transition hover:border-wine-900 hover:bg-wine-900 hover:text-white lg:flex"
            >
              <Mail className="h-3.5 w-3.5 text-gold-600" />
              Hubungi Kami
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center border border-wine-900/15 text-wine-950 transition hover:bg-wine-900 hover:text-white xl:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {announcement && noticeVisible && (
        <div className="border-b border-gold-700/20 bg-gold-100/95 text-wine-950 backdrop-blur-sm">
          <div className="container-site flex min-h-9 items-center justify-between gap-4 py-1.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-800">
                Pengumuman
              </span>
              <span className="hidden h-3 w-px bg-wine-900/20 sm:block" />
              <p className="truncate text-[10px] font-semibold text-wine-950/75">
                <span className="font-extrabold text-wine-950">{announcement.title}</span>
                <span className="hidden sm:inline"> — {announcement.message}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNoticeVisible(false)}
              className="shrink-0 text-wine-900/50 transition hover:text-wine-950"
              aria-label="Tutup pengumuman"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          "fixed inset-0 z-[70] bg-wine-950 transition duration-300 xl:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[78px] items-center justify-between border-b border-white/10 px-5">
            <div className="flex items-center gap-3">
              <Crest className="h-10" />
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-gold-400">
                  Keuskupan Agung
                </p>
                <p className="font-display text-2xl font-semibold text-white">ROBLOX</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center border border-white/20 text-white"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-7">
            <div className="space-y-1">
              {nav.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenGroup((value) =>
                            value === item.href ? null : item.href,
                          )
                        }
                        className="flex w-full items-center justify-between border-b border-white/10 py-4 text-left font-display text-2xl text-white"
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gold-400 transition",
                            openGroup === item.href && "rotate-180",
                          )}
                        />
                      </button>
                      {openGroup === item.href && (
                        <div className="space-y-1 border-b border-white/10 py-3 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className="block py-2 text-[12px] font-semibold text-white/60"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between border-b border-white/10 py-4 font-display text-2xl text-white"
                    >
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 text-gold-400" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-8 flex items-center justify-center gap-2 bg-gold-400 px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-wine-950"
            >
              Panel Admin <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="mt-8 space-y-3 text-[11px] text-white/50">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gold-400" />
                {setting(settings, "phone")}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gold-400" />
                {setting(settings, "email")}
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 text-gold-400" />
                {setting(settings, "address")}, {setting(settings, "city")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
