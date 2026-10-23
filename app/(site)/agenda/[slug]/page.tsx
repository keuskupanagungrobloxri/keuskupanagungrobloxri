import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose } from "@/components/site/Prose";
import { EventCard } from "@/components/site/EventCard";
import { getEventBySlug, getUpcomingEvents } from "@/lib/content";
import { formatDateID, formatDateTimeID } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return { title: "Agenda tidak ditemukan" };
  return { title: event.title, description: event.description };
}

export default async function AgendaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const related = getUpcomingEvents()
    .filter((item) => item.id !== event.id)
    .slice(0, 3);
  const isDone = event.status === "done";

  return (
    <>
      <PageHero
        eyebrow={event.category}
        title={event.title}
        description={formatDateTimeID(event.start_at)}
        image={event.image || "/images/cathedral-altar.jpg"}
        breadcrumbs={[
          { label: "Agenda", href: "/agenda" },
          { label: event.title },
        ]}
      />

      <section className="section-pad">
        <div className="container-site">
          <Link
            href="/agenda"
            className="group inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-wine-800 transition hover:text-gold-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
            Semua agenda
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_330px] lg:gap-16">
            <article>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-gold-400 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-wine-950">
                  {event.category}
                </span>
                <span
                  className={`border px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] ${
                    isDone
                      ? "border-stone-200 bg-stone-100 text-stone-600"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {isDone ? "Telah selesai" : "Akan datang"}
                </span>
              </div>

              <h1 className="mt-5 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-medium leading-[1.04] tracking-[-0.025em] text-wine-950">
                {event.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 border-y border-wine-900/10 py-5 text-[10px] font-bold uppercase tracking-[0.1em] text-stone">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold-600" />
                  {formatDateID(event.start_at, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-gold-600" />
                  {formatDateID(event.start_at, {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(".", ":")}{" "}
                  WIB
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold-600" />
                  {event.location}
                </span>
              </div>

              <div className="mt-8">
                <Prose content={event.description} />
              </div>

              <div className="mt-10 border border-wine-900/10 bg-cream p-6 md:p-7">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-700">
                  Rincian kegiatan
                </p>
                <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone/60">
                      Mulai
                    </dt>
                    <dd className="mt-1 text-[12px] font-semibold text-wine-950">
                      {formatDateTimeID(event.start_at)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone/60">
                      Selesai
                    </dt>
                    <dd className="mt-1 text-[12px] font-semibold text-wine-950">
                      {event.end_at ? formatDateTimeID(event.end_at) : "Menyesuaikan"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone/60">
                      Lokasi
                    </dt>
                    <dd className="mt-1 text-[12px] font-semibold text-wine-950">
                      {event.location}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone/60">
                      Kategori
                    </dt>
                    <dd className="mt-1 text-[12px] font-semibold text-wine-950">
                      {event.category}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex flex-col gap-4 border border-wine-900/10 bg-paper p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                  <div>
                    <p className="font-display text-xl font-semibold text-wine-950">
                      Ingin mengikuti kegiatan ini?
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-stone">
                      Hubungi sekretariat keuskupan atau paroki untuk informasi
                      pendaftaran dan kebutuhan kegiatan.
                    </p>
                  </div>
                </div>
                <Link href="/kontak" className="btn-primary shrink-0">
                  Hubungi Panitia
                </Link>
              </div>

              {related.length > 0 && (
                <div className="mt-14 border-t border-wine-900/10 pt-10">
                  <span className="eyebrow">Agenda lainnya</span>
                  <h2 className="mt-4 font-display text-3xl font-medium text-wine-950">
                    Ikuti kegiatan berikutnya.
                  </h2>
                  <div className="mt-4 border-t border-wine-900/10">
                    {related.map((item) => (
                      <EventCard key={item.id} event={item} />
                    ))}
                  </div>
                </div>
              )}
            </article>

            <aside className="h-fit space-y-6 lg:sticky lg:top-40">
              <div className="overflow-hidden border border-wine-900/10 bg-paper">
                <div className="relative aspect-[4/3] bg-wine-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image || "/images/cathedral-altar.jpg"}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-wine-950/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-gold-300">
                      {event.category}
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold leading-tight text-white">
                      {formatDateID(event.start_at, {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 p-5 text-[11px] leading-5 text-stone">
                  <p className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                    {formatDateTimeID(event.start_at)}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                    {event.location}
                  </p>
                  <p className="flex items-start gap-2">
                    <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
                    Terbuka bagi seluruh umat keuskupan
                  </p>
                </div>
              </div>

              <div className="bg-wine-950 p-6 text-white">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-gold-400">
                  Jangan lewatkan
                </p>
                <p className="mt-3 font-display text-xl font-semibold leading-tight">
                  Lihat jadwal misa & pelayanan sakramen.
                </p>
                <Link
                  href="/liturgi"
                  className="mt-4 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-gold-300 transition hover:text-white"
                >
                  Jadwal Liturgi <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
