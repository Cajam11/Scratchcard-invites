'use client'

import { useEffect, useState } from 'react'

interface Attempt {
  id: string
  teacher_id: string
  teacher_name: string
  user_input: string
  success: boolean
  created_at: string
}

interface AttemptApiRow {
  id: string
  teacher_id: string
  user_input: string
  success: boolean
  created_at: string
  teachers?: {
    name?: string
  } | null
}

export default function AttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all')
  const [errorMessage, setErrorMessage] = useState('')

  const loadAttempts = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true)
        setErrorMessage('')
      }

      const res = await fetch('/api/admin/attempts')
      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Nepodarilo sa nacitat pokusy')
        return
      }

      const attemptsFromApi = (data.attempts || []) as AttemptApiRow[]
      setAttempts(
        attemptsFromApi.map((attempt) => ({
          ...attempt,
          teacher_name: attempt.teachers?.name || 'Neznamy',
        }))
      )
    } catch (err) {
      console.error(err)
      setErrorMessage('Problem so sietou')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAttempts(false)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const filteredAttempts = attempts.filter((attempt) => {
    if (filter === 'success') return attempt.success
    if (filter === 'failed') return !attempt.success
    return true
  })

  const totalSuccess = attempts.filter((attempt) => attempt.success).length
  const totalFailed = attempts.length - totalSuccess

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[#c4a661]/30 bg-[#121212]/95 p-6 shadow-lg shadow-black/50 sm:p-8">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#c4a661] to-transparent" />
        <p className="text-xs uppercase tracking-[0.35em] text-[#c4a661]/80">Overenie</p>
        <h1 className="mt-3 text-3xl text-white sm:text-4xl">Pokusy overenia</h1>
        <p className="mt-2 text-sm text-neutral-400">Prehlad o zadanych slovach a vysledkoch overenia</p>
      </section>

      <section className="rounded-2xl border border-[#c4a661]/25 bg-[#121212]/90 p-6 shadow-lg shadow-black/40 sm:p-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
              filter === 'all'
                ? 'border-[#c4a661] bg-[#c4a661] text-[#0a0a0a]'
                : 'border-[#c4a661]/40 text-[#c4a661] hover:border-[#c4a661] hover:bg-[#c4a661]/10'
            }`}
          >
            Vsetky ({attempts.length})
          </button>
          <button
            onClick={() => setFilter('success')}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
              filter === 'success'
                ? 'border-emerald-400 bg-emerald-400 text-[#04140c]'
                : 'border-emerald-400/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            Uspesne ({totalSuccess})
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
              filter === 'failed'
                ? 'border-red-400 bg-red-400 text-[#1d0707]'
                : 'border-red-400/40 text-red-300 hover:border-red-400 hover:bg-red-500/10'
            }`}
          >
            Neuspesne ({totalFailed})
          </button>
        </div>

        {loading ? (
          <p className="text-[#c4a661]">Nacitavam pokusy...</p>
        ) : errorMessage ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : filteredAttempts.length === 0 ? (
          <p className="text-neutral-400">Ziadne zaznamy pre aktualny filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-[#c4a661]/30 text-[#c4a661]">
                <tr>
                  <th className="pb-3 font-medium">Ucitel</th>
                  <th className="pb-3 font-medium">Zadany text</th>
                  <th className="pb-3 font-medium">Vysledok</th>
                  <th className="pb-3 font-medium">Cas</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b border-[#c4a661]/10 hover:bg-white/5">
                    <td className="py-3 text-white">{attempt.teacher_name}</td>
                    <td className="py-3 text-neutral-400">{attempt.user_input || '-'}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] ${
                          attempt.success
                            ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300'
                            : 'border-red-400/50 bg-red-500/10 text-red-300'
                        }`}
                      >
                        {attempt.success ? 'Uspesne' : 'Neuspesne'}
                      </span>
                    </td>
                    <td className="py-3 text-neutral-500">
                      {new Date(attempt.created_at).toLocaleDateString('sk-SK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
