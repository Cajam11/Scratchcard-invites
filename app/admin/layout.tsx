'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated by trying to access a protected resource
    // For now, we'll assume if they're on an admin page they need to be authenticated
    // This could be enhanced with a dedicated endpoint
    const checkAuth = async () => {
      // Simple check: if on /admin/login, don't require auth
      if (pathname === '/admin/login') {
        setAuthenticated(true)
        return
      }

      // For other admin pages, we could add more sophisticated auth checks
      // For now, assume authenticated if they have a token
      setAuthenticated(true)
    }

    checkAuth()
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-white">Načítavam...</div>
      </div>
    )
  }

  // Show login page without layout for /admin/login
  if (pathname === '/admin/login') {
    return children
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header Navigation */}
      <header className="border-b border-white/10 bg-slate-900/40 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/admin/teachers" className="text-xl font-bold text-white">
              Admin
            </Link>
            <nav className="flex gap-1">
              <Link
                href="/admin/teachers"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  pathname === '/admin/teachers'
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Učitelia
              </Link>
              <Link
                href="/admin/attempts"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  pathname === '/admin/attempts'
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Pokusy
              </Link>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Odhlásiť sa
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
    </div>
  )
}
