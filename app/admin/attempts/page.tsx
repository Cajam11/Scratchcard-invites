'use client'

import { useState, useEffect } from 'react'

interface Attempt {
  id: string
  teacher_id: string
  teacher_name: string
  user_input: string
  success: boolean
  created_at: string
}

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')

  useEffect(() => {
    loadAttempts()
  }, [filter])

  const loadAttempts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/attempts')
      const data = await res.json()
      if (res.ok) {
        setAttempts(data.attempts.map((a: any) => ({ ...a, teacher_name: a.teachers?.name || 'Neznamy' })))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAttempts = attempts.filter((a) => {
    if (filter === 'success') return a.success
    if (filter === 'failed') return !a.success
    return true
  })

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#c4a661]">Pokusy overenia</h1>
        <p className="mt-2 text-slate-400">Zobrazte vsetky pokusy o overenie ucitelov</p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-[#c4a661]/20 text-[#c4a661]'
              : 'border border-white/10 text-slate-400 hover:text-slate-300'
          }`}
        >
          Vsetky ({attempts.length})
        </button>
        <button
          onClick={() => setFilter('success')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === 'success'
              ? 'bg-green-400/20 text-green-300'
              : 'border border-white/10 text-slate-400 hover:text-slate-300'
          }`}
        >
          Uspesne ({attempts.filter((a) => a.success).length})
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === 'failed'
              ? 'bg-red-400/20 text-red-300'
              : 'border border-white/10 text-slate-400 hover:text-slate-300'
          }`}
        >
          Neuspesne ({attempts.filter((a) => !a.success).length})
        </button>
      </div>

      {/* Attempts Table */}
      <div className="rounded-2xl border border-white/10 bg-[#121212]/80 p-8 backdrop-blur">
        {loading ? (
          <p className="text-slate-400">Nacitavam...</p>
        ) : filteredAttempts.length === 0 ? (
          <p className="text-slate-400">Ziadne pokusy.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#c4a661]/30 text-[#c4a661]">
                <tr>
                  <th className="pb-3">Ucitel</th>
                  <th className="pb-3">Zadany text</th>
                  <th className="pb-3">Vysledok</th>
                  <th className="pb-3">Cas</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 text-white">{attempt.teacher_name}</td>
                    <td className="py-3 text-slate-400">{attempt.user_input || '-'}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          attempt.success
                            ? 'bg-green-400/20 text-green-300'
                            : 'bg-red-400/20 text-red-300'
                        }`}
                      >
                        {attempt.success ? '✓ Uspesne' : '✗ Neuspesne'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(attempt.created_at).toLocaleDateString('sk-SK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}