'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { Sora, Manrope } from 'next/font/google'
import html2canvas from 'html2canvas'
import ScratchCard from '@/app/components/ScratchCard'
import Aurora from '@/app/components/Aurora'

const sora = Sora({ subsets: ['latin'], weight: ['500', '600', '700'] })
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600'] })
const classStudents = [
  'A. Novak',
  'M. Kralova',
  'T. Benko',
  'L. Bielik',
  'S. Horvat',
  'N. Urban',
  'E. Juran',
  'P. Svec',
  'Z. Konecna',
  'V. Kollar',
]

type TeacherData = {
  phrase_template?: string | null
  phrase_sentence?: string | null
  name?: string | null
}

type VerifyData = {
  success?: boolean
  token?: string
  error?: string
}

type NoticeDetails = {
  event_date?: string | null
  event_time?: string | null
  location?: string | null
}

type NoticeData = {
  success?: boolean
  notice?: NoticeDetails
}

async function getTeacher(slug: string): Promise<TeacherData> {
  const res = await fetch(`/api/teachers/${slug}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

async function verify(slug: string, userInput: string) {
  const res = await fetch('/api/verify', {
    method: 'POST',
    body: JSON.stringify({ slug, userInput }),
    headers: { 'Content-Type': 'application/json' },
  })
  const data = (await res.json()) as VerifyData
  return { ok: res.ok, data }
}

async function fetchNotice(slug: string, token: string) {
  const res = await fetch(`/api/notice/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return (await res.json()) as NoticeData
}

function UserBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30">
        <Aurora
          colorStops={['#0e1b36', '#183764', '#26589a']}
          blend={0.65}
          amplitude={0.9}
          speed={0.38}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_0%,rgba(37,86,153,0.32)_0%,rgba(5,7,11,0.92)_55%,rgba(5,7,11,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_28%,rgba(32,85,155,0.18)_56%,rgba(255,255,255,0)_75%)]" />
    </>
  )
}

export default function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const invitationRef = useRef<HTMLDivElement | null>(null)
  const [template, setTemplate] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [userInput, setUserInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [eventDetails, setEventDetails] = useState<NoticeDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [successStatus, setSuccessStatus] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const loadTeacher = useCallback(async () => {
    try {
      const data = await getTeacher(slug)
      setTemplate(data.phrase_template || data.phrase_sentence || '')
      setTeacherName(data.name || '')
      setLoading(false)
    } catch {
      setError('Nepodarilo sa nacitat pozvanku. Skontrolujte, ci je odkaz spravny.')
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTeacher()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadTeacher])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDownloadError(null)

    const { ok, data } = await verify(slug, userInput)
    if (!ok || !data.success) {
      if (data.error) return setError(data.error)
      return setError('Nespravne slovo. Skuste znova.')
    }

    if (!data.token) {
      setError('Chyba overenia. Skuste to znova.')
      return
    }

    const noticeData = await fetchNotice(slug, data.token)
    if (noticeData.success && noticeData.notice) {
      setSuccessStatus(true)
      setEventDetails(noticeData.notice)
      return
    }

    setError('Nepodarilo sa nacitat detaily pozvanky.')
  }

  const handleDownloadInvite = async () => {
    const invitationNode = invitationRef.current
    if (!invitationNode) {
      setDownloadError('Pozvanku sa nepodarilo pripravit na stiahnutie.')
      return
    }

    setDownloading(true)
    setDownloadError(null)

    try {
      const canvas = await html2canvas(invitationNode, {
        backgroundColor: '#05070b',
        scale: Math.min(2, window.devicePixelRatio || 1),
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          const clonedRoot = clonedDoc.querySelector('[data-export-root="invite"]')
          if (!(clonedRoot instanceof HTMLElement)) return
          clonedRoot.style.boxShadow = 'none'
        },
        ignoreElements: (element) =>
          element instanceof HTMLElement &&
          (element.dataset.scratchOverlay === 'true' || element.dataset.downloadExclude === 'true'),
      })

      const safeName = (teacherName || slug)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `pozvanka-${safeName || 'stuzkova'}.png`
      link.click()
    } catch (downloadErr) {
      console.error('Download invite failed:', downloadErr)
      setDownloadError('Stiahnutie zlyhalo. Skuste to prosim znova.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <main className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] ${manrope.className}`}>
        <UserBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <p className="text-xl text-[#88a4cc] animate-pulse">Nacitavam vasu pozvanku...</p>
        </div>
      </main>
    )
  }

  if (successStatus && eventDetails) {
    return (
      <main className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] ${manrope.className}`}>
        <UserBackground />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div
            ref={invitationRef}
            data-export-root="invite"
            className="w-full overflow-hidden rounded-3xl border border-[rgba(46,95,168,0.58)] bg-[linear-gradient(120deg,#07101d_5%,#0c1b32_50%,#091624_100%)] p-6 shadow-[0_38px_110px_rgba(2,6,15,0.95)] lg:p-8"
          >
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.25fr_0.9fr]">
              <section className="rounded-2xl border border-[rgba(46,95,168,0.42)] bg-[rgba(6,12,22,0.78)] p-5">
                <p className="mb-3 text-[11px] uppercase tracking-[0.26em] text-[#88a4cc]">Trieda 4.B</p>
                <h2 className={`${sora.className} mb-4 text-2xl text-white`}>Ziaci triedy</h2>
                <div className="grid grid-cols-2 gap-2 text-sm text-[#d6e5fa]">
                  {classStudents.map((name) => (
                    <p key={name} className="rounded-md border border-[rgba(46,95,168,0.28)] bg-[#0a1830] px-2 py-1.5">
                      {name}
                    </p>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[rgba(46,95,168,0.42)] bg-[rgba(6,12,22,0.78)] p-5 lg:p-6">
                <p
                  data-download-exclude="true"
                  className="mb-3 text-center text-[11px] uppercase tracking-[0.24em] text-[#88a4cc]"
                >
                  Zotrite panel a odhalte detaily
                </p>
                <div className="rounded-2xl border border-[rgba(46,95,168,0.3)] bg-[#06101e] p-3">
                  <ScratchCard containerClassName="max-w-none" contentClassName="bg-[#050913]">
                    <div className="w-full rounded-2xl border border-[rgba(46,95,168,0.35)] bg-[#050913] px-6 py-7 sm:px-8">
                      <div className="grid gap-5 sm:grid-cols-3">
                        <div className="text-center">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#88a4cc]">Datum</p>
                          <p className={`${sora.className} mt-2 text-2xl text-[#9bc1ff]`}>
                            {eventDetails.event_date || 'Doplnime'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#88a4cc]">Cas</p>
                          <p className={`${sora.className} mt-2 text-2xl text-[#9bc1ff]`}>
                            {eventDetails.event_time || 'Doplnime'}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-[#88a4cc]">Miesto</p>
                          <p className={`${sora.className} mt-2 text-xl text-white`}>
                            {eventDetails.location || 'Doplnime'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScratchCard>
                </div>
              </section>

              <section className="rounded-2xl border border-[rgba(46,95,168,0.42)] bg-[rgba(6,12,22,0.78)] p-5 lg:p-6">
                <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#88a4cc]">Stuzkova pozvanka</p>
                <h1 className={`${sora.className} text-3xl text-white`}>Nasa Stuzkova</h1>
                <p className="mt-5 text-lg text-[#d9e3f2]">Vazeny ucitel/ka</p>
                <p className={`${sora.className} mt-1 text-2xl text-[#9bc1ff]`}>{teacherName}</p>

                <p className="mt-8 text-[16px] leading-8 text-[#d6e1f1]">
                  Srdecne Vas pozyvame na nasu stuzkovu. Tesime sa, ze budete sucastou nasho vecera.
                </p>

                <div className="mt-8 space-y-2">
                  <div className="rounded-xl border border-[rgba(46,95,168,0.32)] bg-[#08162a] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#88a4cc]">Rocnik</p>
                    <p className={`${sora.className} mt-1 text-sm text-white`}>2026</p>
                  </div>
                  <div className="rounded-xl border border-[rgba(46,95,168,0.32)] bg-[#08162a] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#88a4cc]">Trieda</p>
                    <p className={`${sora.className} mt-1 text-sm text-white`}>4.B</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleDownloadInvite}
              disabled={downloading}
              className="inline-flex items-center justify-center rounded-full border border-[#3f7ad1] bg-[#2f64b3] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e7f1ff] transition hover:bg-[#3a75cb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? 'Pripravujem PNG...' : 'Stiahnut pozvanku (PNG)'}
            </button>
            {downloadError && <p className="mt-3 text-sm text-red-400">{downloadError}</p>}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`relative isolate min-h-screen overflow-hidden bg-[#05070b] ${manrope.className}`}>
      <UserBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full overflow-hidden rounded-3xl border border-[rgba(46,95,168,0.54)] bg-[linear-gradient(115deg,#07101d_4%,#0c1b32_50%,#091624_100%)] p-8 shadow-[0_38px_110px_rgba(2,6,15,0.95)] sm:p-10">
          <div className="text-center">
            <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-[#88a4cc]">Overenie pozvanky</p>
            <h1 className={`${sora.className} text-3xl text-white sm:text-4xl`}>Doplnte chybajuce slovo</h1>
            <p className="mt-4 text-[#d6e1f1]">
              Pred odhalenim detailov pozvanky zadajte overovacie slovo do formulara.
            </p>

            {template ? (
              <p className="mt-8 rounded-xl border border-[rgba(46,95,168,0.36)] bg-[#08162a] px-4 py-4 text-lg italic leading-8 text-[#d6e1f1]">
                &quot;{template}&quot;
              </p>
            ) : null}

            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              <div className="mx-auto max-w-sm">
                <input
                  type="text"
                  autoComplete="off"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Zadajte slovo..."
                  className="w-full rounded-xl border border-[rgba(46,95,168,0.5)] bg-[#08162a] px-4 py-3 text-center text-lg text-[#dbe9ff] outline-none placeholder:text-[#6b85ac] focus:border-[#6ea1eb]"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                className="inline-flex rounded-full border border-[#3f7ad1] bg-[#2f64b3] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e7f1ff] transition hover:bg-[#3a75cb]"
              >
                Potvrdit
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
