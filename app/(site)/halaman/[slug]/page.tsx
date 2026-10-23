import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose } from "@/components/site/Prose";
import { getPageBySlug, getPages, getSettings } from "@/lib/content";
import { formatDateID } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return { title: "Halaman tidak ditemukan" };
  return { title: page.title, description: page.subtitle };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();

  const settings = getSettings();
  const pages = getPages().filter((item) => item.slug !== page.slug);

  return (
    <>
      <PageHero
        eyebrow="Dokumen Keuskupan"
        title={page.title}
        description={page.subtitle}
        image="/images/church-classic.jpg"
        breadcrumbs={[
          { label: "Profil", href: "/profil" },
          { label: page.title },
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
                {[
                  { href: "/profil", label: "Profil Keuskupan" },
                  { href: "/profil/uskup", label: "Uskup Agung" },
                  { href: "/profil/klerus", label: "Direktori Klerus" },
                  ...getPages().map((item) => ({
                    href: `/halaman/${item.slug}`,
                    label: item.title,
                  })),
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between border-b border-wine-900/8 py-3 text-[11px] font-semibold transition hover:pl-1 hover:text-wine-900 last:border-0 ${
                      item.href === `/halaman/${page.slug}`
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

            <div className="mt-5 bg-wine-950 p-6 text-white">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-gold-400">
                Motto Keuskupan
              </p>
              <p className="mt-4 font-display text-xl italic leading-snug text-white/80">
                “{settings.motto_id}”
              </p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.16em] text-gold-400">
                {settings.motto_reference}
              </p>
            </div>
          </aside>

          <article>
            <div className="mb-8 flex flex-wrap items-center gap-5 border-b border-wine-900/10 pb-6 text-[9px] font-bold uppercase tracking-[0.12em] text-stone">
              <span className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-gold-600" />
                Dokumen Resmi
              </span>
              <span className="h-3 w-px bg-wine-900/15" />
              <span>
                Diperbarui{" "}
                {formatDateID(page.updated_at, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <Prose content={page.content} />

            {pages.length > 0 && (
              <div className="mt-16 border-t border-wine-900/10 pt-10">
                <span className="eyebrow">Dokumen lainnya</span>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {pages.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      href={`/halaman/${item.slug}`}
                      className="group border border-wine-900/10 bg-paper p-5 transition hover:border-gold-400"
                    >
                      <h3 className="font-display text-xl font-semibold text-wine-950 transition group-hover:text-wine-700">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-stone">
                        {item.subtitle}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.13em] text-wine-800">
                        Baca dokumen <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
