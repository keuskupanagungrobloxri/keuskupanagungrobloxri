"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { sendMessageAction } from "@/lib/actions/contact";
import type { ActionState } from "@/lib/actions/shared";

const initialState: ActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 bg-wine-900 px-7 py-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-wine-950 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
        </>
      ) : (
        <>
          Kirim Pesan <Send className="h-3.5 w-3.5" />
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, action] = useActionState(sendMessageAction, initialState);

  if (state.success) {
    return (
      <div className="border border-emerald-200 bg-emerald-50/70 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-4 font-display text-2xl text-wine-950">
          Pesan Anda telah diterima
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-stone">
          {state.success}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Nama lengkap
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Nama Anda"
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            Alamat email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="nama@email.com"
            className="field-input"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="field-label">
            Nomor telepon <span className="normal-case tracking-normal">(opsional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="0812-xxxx-xxxx"
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="field-label">
            Subjek
          </label>
          <select id="contact-subject" name="subject" required className="field-select">
            <option value="">Pilih subjek pesan</option>
            <option>Informasi umum</option>
            <option>Pelayanan sakramen</option>
            <option>Permohonan doa</option>
            <option>Pendaftaran kegiatan</option>
            <option>Karya sosial & bantuan</option>
            <option>Media & publikasi</option>
            <option>Lainnya</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          Pesan
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={20}
          rows={6}
          placeholder="Tuliskan pesan, pertanyaan, atau permohonan Anda dengan jelas..."
          className="field-textarea"
        />
      </div>
      {state.error && (
        <p className="border-l-2 border-red-500 bg-red-50 px-4 py-3 text-[11px] font-medium text-red-700">
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-[10px] leading-5 text-stone/70">
          Data Anda hanya digunakan untuk menindaklanjuti pesan dan tidak dibagikan
          kepada pihak ketiga.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
