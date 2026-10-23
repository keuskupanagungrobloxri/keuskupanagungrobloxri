"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Church,
  ClipboardList,
  GalleryHorizontalEnd,
  Gauge,
  Inbox,
  Layers,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  X,
} from "lucide-react";
import type { SafeUser } from "@/lib/types";
import { ROLE_META } from "@/lib/permissions";
import { cn, firstName, initials } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth";
import { FlashToast } from "./FlashToast";

type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  permission?: string;
  badge?: number;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const ICONS = {
  dashboard: Gauge,
  articles: BookOpen,
  pages: Layers,
  gallery: GalleryHorizontalEnd,
  events: CalendarDays,
  liturgy: Sparkles,
  parishes: Church,
  clergy: Users,
  announcements: ClipboardList,
  messages: Inbox,
  users: UserCog,
  roles: ShieldCheck,
  settings: Settings,
};

const NAV: NavGroup[] = [
  {
    label: "Utama",
    items: [
      {
        href: "/admin",
        label: "Dasbor",
        icon: "dashboard",
        permission: "dashboard.view",
      },
    ],
  },
  {
    label: "Konten",
    items: [
      {
        href: "/admin/berita",
        label: "Berita",
        icon: "articles",
        permission: "articles.view",
      },
      {
        href: "/admin/halaman",
        label: "Halaman",
        icon: "pages",
        permission: "pages.manage",
      },
      {
        href: "/admin/galeri",
        label: "Galeri",
        icon: "gallery",
        permission: "media.manage",
      },
    ],
  },
  {
    label: "Pelayanan",
    items: [
      {
        href: "/admin/agenda",
        label: "Agenda",
        icon: "events",
        permission: "events.manage",
      },
      {
        href: "/admin/liturgi",
        label: "Liturgi",
        icon: "liturgy",
        permission: "liturgy.manage",
      },
      {
        href: "/admin/paroki",
        label: "Paroki",
        icon: "parishes",
        permission: "parishes.manage",
      },
      {
        href: "/admin/klerus",
        label: "Klerus",
        icon: "clergy",
        permission: "clergy.manage",
      },
      {
        href: "/admin/pengumuman",
        label: "Pengumuman",
        icon: "announcements",
        permission: "announcements.manage",
      },
    ],
  },
  {
    label: "Interaksi",
    items: [
      {
        href: "/admin/pesan",
        label: "Pesan Umat",
        icon: "messages",
        permission: "messages.view",
      },
    ],
  },
  {
    label: "Administrasi",
    items: [
      {
        href: "/admin/pengguna",
        label: "Pengguna",
        icon: "users",
        permission: "users.view",
      },
      {
        href: "/admin/peran",
        label: "Matriks Peran",
        icon: "roles",
        permission: "roles.manage",
      },
      {
        href: "/admin/pengaturan",
        label: "Pengaturan",
        icon: "settings",
        permission: "settings.manage",
      },
      {
        href: "/admin/log",
        label: "Log Aktivitas",
        icon: "announcements",
        permission: "logs.view",
      },
    ],
  },
];

function allowed(item: NavItem, user: SafeUser) {
  if (!item.permission) return true;
  return user.role === "owner" || user.permissions.includes(item.permission);
}

export function AdminShell({
  user,
  newMessages,
  children,
}: {
  user: SafeUser;
  newMessages: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const groups = NAV.map((group) => ({
    ...group,
    items: group.items
      .filter((item) => allowed(item, user))
      .map((item) =>
        item.href === "/admin/pesan" ? { ...item, badge: newMessages } : item,
      ),
  })).filter((group) => group.items.length > 0);

  const role = ROLE_META[user.role];
  const current =
    groups.flatMap((group) => group.items).find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    ) || null;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <FlashToast />

      {open && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-wine-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col bg-wine-950 text-white transition duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-[74px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-gold-400/40 font-display text-lg text-gold-300">
              ✛
            </span>
            <span>
              <span className="block text-[7px] font-extrabold uppercase tracking-[0.22em] text-gold-400">
                Panel
              </span>
              <span className="block font-display text-lg font-semibold leading-tight">
                Keuskupan ROBLOX
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center text-white/60 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold-400/30 bg-white/5 font-display text-sm text-gold-300">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(user.name)
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-white">
                {user.name}
              </p>
              <p className="mt-0.5 truncate text-[8px] font-extrabold uppercase tracking-[0.12em] text-gold-400">
                {role.label}
              </p>
            </div>
          </div>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="px-3.5 pb-2 text-[7px] font-extrabold uppercase tracking-[0.24em] text-white/30">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = ICONS[item.icon];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "nav-admin",
                        isActive(item.href) && "nav-admin-active",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1.5 text-[9px] font-extrabold text-wine-950">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mb-2 mt-2 border-t border-white/10 pt-4">
            <p className="px-3.5 pb-2 text-[7px] font-extrabold uppercase tracking-[0.24em] text-white/30">
              Akun
            </p>
            <Link
              href="/admin/akun"
              className={cn("nav-admin", pathname === "/admin/akun" && "nav-admin-active")}
            >
              <UserCog className="h-4 w-4 shrink-0" />
              Akun Saya
            </Link>
            <Link href="/" className="nav-admin" target="_blank">
              <ArrowUpRight className="h-4 w-4 shrink-0" />
              Lihat Situs
            </Link>
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 border border-white/15 px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/60 transition hover:border-gold-400/50 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-md">
          <div className="flex h-[74px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-stone-300 text-wine-950 lg:hidden"
                aria-label="Buka menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[7px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                  Panel Administrasi
                </p>
                <h1 className="truncate font-display text-xl font-semibold leading-tight text-wine-950">
                  {current?.label ||
                    (pathname === "/admin/akun" ? "Akun Saya" : "Panel")}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 border border-stone-200 bg-cream px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-stone-500 md:flex">
                <span className={cn("h-1.5 w-1.5 rounded-full", user.active ? "bg-emerald-500" : "bg-stone-400")} />
                {role.short}
              </span>
              <Link
                href="/admin/akun"
                className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:border-gold-400"
              >
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-wine-900 font-display text-[10px] text-gold-200">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials(user.name)
                  )}
                </span>
                <span className="hidden text-[10px] font-bold text-wine-950 sm:block">
                  {firstName(user.name)}
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-8 lg:py-9">{children}</main>

        <footer className="border-t border-stone-200 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-stone-400">
            Keuskupan Agung ROBLOX · Panel Administrasi · Ut Unum Sint
          </p>
        </footer>
      </div>
    </div>
  );
}
