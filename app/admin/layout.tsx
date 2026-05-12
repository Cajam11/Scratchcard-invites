'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Cormorant_Garamond, Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

const navItems = [
  { href: '/admin/teachers', label: 'Ucitelia' },
  { href: '/admin/attempts', label: 'Pokusy' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  if (isLoginPage) {
    return children
  }

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-neutral-200 ${cormorant.className}`}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,166,97,0.2)_0%,_rgba(10,10,10,1)_55%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
        <header className="relative mb-8 overflow-hidden rounded-2xl border border-[#c4a661]/30 bg-[#121212]/95 p-5 shadow-xl shadow-black/50 backdrop-blur sm:p-6">
          <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c4a661] to-transparent" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[#c4a661]/80">Administracia</p>
              <Link href="/admin/teachers" className={`${playfair.className} inline-block text-3xl text-white`}>
                Sprava pozvanok
              </Link>
              <nav className="flex flex-wrap gap-2 pt-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${
                        isActive
                          ? 'border-[#c4a661] bg-[#c4a661] text-[#0a0a0a]'
                          : 'border-[#c4a661]/40 text-[#c4a661] hover:border-[#c4a661] hover:bg-[#c4a661]/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#c4a661]/40 px-5 text-xs uppercase tracking-[0.2em] text-[#c4a661] transition hover:border-[#c4a661] hover:bg-[#c4a661]/10"
            >
              Odhlasit sa
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
