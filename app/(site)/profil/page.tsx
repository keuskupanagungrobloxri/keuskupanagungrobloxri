import Link from "next/link";
import { ArrowRight, Cross, HeartHandshake, Landmark, Users } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Prose } from "@/components/site/Prose";
import { getClergy, getPageBySlug, getParishes, getSettings } from "@/lib/content";
import { initials } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil Keuskupan",
};

const profileNav = [
  { href: "/profil", label: "Profil Keuskupan" },
  { href: "/profil/uskup", label: "Uskup Agung" },
  { href: "/profil/klerus", label: "Direktori Klerus" },
  { href: "/halaman/sejarah", label: "Sejarah Keuskupan" },
  { href: "/halaman/visi-misi", label: "Visi & Misi" },
  { href: "/halaman/arah-dasar", label: "Arah Dasar 2026–2030" },
];

export default function ProfilPage() {
  const settings = getSettings();
  const page = getPageBySlug("profil");
  const clergy = getClergy();
  const parishes = getParishes();
  const leaders = clergy.filter((person) =>
    ["Uskup Agung", "Kardinal", "Nunsius", "Imam"].includes(person.rank),
  ).slice(0, 5);

  const values = [
    {
      icon: Users,
      title: "Persekutuan",
      text: "Bertumbuh sebagai satu keluarga Allah yang saling mendengarkan dan menguatkan.",
    },
    {
      icon: Cross,
      title: "Perayaan",
      text: "Menghidupi liturgi sebagai sumber dan puncak seluruh kehidupan beriman.",
    },
    {
      icon: HeartHandshake,
      title: "Pelayanan",
      text: "Menghadirkan belas kasih Kristus melalui karya diakonia dan kepedulian nyata.",
    },
    {
      icon: Landmark,
      title: "Pewartaan",
      text: "Mewartakan Injil dengan bahasa yang baru di tengah keluarga, karya, dan dunia digital.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Tentang Kami"
        title={page?.title || "Profil Keuskupan Agung ROBLOX"}
        description={page?.subtitle}
        image="/images/cathedral-exterior.jpg"
        breadcrumbs={[{ label: "Profil" }]}
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
                    className="group flex items-center justify-between border-b border-wine-900/8 py-3 text-[11px] font-semibold text-ink/65 transition hover:pl-1 hover:text-wine-900 last:border-0"
                  >
                    {item.label}
                    <ArrowRight className="h-3.5 w-3.5 text-gold-600 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-5 bg-wine-950 p-6 text-white">
              <CrestMini />
              <p className="mt-4 font-display text-xl italic leading-snug text-white/80">
                “{settings.motto_id}”
              </p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.16em] text-gold-400">
                {settings.motto_reference}
              </p>
            </div>
          </aside>

          <div>
            <Prose content={page?.content || ""} />

            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {values.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="border border-wine-900/10 bg-paper p-6 transition hover:border-gold-400"
                >
                  <Icon className="h-5 w-5 text-gold-600" />
                  <h3 className="mt-4 font-display text-2xl font-semibold text-wine-950">
                    {title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-6 text-stone">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-wine-900/10 pt-10" id="struktur">
              <span className="eyebrow">Kepemimpinan</span>
              <h2 className="mt-4 font-display text-4xl font-medium text-wine-950">
                Mereka yang melayani.
              </h2>
              <div className="mt-8 divide-y divide-wine-900/10 border-y border-wine-900/10">
                {leaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-gold-50 font-display text-lg font-semibold text-wine-800">
                      {initials(leader.name)}
                    </div>
                    <div className="flex-1">
                      <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-gold-700">
                        {leader.rank}
                      </p>
                      <h3 className="mt-0.5 font-display text-xl font-semibold text-wine-950">
                        {leader.name}
                      </h3>
                      <p className="text-[11px] text-stone">
                        {leader.assignment || leader.title}
                      </p>
                    </div>
                    <Link
                      href="/profil/klerus"
                      className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-wine-800 transition hover:text-gold-700"
                    >
                      Lihat profil
                    </Link>
                  </div>
                ))}
              </div>
              <Link href="/profil/klerus" className="btn-outline mt-7 group">
                Direktori Klerus
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-14 grid gap-6 bg-cream p-7 sm:grid-cols-3 md:p-9">
              <div>
                <p className="font-display text-4xl font-semibold text-wine-950">
                  {parishes.length}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-stone">
                  Paroki aktif
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold text-wine-950">
                  {clergy.length}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-stone">
                  Klerus terdaftar
                </p>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold text-wine-950">
                  {settings.stat_faithful}
                </p>
                <p className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.15em] text-stone">
                  Umat terlayani
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CrestMini() {
  return (
    <div className="flex h-10 w-10 rotate-45 items-center justify-center border border-gold-400/40">
      <span className="-rotate-45 font-display text-2xl text-gold-400">✛</span>
    </div>
  );
}
