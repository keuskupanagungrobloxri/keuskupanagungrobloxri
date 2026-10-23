import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { EventCard, EventFeatureCard } from "@/components/site/EventCard";
import {
  getPastEvents,
  getSettings,
  getUpcomingEvents,
  setting,
} from "@/lib/content";
import { formatDateID } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agenda Keuskupan",
  description:
    "Jadwal kegiatan pastoral, liturgi, pembinaan iman, dan karya pelayanan Keuskupan Agung ROBLOX.",
};

export default function AgendaPage() {
  const events = getUpcomingEvents();
  const past = getPastEvents(4);
  const settings = getSettings();
  const featured = events[0];
  const rest = events.slice(1);

  const grouped = rest.reduce<Record<string, typeof rest>>((acc, event) => {
    const key = formatDateID(event.start_at, { month: "long", year: "numeric" });
    acc[key] = acc[key] ? [...acc[key], event] : [event];
    return acc;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="Agenda & Karya"
        title="Agenda Keuskupan"
        description="Ruang untuk bertemu, bertumbuh, dan melayani bersama. Ikuti kegiatan pastoral yang terbuka bagi seluruh umat."
        image="/images/community.jpg"
        breadcrumbs={[{ label: "Agenda" }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
            <div>
              {featured ? (
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow">Kegiatan terdekat</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-stone/60">
                      {events.length} agenda mendatang
                    </span>
                  </div>
                  <div className="mt-6">
                    <EventFeatureCard event={featured} />
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-wine-900/20 bg-paper px-6 py-20 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-gold-600" />
                  <h3 className="mt-4 font-display text-2xl text-wine-950">
                    Belum ada agenda mendatang
                  </h3>
                  <p className="mt-2 text-[12px] text-stone">
                    Silakan periksa kembali dalam beberapa waktu ke depan.
                  </p>
                </div>
              )}

              {rest.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-3 border-b border-wine-900/10 pb-4">
                    <CalendarCheck className="h-4 w-4 text-gold-600" />
                    <h2 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                      Agenda berikutnya
                    </h2>
                  </div>

                  {Object.entries(grouped).map(([month, items]) => (
                    <section key={month} className="mt-8">
                      <h3 className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-stone/60">
                        {month}
                      </h3>
                      <div className="mt-3 border-t border-wine-900/10">
                        {items.map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {past.length > 0 && (
                <div className="mt-14 border-t border-wine-900/10 pt-10">
                  <span className="eyebrow">Telah berlalu</span>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {past.map((event) => (
                      <Link
                        key={event.id}
                        href={`/agenda/${event.slug}`}
                        className="group flex gap-4 border border-wine-900/10 bg-paper p-4 transition hover:border-gold-400"
                      >
                        <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center border border-wine-900/15 bg-cream">
                          <span className="font-display text-xl font-semibold leading-none text-wine-900">
                            {formatDateID(event.start_at, { day: "2-digit" })}
                          </span>
                          <span className="mt-0.5 text-[7px] font-extrabold uppercase tracking-[0.1em] text-gold-700">
                            {formatDateID(event.start_at, { month: "short" })}
                          </span>
                        </div>
                        <div>
                          <h4 className="line-clamp-2 font-display text-lg font-semibold leading-tight text-wine-950 transition group-hover:text-wine-700">
                            {event.title}
                          </h4>
                          <p className="mt-1 flex items-center gap-1 text-[9px] text-stone">
                            <MapPin className="h-2.5 w-2.5 text-gold-600" />
                            {event.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="h-fit space-y-6 lg:sticky lg:top-40">
              <div className="border border-wine-900/10 bg-paper p-6">
                <CalendarDays className="h-5 w-5 text-gold-600" />
                <p className="mt-4 text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                  Informasi
                </p>
                <p className="mt-2 font-display text-xl font-semibold leading-tight text-wine-950">
                  Ikuti kegiatan keuskupan
                </p>
                <p className="mt-2 text-[11px] leading-6 text-stone">
                  Sebagian kegiatan memerlukan pendaftaran melalui sekretariat paroki
                  atau panitia. Pastikan Anda membaca detail setiap agenda.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-wine-800 transition hover:text-gold-700"
                >
                  Hubungi Sekretariat <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="bg-wine-950 p-6 text-white">
                <Sparkles className="h-5 w-5 text-gold-400" />
                <p className="mt-4 font-display text-xl italic leading-snug text-white/80">
                  “Marilah kita saling memperhatikan supaya kita saling mendorong dalam
                  kasih dan dalam pekerjaan baik.”
                </p>
                <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.16em] text-gold-400">
                  Ibrani 10:24
                </p>
              </div>

              <div className="border border-wine-900/10 bg-cream p-6">
                <Clock3 className="h-5 w-5 text-gold-600" />
                <p className="mt-4 text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                  Sekretariat
                </p>
                <p className="mt-2 text-[11px] leading-6 text-stone">
                  {setting(settings, "office_hours")}
                  <br />
                  {setting(settings, "phone")}
                  <br />
                  {setting(settings, "email")}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
