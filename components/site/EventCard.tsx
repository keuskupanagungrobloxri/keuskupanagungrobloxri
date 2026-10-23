import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import type { EventItem } from "@/lib/types";
import { formatDateID, formatDateTimeID } from "@/lib/utils";

export function EventCard({ event }: { event: EventItem }) {
  const date = new Date(event.start_at);
  const day = formatDateID(event.start_at, { day: "2-digit" });
  const month = formatDateID(event.start_at, { month: "short" });
  const time = formatDateID(event.start_at, {
    hour: "2-digit",
    minute: "2-digit",
  }).replace(".", ":");

  return (
    <Link
      href={`/agenda/${event.slug}`}
      className="group grid grid-cols-[72px_1fr] gap-5 border-b border-wine-900/10 py-5 last:border-0"
    >
      <div className="flex h-[76px] flex-col items-center justify-center border border-wine-900/15 bg-paper transition group-hover:border-gold-500 group-hover:bg-gold-50">
        <span className="font-display text-[2.1rem] font-semibold leading-none text-wine-900">
          {day}
        </span>
        <span className="mt-0.5 text-[8px] font-extrabold uppercase tracking-[0.16em] text-gold-700">
          {month} {date.getFullYear()}
        </span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-gold-700">
            {event.category}
          </span>
          <span className="h-1 w-1 rounded-full bg-gold-500" />
          <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-stone/70">
            {time} WIB
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-display text-[1.35rem] font-semibold leading-tight text-wine-950 transition group-hover:text-wine-700">
          {event.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-stone">
          <MapPin className="h-3 w-3 shrink-0 text-gold-600" />
          <span className="truncate">{event.location}</span>
        </p>
      </div>
    </Link>
  );
}

export function EventFeatureCard({ event }: { event: EventItem }) {
  return (
    <Link
      href={`/agenda/${event.slug}`}
      className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden bg-wine-950 p-7 text-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.image || "/images/cathedral-altar.jpg"}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-50"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-wine-950 via-wine-950/40 to-transparent" />
      <div className="relative">
        <span className="inline-flex bg-gold-400 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-wine-950">
          {event.category}
        </span>
        <h3 className="mt-4 font-display text-3xl font-semibold leading-tight">
          {event.title}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/70">
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3 w-3 text-gold-400" />
            {formatDateTimeID(event.start_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-gold-400" />
            {event.location}
          </span>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-gold-300">
          Detail agenda <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
