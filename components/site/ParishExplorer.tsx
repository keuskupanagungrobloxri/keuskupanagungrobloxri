"use client";

import { useMemo, useState } from "react";
import { Church, Search } from "lucide-react";
import type { Parish } from "@/lib/types";
import { ParishCard } from "./ParishCard";
import { cn } from "@/lib/utils";

export function ParishExplorer({ parishes }: { parishes: Parish[] }) {
  const [query, setQuery] = useState("");
  const [vicariate, setVicariate] = useState("Semua");

  const vicariates = useMemo(
    () => ["Semua", ...Array.from(new Set(parishes.map((parish) => parish.vicariate)))],
    [parishes],
  );

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return parishes.filter((parish) => {
      const matchesVicariate =
        vicariate === "Semua" || parish.vicariate === vicariate;
      const matchesQuery =
        !needle ||
        [parish.name, parish.city, parish.address, parish.pastor_name, parish.patron]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(needle));
      return matchesVicariate && matchesQuery;
    });
  }, [parishes, query, vicariate]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 border-b border-wine-900/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {vicariates.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setVicariate(name)}
              className={cn(
                "border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] transition",
                vicariate === name
                  ? "border-wine-900 bg-wine-900 text-white"
                  : "border-wine-900/15 text-wine-900/60 hover:border-wine-900/40 hover:text-wine-900",
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <label className="relative block w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari paroki, kota, atau pastor..."
            className="w-full border border-wine-900/15 bg-paper py-3.5 pl-11 pr-4 text-[12px] outline-none transition placeholder:text-stone/50 focus:border-gold-500"
          />
        </label>
      </div>

      <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-stone">
        <Church className="h-4 w-4 text-gold-600" />
        {filtered.length} paroki ditemukan
      </div>

      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((parish) => (
            <ParishCard key={parish.id} parish={parish} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-wine-900/20 bg-paper px-6 py-20 text-center">
          <Church className="mx-auto h-9 w-9 text-gold-600" />
          <h3 className="mt-4 font-display text-2xl text-wine-950">
            Paroki tidak ditemukan
          </h3>
          <p className="mt-2 text-[12px] text-stone">
            Coba gunakan kata kunci lain atau pilih kevikepan yang berbeda.
          </p>
        </div>
      )}
    </div>
  );
}
