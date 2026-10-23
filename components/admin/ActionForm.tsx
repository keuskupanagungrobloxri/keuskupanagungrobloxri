"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import type { ActionState } from "@/lib/actions/shared";
import { cn } from "@/lib/utils";

export function ActionForm({
  action,
  children,
  submitLabel = "Simpan Perubahan",
  cancelHref,
  className,
  footerNote,
  compact = false,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  cancelHref?: string;
  className?: string;
  footerNote?: string;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={className}>
      {children}

      {state.error && (
        <p className="mt-5 flex items-start gap-2 border-l-2 border-rose-500 bg-rose-50 px-4 py-3 text-[11px] font-medium leading-5 text-rose-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="mt-5 flex items-start gap-2 border-l-2 border-emerald-500 bg-emerald-50 px-4 py-3 text-[11px] font-medium leading-5 text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {state.success}
        </p>
      )}

      <div
        className={cn(
          "flex flex-col-reverse gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between",
          compact ? "mt-5" : "mt-7",
        )}
      >
        <p className="text-[9px] leading-4 text-stone-400">
          {footerNote || "Perubahan akan langsung tercatat di log aktivitas."}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {cancelHref && (
            <Link
              href={cancelHref}
              className="inline-flex items-center justify-center border border-stone-300 px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.13em] text-stone-600 transition hover:border-stone-400 hover:text-stone-900"
            >
              Batal
            </Link>
          )}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 bg-wine-900 px-6 py-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-wine-950 disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" /> {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
