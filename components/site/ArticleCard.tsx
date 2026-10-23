import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDateID, readingTime } from "@/lib/utils";

export function ArticleCard({
  article,
  featured = false,
  className = "",
}: {
  article: Article;
  featured?: boolean;
  className?: string;
}) {
  return (
    <article
      className={`group relative flex flex-col border border-wine-900/10 bg-paper transition duration-500 hover:-translate-y-1 hover:shadow-soft ${className}`}
    >
      <Link
        href={`/berita/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-wine-950"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.cover_image || "/images/hero-church.jpg"}
          alt={article.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-950/45 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 bg-gold-400 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-wine-950">
          {article.category}
        </span>
        {featured && (
          <span className="absolute right-4 top-4 border border-white/40 bg-wine-950/55 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
            Utama
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.12em] text-stone">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3 text-gold-600" />
            {formatDateID(article.published_at || article.created_at, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3 w-3 text-gold-600" />
            {readingTime(article.content)} menit baca
          </span>
        </div>
        <h3 className="mt-4 font-display text-[1.65rem] font-semibold leading-[1.12] tracking-[-0.015em] text-wine-950 transition group-hover:text-wine-700">
          <Link href={`/berita/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-2 text-[12px] leading-6 text-stone">
          {article.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-wine-900/10 pt-5">
          <span className="text-[9px] font-semibold text-stone/70">
            {article.author_name || "Redaksi Keuskupan"}
          </span>
          <Link
            href={`/berita/${article.slug}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-wine-900/15 text-wine-800 transition group-hover:border-wine-900 group-hover:bg-wine-900 group-hover:text-white"
            aria-label={`Baca ${article.title}`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      href={`/berita/${article.slug}`}
      className="group flex gap-4 border-b border-wine-900/10 py-4 last:border-0"
    >
      <div className="h-20 w-24 shrink-0 overflow-hidden bg-wine-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.cover_image || "/images/hero-church.jpg"}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-gold-700">
          {article.category}
        </p>
        <h4 className="mt-1.5 line-clamp-2 font-display text-[1.08rem] font-semibold leading-snug text-wine-950 transition group-hover:text-wine-700">
          {article.title}
        </h4>
        <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-stone">
          {formatDateID(article.published_at || article.created_at, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}
