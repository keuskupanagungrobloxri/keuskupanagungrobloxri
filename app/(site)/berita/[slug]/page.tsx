import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  Quote,
  Tag,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import { Prose } from "@/components/site/Prose";
import { ArticleCard, ArticleRow } from "@/components/site/ArticleCard";
import {
  getArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
} from "@/lib/content";
import { formatDateID, initials, readingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Berita tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article, 3);
  const popular = [...getPublishedArticles()]
    .filter((item) => item.id !== article.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  return (
    <>
      <section className="grain relative overflow-hidden bg-wine-950 pb-20 pt-14 text-white md:pb-24 md:pt-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.cover_image || "/images/hero-church.jpg"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-950 via-wine-950/90 to-wine-950/50" />
        <div className="absolute inset-0 bg-cross-pattern" />
        <div className="container-site relative z-10">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
            <Link href="/" className="transition hover:text-gold-300">
              Beranda
            </Link>
            <span className="text-gold-500">/</span>
            <Link href="/berita" className="transition hover:text-gold-300">
              Berita
            </Link>
            <span className="text-gold-500">/</span>
            <span className="text-white/70">{article.category}</span>
          </nav>

          <span className="inline-flex bg-gold-400 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-wine-950">
            {article.category}
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.3rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
            {article.title}
          </h1>
          <p className="mt-6 max-w-3xl text-[13px] leading-7 text-white/60">
            {article.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">
            <span className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/30 bg-white/5 font-display text-xs text-gold-300">
                {initials(article.author_name || "Redaksi Keuskupan")}
              </span>
              {article.author_name || "Redaksi Keuskupan"}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-gold-400" />
              {formatDateID(article.published_at || article.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-gold-400" />
              {readingTime(article.content)} menit baca
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-gold-400" />
              {article.views.toLocaleString("id-ID")} dibaca
            </span>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <Link
            href="/berita"
            className="group inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-wine-800 transition hover:text-gold-700"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />
            Semua berita
          </Link>

          <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_310px] lg:gap-16">
            <article>
              <div className="border-y border-wine-900/10 py-8">
                <Prose content={article.content} />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-wine-900/10 pb-8">
                <span className="flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.13em] text-gold-700">
                  <Tag className="h-3.5 w-3.5" />
                  {article.category}
                </span>
                <Link
                  href={`/berita?kategori=${encodeURIComponent(article.category)}`}
                  className="text-[9px] font-bold uppercase tracking-[0.12em] text-wine-800 transition hover:text-gold-700"
                >
                  Lihat berita sejenis <ArrowRight className="ml-1 inline h-3 w-3" />
                </Link>
              </div>

              <div className="mt-8 flex flex-col gap-5 border border-wine-900/10 bg-cream p-6 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold-500/30 bg-paper font-display text-xl font-semibold text-wine-800">
                  {initials(article.author_name || "Redaksi Keuskupan")}
                </div>
                <div className="flex-1">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-gold-700">
                    Ditulis oleh
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-wine-950">
                    {article.author_name || "Redaksi Keuskupan"}
                  </h3>
                  <p className="mt-1 text-[11px] leading-5 text-stone">
                    Redaksi Warta Keuskupan Agung ROBLOX
                  </p>
                </div>
                <Link href="/kontak" className="btn-outline shrink-0">
                  Hubungi Redaksi
                </Link>
              </div>

              {related.length > 0 && (
                <div className="mt-14">
                  <span className="eyebrow">Bacaan terkait</span>
                  <h2 className="mt-4 font-display text-3xl font-medium text-wine-950">
                    Lanjutkan membaca.
                  </h2>
                  <div className="mt-7 grid gap-6 sm:grid-cols-3">
                    {related.map((item) => (
                      <ArticleCard key={item.id} article={item} />
                    ))}
                  </div>
                </div>
              )}
            </article>

            <aside className="h-fit space-y-6 lg:sticky lg:top-40">
              <div className="border border-wine-900/10 bg-paper p-6">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                  Paling dibaca
                </p>
                <div className="mt-2">
                  {popular.map((item) => (
                    <ArticleRow key={item.id} article={item} />
                  ))}
                </div>
              </div>

              <div className="bg-wine-950 p-6 text-white">
                <Quote className="h-6 w-6 text-gold-400" />
                <p className="mt-4 font-display text-xl italic leading-snug text-white/80">
                  “Sebab di mana dua atau tiga orang berkumpul dalam nama-Ku, di situ
                  Aku ada di tengah-tengah mereka.”
                </p>
                <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.16em] text-gold-400">
                  Matius 18:20
                </p>
              </div>

              <div className="border border-wine-900/10 bg-cream p-6">
                <UserRound className="h-5 w-5 text-gold-600" />
                <p className="mt-4 font-display text-xl font-semibold leading-tight text-wine-950">
                  Ikuti hidup keuskupan
                </p>
                <p className="mt-2 text-[11px] leading-5 text-stone">
                  Dapatkan kabar terbaru seputar kegiatan dan pelayanan keuskupan.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-wine-800 transition hover:text-gold-700"
                >
                  Kirim Pesan <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
