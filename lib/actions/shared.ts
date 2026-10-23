import { getDb } from "../db";
import { slugify } from "../utils";

export type ActionState = {
  error?: string;
  success?: string;
};

export const initialActionState: ActionState = {};

export function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function nullableText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

export function checked(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "1" || value === "true";
}

export function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export function uniqueSlug(
  table: string,
  raw: string,
  fallback: string,
  ignoreId?: string,
): string {
  const base = slugify(raw || fallback) || `item-${Date.now()}`;
  const db = getDb();
  let candidate = base;
  let counter = 2;
  while (true) {
    const row = ignoreId
      ? db
          .prepare(`SELECT id FROM ${table} WHERE slug = ? AND id != ?`)
          .get(candidate, ignoreId)
      : db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(candidate);
    if (!row) return candidate;
    candidate = `${base}-${counter}`;
    counter += 1;
  }
}

export function flashUrl(path: string, message: string, error = false) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${error ? "error" : "flash"}=${encodeURIComponent(message)}`;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
