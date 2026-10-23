import type { SettingsMap } from "./types";

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function setting(
  settings: SettingsMap,
  key: string,
  fallback = "",
): string {
  return settings[key] || fallback;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);
}

export function formatDateID(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    ...options,
  }).format(date);
}

export function formatDateTimeID(value: string | null | undefined) {
  return formatDateID(value, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(".", ":");
}

export function formatTime(value: string) {
  if (!value) return "—";
  return value.replace(":", ".");
}

export function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (number: number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatNumber(value: number | string) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export function firstName(name: string) {
  return (
    name
      .replace(/^(Mgr\.|RD\.|Dn\.|Fr\.|Dr\.|Rp\.|Br\.|Sr\.|Kardinal)\s+/i, "")
      .split(" ")
      .filter(Boolean)[0] || name
  );
}

export function initials(name: string) {
  return name
    .replace(/^(Mgr\.|RD\.|Dn\.|Fr\.|Dr\.|Kardinal)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function excerpt(value: string, length = 150) {
  const clean = value.replace(/[#>*_`-]/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trimEnd()}…`;
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

export function timeAgo(value: string) {
  const date = new Date(value).getTime();
  const seconds = Math.max(1, Math.floor((Date.now() - date) / 1000));
  if (seconds < 60) return "baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDateID(value, { day: "numeric", month: "short", year: "numeric" });
}

export function normalizeDateTimeInput(value: string) {
  if (!value) return null;
  if (value.includes("+") || value.endsWith("Z")) return value;
  return `${value}:00+07:00`;
}

export function isoNow() {
  return new Date().toISOString();
}

export function safeReturnTo(value: string | undefined, fallback = "/admin") {
  if (!value) return fallback;
  if (!value.startsWith("/admin")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}

export const STATUS_LABEL: Record<string, string> = {
  published: "Terbit",
  draft: "Draf",
  archived: "Arsip",
  upcoming: "Akan datang",
  ongoing: "Berlangsung",
  done: "Selesai",
  active: "Aktif",
  inactive: "Nonaktif",
  emeritus: "Emeritus",
  new: "Baru",
  read: "Dibaca",
  replied: "Dibalas",
};

export const STATUS_TONE: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-stone-100 text-stone-600 border-stone-200",
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
  done: "bg-stone-100 text-stone-600 border-stone-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-stone-100 text-stone-600 border-stone-200",
  emeritus: "bg-amber-50 text-amber-700 border-amber-200",
  new: "bg-rose-50 text-rose-700 border-rose-200",
  read: "bg-blue-50 text-blue-700 border-blue-200",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
