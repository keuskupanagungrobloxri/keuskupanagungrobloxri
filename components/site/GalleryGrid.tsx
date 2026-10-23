"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GalleryGrid({
  items,
  albums,
}: {
  items: GalleryItem[];
  albums: { album: string; total: number }[];
}) {
  const [album, setAlbum] = useState("Semua");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (album === "Semua" ? items : items.filter((item) => item.album === album)),
    [album, items],
  );

  const close = () => setActiveIndex(null);
  const previous = () =>
    setActiveIndex((index) =>
      index === null ? null : (index - 1 + filtered.length) % filtered.length,
    );
  const next = () =>
    setActiveIndex((index) =>
      index === null ? null : (index + 1) % filtered.length,
    );

  return (
    <div>
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        {["Semua", ...albums.map((item) => item.album)].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setAlbum(name)}
            className={cn(
              "whitespace-nowrap border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.13em] transition",
              album === name
                ? "border-wine-900 bg-wine-900 text-white"
                : "border-wine-900/15 text-wine-900/60 hover:border-wine-900/40 hover:text-wine-900",
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "group relative overflow-hidden bg-wine-950 text-left",
              index % 5 === 0 ? "sm:col-span-2 sm:row-span-2" : "",
            )}
          >
            <div
              className={cn(
                "overflow-hidden",
                index % 5 === 0 ? "aspect-[16/10] sm:aspect-square" : "aspect-[4/3]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-wine-950/85 via-wine-950/10 to-transparent opacity-80 transition group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-gold-300">
                {item.album}
              </span>
              <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-white">
                {item.title}
              </h3>
            </div>
            <span className="absolute right-4 top-4 flex h-9 w-9 translate-y-1 items-center justify-center border border-white/30 text-white opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      {activeIndex !== null && filtered[activeIndex] && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-wine-950/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={filtered[activeIndex].title}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-white/25 text-white transition hover:bg-white/10"
            aria-label="Tutup galeri"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              previous();
            }}
            className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center border border-white/25 text-white transition hover:bg-white/10 md:left-8"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            className="max-h-[88vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filtered[activeIndex].image}
              alt={filtered[activeIndex].title}
              className="mx-auto max-h-[74vh] w-auto max-w-full object-contain"
            />
            <div className="mx-auto mt-5 max-w-2xl text-center">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-400">
                {filtered[activeIndex].album}
              </p>
              <h3 className="mt-2 font-display text-2xl text-white">
                {filtered[activeIndex].title}
              </h3>
              {filtered[activeIndex].caption && (
                <p className="mt-2 text-[11px] leading-6 text-white/55">
                  {filtered[activeIndex].caption}
                </p>
              )}
              <p className="mt-3 text-[9px] font-semibold text-white/35">
                {activeIndex + 1} / {filtered.length}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center border border-white/25 text-white transition hover:bg-white/10 md:right-8"
            aria-label="Foto berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
