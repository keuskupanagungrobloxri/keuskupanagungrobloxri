import Link from "next/link";
import { ArrowRight, Megaphone, Newspaper, Search } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ArticleCard, ArticleRow } from "@/components/site/ArticleCard";
import {
  getArticleCategories,
  getFeaturedArticles,
  getPublishedArticles,
  getSettings,
} from "@/lib/content";
import { setting } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita & Warta",
  description:
    "Warta hidup keuskupan: berita pastoral, liturgi, karya sosial, pendidikan iman, dan kesaksian umat Keuskupan Agung ROBLOX.",
};

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string }>;
}) {
  const { kategori, q } = await searchParams;
  const all = getPublishedArticles();
  const categories = getArticleCategories();
  const featured = getFeaturedArticles(1)[0] ?? all[0];
  const settings = getSettings();

  const activeCategory = kategori && kategori !== "Semua" ? kategori : null;
  const keyword = (q || "").trim().toLowerCase();

  const filtered = all.filter((article) => {
    const matchesCategory = !activeCategory || article.category === activeCategory;
    const matchesKeyword =
      !keyword ||
      [article.title, article.excerpt, article.category]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    return matchesCategory && matchesKeyword;
  });

  const showFeatured =
    !activeCategory && !keyword && Boolean(featured) && filtered.length > 0;

  return (
    <>
      <PageHero
        eyebrow="Warta Keuskupan"
        title="Berita & Warta"
        description="Kabar hidup dari tengah umat: pelayanan, perayaan iman, dan karya kasih yang bertumbuh di paroki-paroki Keuskupan Agung ROBLOX."
        image="/images/mass-congregation.jpg"
        breadcrumbs={[{ label: "Berita" }]}
      />

      <section className="section-pad">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
            <div>
              <div className="flex flex-col gap-5 border-b border-wine-900/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  <CategoryPill
                    label="Semua"
                    href="/berita"
                    active={!activeCategory}
                  />
                  {categories.map((category) => (
                    <CategoryPill
                      key={category.category}
                      label={`${category.category} (${category.total})`}
                      href={`/berita?kategori=${encodeURIComponent(category.category)}`}
                      active={activeCategory === category.category}
                    />
                  ))}
                </div>
                <form action="/berita" className="relative w-full lg:w-64">
                  <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold-600" />
                  <input
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="Cari berita..."
                    className="w-full border border-wine-900/15 bg-paper py-2.5 pl-10 pr-3 text-[11px] outline-none transition placeholder:text-stone/50 focus:border-gold-500"
                  />
                </form>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-stone">
                <Newspaper className="h-4 w-4 text-gold-600" />
                {filtered.length} berita
                {activeCategory ? ` · ${activeCategory}` : ""}
                {keyword ? ` · “${q}”` : ""}
              </div>

              {showFeatured && featured && (
                <div className="mt-8">
                  <ArticleCard
                    article={featured}
                    featured
                    className="lg:grid lg:grid-cols-[1.15fr_1fr] [&>a]:h-full [&>a]:aspect-auto lg:[&>a]:min-h-[340px]"
                  />
                </div>
              )}

              {filtered.length ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {filtered
                    .filter((article) =>
                      showFeatured && featured ? article.id !== featured.id : true,
                    )
                    .map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
              ) : (
                <div className="mt-8 border border-dashed border-wine-900/20 bg-paper px-6 py-20 text-center">
                  <Newspaper className="mx-auto h-9 w-9 text-gold-600" />
                  <h3 className="mt-4 font-display text-2xl text-wine-950">
                    Berita tidak ditemukan
                  </h3>
                  <p className="mt-2 text-[12px] text-stone">
                    Coba kata kunci atau kategori lain, atau kembali ke semua berita.
                  </p>
                  <Link href="/berita" className="btn-outline mt-6">
                    Semua Berita
                  </Link>
                </div>
              )}
            </div>

            <aside className="h-fit space-y-6 lg:sticky lg:top-40">
              <div className="border border-wine-900/10 bg-paper p-6">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                  Paling dibaca
                </p>
                <div className="mt-2">
                  {[...all]
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 4)
                    .map((article) => (
                      <ArticleRow key={article.id} article={article} />
                    ))}
                </div>
              </div>

              <div className="bg-wine-950 p-6 text-white">
                <Megaphone className="h-5 w-5 text-gold-400" />
                <p className="mt-4 font-display text-xl font-semibold leading-tight">
                  Punya kabar dari paroki?
                </p>
                <p className="mt-2 text-[11px] leading-5 text-white/55">
                  Kirimkan informasi kegiatan, kesaksian, atau karya pelayanan paroki
                  Anda kepada redaksi keuskupan.
                </p>
                <Link
                  href="/kontak"
                  className="mt-4 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-gold-300 transition hover:text-white"
                >
                  Hubungi Redaksi <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="border border-wine-900/10 bg-cream p-6">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-gold-700">
                  Kategori
                </p>
                <ul className="mt-4 space-y-2.5">
                  {categories.map((category) => (
                    <li key={category.category}>
                      <Link
                        href={`/berita?kategori=${encodeURIComponent(category.category)}`}
                        className="flex items-center justify-between text-[11px] font-semibold text-ink/65 transition hover:text-wine-900"
                      >
                        {category.category}
                        <span className="text-[9px] text-stone/50">
                          {category.total}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-wine-900/10 pt-4 text-[10px] leading-5 text-stone/70">
                  {setting(settings, "tagline")}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryPill({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`border px-3.5 py-2 text-[9px] font-extrabold uppercase tracking-[0.11em] transition ${
        active
          ? "border-wine-900 bg-wine-900 text-white"
          : "border-wine-900/15 text-wine-900/60 hover:border-wine-900/40 hover:text-wine-900"
      }`}
    >
      {label}
    </Link>
  );
}
