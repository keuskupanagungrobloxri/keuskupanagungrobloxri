"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlashToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(() => searchParams.toString());

  // Keep the query string in sync with the browser location. Server-action
  // redirects can update the URL without re-rendering the persistent layout.
  useEffect(() => {
    setQuery(searchParams.toString());
  }, [searchParams]);

  useEffect(() => {
    const sync = () => {
      const current = window.location.search.replace(/^\?/, "");
      setQuery((previous) => (previous === current ? previous : current));
    };
    const timer = window.setInterval(sync, 400);
    window.addEventListener("popstate", sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const params = new URLSearchParams(query);
  const flash = params.get("flash");
  const error = params.get("error");
  const message = error || flash;

  if (!message) return null;

  const dismiss = () => {
    const next = new URLSearchParams(window.location.search);
    next.delete("flash");
    next.delete("error");
    const search = next.toString();
    setQuery(search);
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] w-[calc(100%-2.5rem)] max-w-sm">
      <div
        className={cn(
          "flex items-start gap-3 border bg-white p-4 shadow-[0_18px_45px_-20px_rgba(29,23,23,.45)]",
          error ? "border-rose-200" : "border-emerald-200",
        )}
        role="status"
      >
        {error ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        )}
        <p
          className={cn(
            "flex-1 text-[11px] font-medium leading-5",
            error ? "text-rose-700" : "text-emerald-800",
          )}
        >
          {message}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="text-stone-400 transition hover:text-stone-700"
          aria-label="Tutup notifikasi"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
