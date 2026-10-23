"use client";

import { useId, useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

export function ImageField({
  name,
  label = "Gambar",
  defaultValue = "",
  hint = "Unggah gambar JPG, PNG, WEBP, atau GIF (maks. 8 MB), atau tempel URL gambar.",
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Gagal mengunggah gambar.");
      }
      setValue(data.url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Gagal mengunggah gambar.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label htmlFor={`${id}-url`} className="admin-label">
        {label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative h-[92px] w-full shrink-0 overflow-hidden border border-stone-200 bg-stone-50 sm:w-[136px]">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Pratinjau gambar"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setValue("")}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-wine-950/70 text-white transition hover:bg-wine-950"
                aria-label="Hapus gambar"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-stone-400">
              <ImageIcon className="h-5 w-5" />
              <span className="text-[8px] font-bold uppercase tracking-[0.12em]">
                Tanpa gambar
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            id={`${id}-url`}
            type="text"
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="/images/foto.jpg atau https://..."
            className="admin-input"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 border border-stone-300 bg-white px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-stone-600 transition hover:border-gold-500 hover:text-wine-900 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Upload className="h-3 w-3" />
              )}
              {uploading ? "Mengunggah..." : "Unggah gambar"}
            </button>
            <span className="text-[9px] leading-4 text-stone-400">{hint}</span>
          </div>
          {error && (
            <p className="mt-2 text-[10px] font-medium text-rose-600">{error}</p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
    </div>
  );
}
