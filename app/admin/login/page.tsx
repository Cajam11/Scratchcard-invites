import React, { Suspense } from "react";
import Link from "next/link";
import { Cormorant_Garamond, Playfair_Display } from "next/font/google";
import LoginForm from "./LoginForm";

const playfair = Playfair_Display({ subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

export default function AdminLoginPage() {
  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-12 text-neutral-200 ${cormorant.className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,166,97,0.25)_0%,_rgba(10,10,10,1)_58%)]" />

      <div className="relative w-full max-w-xl rounded-2xl border border-[#c4a661]/35 bg-[#121212]/95 p-8 shadow-2xl shadow-black/60 sm:p-10">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c4a661] to-transparent" />
        <div className="absolute bottom-4 left-4 h-10 w-10 border-b border-l border-[#c4a661]/50" />
        <div className="absolute bottom-4 right-4 h-10 w-10 border-b border-r border-[#c4a661]/50" />
        <div className="absolute left-4 top-4 h-10 w-10 border-l border-t border-[#c4a661]/50" />
        <div className="absolute right-4 top-4 h-10 w-10 border-r border-t border-[#c4a661]/50" />

        <div className="relative text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c4a661]/80">
            Administracia
          </p>
          <h1 className={`${playfair.className} mt-3 text-4xl text-white`}>
            Prihlasenie
          </h1>
          <p className="mt-2 text-sm text-[#c4a661]/75">
            Pokracujte do spravy pozvanok
          </p>
        </div>

        <Suspense fallback={<div className="relative mt-8">Načítavam...</div>}>
          <LoginForm />
        </Suspense>

        <div className="relative mt-6 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.2em] text-[#c4a661]/70 transition hover:text-[#c4a661]"
          >
            Spat na uvod
          </Link>
        </div>
      </div>
    </main>
  );
}
