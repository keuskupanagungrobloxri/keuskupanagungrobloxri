"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Church, Clock3, MapPin } from "lucide-react";
import type { Mass } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

const DAYS = [
  "Semua",
  "Minggu",
  "Sabtu",
  "Senin–Jumat",
  "Jumat Pertama",
];

const DAY_LABEL: Record<string, string> = {
  "Senin–Jumat": "Harian",
  "Jumat Pertama": "Jumat Pertama",
};

export function LiturgyExplorer({ masses }: { masses: Mass[] }) {
  const [day, setDay] = useState("Semua");
  const [parish, setParish] = useState("Semua");

  const parishNames = useMemo(
    () =>
      Array.from(
        new Set(masses.map((mass) => mass.parish_name).filter(Boolean) as string[]),
      ),
    [masses],
  );

  const filtered = useMemo(
    () =>
      masses.filter((mass) => {
        const matchesDay = day === "Semua" || mass.day === day;
        const matchesParish = parish === "Semua" || mass.parish_name === parish;
        return matchesDay && matchesParish;
      }),
    [masses, day, parish],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Mass[]>();
    for (const mass of filtered) {
      const key = mass.parish_name || "Paroki";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(mass);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div>
      <div className="border border-wine-900/10 bg-paper p-6 md:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
              Filter hari
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DAYS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setDay(name)}
                  className={cn(
                    "border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition",
                    day === name
                      ? "border-wine-900 bg-wine-900 text-white"
                      : "border-wine-900/15 text-wine-900/60 hover:border-wine-900/40 hover:text-wine-900",
                  )}
                >
                  {DAY_LABEL[name] || name}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full xl:w-80">
            <label htmlFor="parish-filter" className="field-label">
              Pilih paroki
            </label>
            <select
              id="parish-filter"
              value={parish}
              onChange={(event) => setParish(event.target.value)}
              className="field-select"
            >
              <option value="Semua">Semua paroki</option>
              {parishNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 border-t border-wine-900/10 pt-4 text-[10px] font-bold uppercase tracking-[0.13em] text-stone">
          <CalendarDays className="h-4 w-4 text-gold-600" />
          {filtered.length} jadwal ditemukan
        </div>
      </div>

      {grouped.length ? (
        <div className="mt-8 space-y-6">
          {grouped.map(([parishName, items]) => (
            <div
              key={parishName}
              className="overflow-hidden border border-wine-900/10 bg-paper"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-wine-900/10 bg-cream/70 px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gold-700">
                    <Church className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-tight text-wine-950">
                    {parishName}
                  </h3>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone/60">
                  {items.length} jadwal
                </span>
              </div>
              <div className="divide-y divide-wine-900/8">
                {items.map((mass) => (
                  <div
                    key={mass.id}
                    className="grid grid-cols-[96px_76px_1fr] items-start gap-3 px-5 py-4 md:grid-cols-[120px_90px_1fr] md:px-6"
                  >
                    <span className="text-[11px] font-bold text-wine-950">
                      {mass.day}
                    </span>
                    <span className="flex items-center gap-1.5 font-display text-lg font-semibold leading-none text-wine-900">
                      <Clock3 className="h-3 w-3 text-gold-600" />
                      {formatTime(mass.time)}
                    </span>
                    <span className="text-[11px] leading-5 text-stone">
                      <span className="block font-semibold text-ink/75">
                        {mass.type}
                      </span>
                      {mass.location && (
                        <span className="flex items-center gap-1 text-[10px] text-stone/70">
                          <MapPin className="h-2.5 w-2.5 text-gold-600" />
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
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-wine-900/20 bg-paper px-6 py-20 text-center">
          <Clock3 className="mx-auto h-9 w-9 text-gold-600" />
          <h3 className="mt-4 font-display text-2xl text-wine-950">
            Jadwal tidak ditemukan
          </h3>
          <p className="mt-2 text-[12px] text-stone">
            Coba pilih hari atau paroki lain untuk melihat jadwal misa.
          </p>
        </div>
      )}
    </div>
  );
}
