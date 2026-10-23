import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Crest } from "./Crest";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image = "/images/hero-church.jpg",
  breadcrumbs = [],
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  breadcrumbs?: { label: string; href?: string }[];
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "grain relative overflow-hidden bg-wine-950 text-white",
        compact ? "pb-16 pt-16 md:pb-20 md:pt-20" : "pb-24 pt-20 md:pb-32 md:pt-28",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-wine-950 via-wine-950/85 to-wine-950/40" />
      <div className="absolute inset-0 bg-cross-pattern" />
      <Crest className="absolute -bottom-16 right-[5%] hidden h-[300px] w-auto opacity-[0.06] lg:block" />
      <div className="container-site relative z-10">
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
          <Link href="/" className="transition hover:text-gold-300">
            Beranda
          </Link>
          {breadcrumbs.map((crumb) => (
            <span key={crumb.label} className="flex items-center gap-2">
              <ChevronRight className="h-3 w-3 text-gold-500" />
              {crumb.href ? (
                <Link href={crumb.href} className="transition hover:text-gold-300">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/70">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <span className="eyebrow eyebrow-light">{eyebrow}</span>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.03em] text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-[13px] leading-7 text-white/60 md:text-sm">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
