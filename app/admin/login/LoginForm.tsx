"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = useMemo(() => {
    const rawNext = searchParams.get("next");
    if (!rawNext || !rawNext.startsWith("/admin")) {
      return "/admin/teachers";
    }
    return rawNext;
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Prihlasenie zlyhalo");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Chyba siete");
      setLoading(false);
    }
  };

  return (
    <form className="relative mt-8 space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/80"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="mt-2 w-full rounded-xl border border-[#c4a661]/25 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-500 transition focus:border-[#c4a661]"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/80"
        >
          Heslo
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-2 w-full rounded-xl border border-[#c4a661]/25 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-500 transition focus:border-[#c4a661]"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full border border-[#c4a661] bg-[#c4a661] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#0a0a0a] transition hover:bg-[#d6b56a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Prihlasovanie..." : "Prihlasit sa"}
      </button>
    </form>
  );
}
