import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Lihat semua",
  light = false,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end",
        align === "center"
          ? "text-center md:flex-col md:items-center"
          : "justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <span className={cn("eyebrow", light && "eyebrow-light")}>{eyebrow}</span>
        <h2
          className={cn(
            "section-title mt-4 text-balance",
            light && "text-white",
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "section-copy mt-4 max-w-xl",
              light && "text-white/55",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-3 border-b border-gold-500/50 pb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] transition hover:border-gold-500",
            light ? "text-gold-300 hover:text-white" : "text-wine-900 hover:text-gold-700",
          )}
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
