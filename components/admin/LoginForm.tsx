"use client";

import { useActionState, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { loginAction } from "@/lib/actions/auth";

const DEMO_ACCOUNTS = [
  { role: "Holder", email: "owner@keuskupanroblox.org", password: "Holder#2026" },
  { role: "Pengurus", email: "pengurus@keuskupanroblox.org", password: "Pengurus#2026" },
  { role: "Uskup", email: "uskup@keuskupanroblox.org", password: "Uskup#2026" },
  { role: "Kardinal", email: "kardinal@keuskupanroblox.org", password: "Kardinal#2026" },
  { role: "Nunsius", email: "nunsius@keuskupanroblox.org", password: "Nunsius#2026" },
  { role: "Imam", email: "imam@keuskupanroblox.org", password: "Imam#2026" },
  { role: "Diakon", email: "diakon@keuskupanroblox.org", password: "Diakon#2026" },
  { role: "Frater", email: "frater@keuskupanroblox.org", password: "Frater#2026" },
  { role: "Umat", email: "umat@keuskupanroblox.org", password: "Umat#2026" },
];

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div>
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="returnTo" value={returnTo || "/admin"} />
        <div>
          <label htmlFor="login-email" className="field-label">
            Alamat email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600" />
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@keuskupanroblox.org"
              className="field-input pl-11"
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="field-label">
            Kata sandi
          </label>
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-600" />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="field-input pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-stone-400 transition hover:text-wine-900"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {state.error && (
          <p className="flex items-start gap-2 border-l-2 border-rose-500 bg-rose-50 px-4 py-3 text-[11px] font-medium leading-5 text-rose-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="group flex w-full items-center justify-center gap-2 bg-wine-900 px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white transition hover:bg-wine-950 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi...
            </>
          ) : (
            <>
              Masuk ke Panel
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-7 border-t border-wine-900/10 pt-5">
        <button
          type="button"
          onClick={() => setDemoOpen((value) => !value)}
          className="flex w-full items-center justify-between text-left text-[9px] font-extrabold uppercase tracking-[0.14em] text-wine-800/70 transition hover:text-wine-900"
        >
          Akun demo & peran
          <span className="text-[8px] font-bold text-stone-400">
            {demoOpen ? "Tutup" : "Tampilkan"}
          </span>
        </button>
        {demoOpen && (
          <div className="mt-4 grid max-h-56 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                className="border border-wine-900/10 bg-cream/60 px-3 py-2 text-left transition hover:border-gold-500 hover:bg-gold-50"
              >
                <span className="block text-[8px] font-extrabold uppercase tracking-[0.12em] text-gold-700">
                  {account.role}
                </span>
                <span className="mt-0.5 block truncate text-[9px] font-medium text-ink/60">
                  {account.email}
                </span>
              </button>
            ))}
          </div>
        )}
        <p className="mt-3 text-[9px] leading-4 text-stone-400">
          Klik salah satu akun untuk mengisi formulir secara otomatis.
        </p>
      </div>
    </div>
  );
}
