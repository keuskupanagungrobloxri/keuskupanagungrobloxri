"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfirmSubmitButton({
  children,
  message = "Tindakan ini tidak dapat dibatalkan. Lanjutkan?",
  className,
  title,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="submit"
      title={title}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-stone-400 transition hover:text-rose-600",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DeleteButton({
  message = "Data ini akan dihapus permanen. Lanjutkan?",
  label = "Hapus",
}: {
  message?: string;
  label?: string;
}) {
  return (
    <ConfirmSubmitButton message={message}>
      <Trash2 className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only">{label}</span>
    </ConfirmSubmitButton>
  );
}
