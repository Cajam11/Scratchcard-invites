'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import { useMemo, useState } from 'react'

const playfair = Playfair_Display({ subsets: ['latin'] })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const nextPath = useMemo(() => {
    const rawNext = searchParams.get('next')
    if (!rawNext || !rawNext.startsWith('/admin')) {
      return '/admin/teachers'
    }
    return rawNext
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()
      if (!response.ok) {
        setError(result.error || 'Prihlasenie zlyhalo')
        setLoading(false)
        return
      }

      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Chyba siete')
      setLoading(false)
    }
  }

  return (
    <main className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-4 py-12 text-neutral-200 ${cormorant.className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,166,97,0.25)_0%,_rgba(10,10,10,1)_58%)]" />

      <div className="relative w-full max-w-xl rounded-2xl border border-[#c4a661]/35 bg-[#121212]/95 p-8 shadow-2xl shadow-black/60 sm:p-10">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c4a661] to-transparent" />
        <div className="absolute bottom-4 left-4 h-10 w-10 border-b border-l border-[#c4a661]/50" />
        <div className="absolute bottom-4 right-4 h-10 w-10 border-b border-r border-[#c4a661]/50" />
        <div className="absolute left-4 top-4 h-10 w-10 border-l border-t border-[#c4a661]/50" />
        <div className="absolute right-4 top-4 h-10 w-10 border-r border-t border-[#c4a661]/50" />

        <div className="relative text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c4a661]/80">Administracia</p>
          <h1 className={`${playfair.className} mt-3 text-4xl text-white`}>Prihlasenie</h1>
          <p className="mt-2 text-sm text-[#c4a661]/75">Pokracujte do spravy pozvanok</p>
        </div>

        <form className="relative mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/80">
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
            <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/80">
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
            {loading ? 'Prihlasovanie...' : 'Prihlasit sa'}
          </button>
        </form>

        <div className="relative mt-6 text-center">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#c4a661]/70 transition hover:text-[#c4a661]">
            Spat na uvod
          </Link>
        </div>
      </div>
    </main>
  )
}
