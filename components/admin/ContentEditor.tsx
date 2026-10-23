"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Eye,
  Heading2,
  Italic,
  Link2,
  List,
  PencilLine,
  Quote,
} from "lucide-react";
import { Prose } from "@/components/site/Prose";
import { cn, readingTime } from "@/lib/utils";

export function ContentEditor({
  name = "content",
  defaultValue = "",
  label = "Isi konten",
  hint = "Gunakan **tebal**, *miring*, ## subjudul, > kutipan, dan - daftar. Pisahkan paragraf dengan baris kosong.",
  minHeight = "min-h-[420px]",
}: {
  name?: string;
  defaultValue?: string;
  label?: string;
  hint?: string;
  minHeight?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const ref = useRef<HTMLTextAreaElement>(null);

  const insert = (before: string, after = "") => {
    const textarea = ref.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || "teks";
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    });
  };

  const prefixLine = (prefix: string) => {
    const textarea = ref.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = `${value.slice(0, lineStart)}${prefix}${value.slice(lineStart)}`;
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={`editor-${name}`} className="admin-label mb-0">
          {label}
        </label>
        <div className="flex items-center gap-1 border border-stone-200 bg-stone-50 p-0.5">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] transition",
              tab === "write"
                ? "bg-white text-wine-900 shadow-sm"
                : "text-stone-400 hover:text-stone-700",
            )}
          >
            <PencilLine className="h-2.5 w-2.5" /> Tulis
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.1em] transition",
              tab === "preview"
                ? "bg-white text-wine-900 shadow-sm"
                : "text-stone-400 hover:text-stone-700",
            )}
          >
            <Eye className="h-2.5 w-2.5" /> Pratinjau
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <div className="border border-stone-300 bg-white">
          <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 bg-stone-50 px-2 py-1.5">
            {[
              {
                icon: Heading2,
                label: "Subjudul",
                action: () => prefixLine("## "),
              },
              { icon: Bold, label: "Tebal", action: () => insert("**", "**") },
              { icon: Italic, label: "Miring", action: () => insert("*", "*") },
              { icon: Quote, label: "Kutipan", action: () => prefixLine("> ") },
              { icon: List, label: "Daftar", action: () => prefixLine("- ") },
              {
                icon: Link2,
                label: "Tautan",
                action: () => insert("[", "](https://)"),
              },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                type="button"
                onClick={action}
                title={label}
                aria-label={label}
                className="flex h-7 w-7 items-center justify-center text-stone-500 transition hover:bg-white hover:text-wine-900"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
            <span className="ml-auto pr-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-stone-400">
              {words} kata · ±{readingTime(value || "a")} menit
            </span>
          </div>
          <textarea
            id={`editor-${name}`}
            ref={ref}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Tuliskan isi konten di sini..."
            className={cn(
              "editor-textarea block w-full resize-y border-0 bg-white px-4 py-4 text-ink outline-none placeholder:text-stone-300",
              minHeight,
            )}
          />
        </div>
      ) : (
        <div
          className={cn(
            "overflow-y-auto border border-stone-300 bg-white px-6 py-5",
            minHeight,
          )}
        >
          {value.trim() ? (
            <Prose content={value} />
          ) : (
            <p className="text-[12px] italic text-stone-400">
              Belum ada konten untuk dipratinjau.
            </p>
          )}
        </div>
      )}

      <p className="field-hint">{hint}</p>
      {tab === "preview" && (
        <input type="hidden" name={name} value={value} />
      )}
    </div>
  );
}
