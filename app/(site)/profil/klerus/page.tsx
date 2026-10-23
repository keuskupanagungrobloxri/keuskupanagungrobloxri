import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { getClergy, getParishes } from "@/lib/content";
import { initials } from "@/lib/utils";
import type { Metadata } from "next";
import type { Clergy } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Direktori Klerus",
  description:
    "Direktori uskup, imam, diakon, dan frater Keuskupan Agung ROBLOX beserta tugas pelayanan mereka.",
};

const profileNav = [
  { href: "/profil", label: "Profil Keuskupan" },
  { href: "/profil/uskup", label: "Uskup Agung" },
  { href: "/profil/klerus", label: "Direktori Klerus" },
  { href: "/halaman/sejarah", label: "Sejarah Keuskupan" },
  { href: "/halaman/visi-misi", label: "Visi & Misi" },
  { href: "/halaman/arah-dasar", label: "Arah Dasar 2026–2030" },
];

const RANK_ORDER = [
  "Uskup Agung",
  "Kardinal",
  "Nunsius",
  "Imam",
  "Diakon",
  "Frater",
];

const RANK_DESCRIPTION: Record<string, string> = {
  "Uskup Agung":
    "Gembala keuskupan yang memimpin pelayanan iman, liturgi, dan misi di tingkat lokal.",
  Kardinal:
    "Anggota Kolegium Kardinal yang mendampingi karya evangelisasi dan pelayanan universal.",
  Nunsius:
    "Perwakilan Takhta Suci yang menjembatani relasi gerejawi keuskupan dengan Roma.",
  Imam:
    "Imam yang melayani paroki, komisi, dan karya pastoral keuskupan sehari-hari.",
  Diakon:
    "Diakon yang mendampingi liturgi, karya diakonia, dan pelayanan kasih kepada umat.",
  Frater:
    "Frater yang sedang menjalani formasi menuju tahbisan imam.",
};

export default function KlerusPage() {
  const clergy = getClergy();
  const parishes = getParishes();
  const grouped = RANK_ORDER.map((rank) => ({
    rank,
    people: clergy.filter((person) => person.rank === rank),
  })).filter((group) => group.people.length > 0);

  const assignments = clergy.filter((person) => person.assignment).length;

  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title="Direktori Klerus"
        description="Mengenal para gembala dan pelayan yang mendampingi perjalanan iman umat Keuskupan Agung ROBLOX."
        image="/images/mass-procession.jpg"
        breadcrumbs={[
          { label: "Profil", href: "/profil" },
          { label: "Direktori Klerus" },
        ]}
      />

      <section className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <aside className="h-fit lg:sticky lg:top-40">
            <div className="border border-wine-900/10 bg-paper p-6">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                Profil & Dokumen
              </p>
              <nav className="mt-5 space-y-1">
                {profileNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between border-b border-wine-900/8 py-3 text-[11px] font-semibold transition hover:pl-1 hover:text-wine-900 last:border-0 ${
                      item.href === "/profil/klerus"
                        ? "text-wine-900"
                        : "text-ink/65"
                    }`}
                  >
                    {item.label}
                    <ArrowRight className="h-3.5 w-3.5 text-gold-600 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-5 border border-wine-900/10 bg-paper p-6">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                Ringkasan
              </p>
              <dl className="mt-4 space-y-3 text-[11px]">
                <div className="flex items-center justify-between border-b border-wine-900/8 pb-3">
                  <dt className="text-stone">Klerus terdaftar</dt>
                  <dd className="font-display text-xl font-semibold text-wine-950">
                    {clergy.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-b border-wine-900/8 pb-3">
                  <dt className="text-stone">Paroki aktif</dt>
                  <dd className="font-display text-xl font-semibold text-wine-950">
                    {parishes.length}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-stone">Penugasan</dt>
                  <dd className="font-display text-xl font-semibold text-wine-950">
                    {assignments}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 bg-wine-950 p-6 text-white">
              <BookOpen className="h-5 w-5 text-gold-400" />
              <p className="mt-4 font-display text-lg italic leading-snug text-white/80">
                “Tuaian memang banyak, tetapi pekerja sedikit.”
              </p>
              <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.16em] text-gold-400">
                Matius 9:37
              </p>
              <Link
                href="/halaman/arah-dasar"
                className="mt-5 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-gold-300 transition hover:text-white"
              >
                Arah Dasar Pastoral <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-wine-900/10 pb-8">
              <div>
                <span className="eyebrow">Pelayan Umat</span>
                <h2 className="mt-4 font-display text-4xl font-medium text-wine-950">
                  Satu tubuh, banyak pelayanan.
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-stone">
                <Users className="h-4 w-4 text-gold-600" />
                {clergy.length} klerus
              </div>
            </div>

            {grouped.map((group) => (
              <section key={group.rank} className="mt-12 first:mt-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gold-600" />
                      <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                        {group.rank}
                      </h3>
                    </div>
                    <p className="mt-2 max-w-xl text-[11px] leading-5 text-stone">
                      {RANK_DESCRIPTION[group.rank]}
                    </p>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-stone/60">
                    {group.people.length} orang
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {group.people.map((person) => (
                    <ClergyCard key={person.id} person={person} />
                  ))}
                </div>
              </section>
            ))}

            {clergy.length === 0 && (
              <div className="mt-10 border border-dashed border-wine-900/20 bg-paper px-6 py-20 text-center">
                <Users className="mx-auto h-9 w-9 text-gold-600" />
                <h3 className="mt-4 font-display text-2xl text-wine-950">
                  Data klerus belum tersedia
                </h3>
                <p className="mt-2 text-[12px] text-stone">
                  Silakan hubungi sekretariat keuskupan untuk informasi terbaru.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ClergyCard({ person }: { person: Clergy }) {
  return (
    <article className="group flex gap-5 border border-wine-900/10 bg-paper p-5 transition hover:border-gold-400 hover:shadow-soft">
      <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-wine-950">
        {person.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.image}
            alt={person.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-wine-900 to-wine-950 font-display text-2xl text-gold-300">
            {initials(person.name)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-gold-700">
          {person.title}
        </p>
        <h4 className="mt-1 font-display text-xl font-semibold leading-tight text-wine-950">
          {person.name}
        </h4>
        {person.assignment && (
          <p className="mt-1.5 flex items-start gap-1.5 text-[10px] leading-4 text-stone">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" />
            {person.assignment}
          </p>
        )}
        {person.bio && (
          <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-stone/80">
            {person.bio}
          </p>
        )}
        {person.email && (
          <a
            href={`mailto:${person.email}`}
            className="mt-2 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-wine-800 transition hover:text-gold-700"
          >
            <Mail className="h-3 w-3 text-gold-600" />
            Hubungi
          </a>
        )}
      </div>
    </article>
  );
}
