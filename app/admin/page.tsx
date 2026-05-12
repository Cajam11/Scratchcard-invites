'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to teachers page by default
    router.push('/admin/teachers')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-400">Presmerovávam...</p>
    </div>
  )
}
