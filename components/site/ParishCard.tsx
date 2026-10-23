import Link from "next/link";
import { ArrowRight, Church, MapPin, UserRound } from "lucide-react";
import type { Parish } from "@/lib/types";

export function ParishCard({ parish }: { parish: Parish }) {
  return (
    <Link
      href={`/paroki/${parish.slug}`}
      className="group flex flex-col overflow-hidden border border-wine-900/10 bg-paper transition duration-500 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-wine-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={parish.image || "/images/cathedral-exterior.jpg"}
          alt={parish.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-950/70 via-wine-950/5 to-transparent" />
        <span className="absolute left-4 top-4 bg-paper/95 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.13em] text-wine-900">
          {parish.vicariate}
        </span>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="font-display text-lg italic text-white/80">{parish.city}</span>
          <span className="flex h-8 w-8 items-center justify-center border border-white/30 bg-wine-950/40 text-white backdrop-blur transition group-hover:bg-gold-400 group-hover:text-wine-950">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.01em] text-wine-950 transition group-hover:text-wine-700">
          {parish.name}
        </h3>
        <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-gold-700">
          Pelindung: {parish.patron}
        </p>
        <div className="mt-4 space-y-2.5 text-[11px] leading-5 text-stone">
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            <span>
              {parish.address}, {parish.city}
            </span>
          </p>
          <p className="flex items-start gap-2">
            <UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
            {parish.pastor_name || "Pastor paroki"}
          </p>
        </div>
        <div className="mt-auto flex items-center gap-2 border-t border-wine-900/10 pt-4 text-[9px] font-extrabold uppercase tracking-[0.12em] text-wine-800">
          <Church className="h-3.5 w-3.5 text-gold-600" />
          Lihat profil paroki
        </div>
      </div>
    </Link>
  );
}
