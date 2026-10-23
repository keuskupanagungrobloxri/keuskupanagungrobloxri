import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { STATUS_LABEL, STATUS_TONE, cn } from "@/lib/utils";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-gold-700">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-[2.15rem] font-semibold leading-none tracking-[-0.02em] text-wine-950">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[12px] leading-6 text-stone-500">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  tone = "wine",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  href?: string;
  tone?: "wine" | "gold" | "green" | "blue" | "rose";
}) {
  const tones = {
    wine: "bg-wine-50 text-wine-800",
    gold: "bg-gold-50 text-gold-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    rose: "bg-rose-50 text-rose-700",
  };

  const body = (
    <div className="admin-card group relative flex h-full flex-col p-5 transition hover:border-gold-400 hover:shadow-[0_18px_40px_-28px_rgba(29,23,23,.55)]">
      <div className="flex items-start justify-between gap-3">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-sm", tones[tone])}>
          {icon}
        </span>
        {href && (
          <ArrowUpRight className="h-3.5 w-3.5 text-stone-300 transition group-hover:text-gold-600" />
        )}
      </div>
      <p className="mt-4 font-display text-[2.2rem] font-semibold leading-none text-wine-950">
        {value}
      </p>
      <p className="mt-1.5 text-[8px] font-extrabold uppercase tracking-[0.15em] text-stone-500">
        {label}
      </p>
      {hint && <p className="mt-2 text-[10px] leading-4 text-stone-400">{hint}</p>}
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("admin-card overflow-hidden", className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-200 px-5 py-4">
          <div>
            {title && (
              <h2 className="font-display text-lg font-semibold leading-tight text-wine-950">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-[10px] leading-4 text-stone-400">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("badge", STATUS_TONE[status] || STATUS_TONE.inactive)}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border border-dashed border-stone-300 bg-stone-50/50 px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold-600 shadow-sm">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold text-wine-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-stone-500">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SearchBox({
  action,
  defaultValue,
  placeholder = "Cari...",
  hidden,
}: {
  action: string;
  defaultValue?: string;
  placeholder?: string;
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form action={action} className="flex w-full gap-2 sm:w-auto">
      {hidden &&
        Object.entries(hidden).map(([key, value]) =>
          value ? <input key={key} type="hidden" name={key} value={value} /> : null,
        )}
      <label className="relative flex-1 sm:w-64">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="admin-input pl-9"
        />
      </label>
      <button
        type="submit"
        className="shrink-0 border border-stone-300 bg-white px-4 text-[9px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900"
      >
        Cari
      </button>
    </form>
  );
}

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 bg-wine-900 px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-wine-950"
    >
      {children}
    </Link>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-stone-100 py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-stone-400">
        {label}
      </dt>
      <dd className="text-right text-[11px] font-semibold text-stone-700">{value}</dd>
    </div>
  );
}
