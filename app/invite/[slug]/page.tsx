"use client"

import { use } from 'react'
import React, { useState, useEffect } from 'react'
import ScratchCard from '@/app/components/ScratchCard'

// Elegant Oznamko fonts
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'] })
const cormorant = Cormorant_Garamond({ weight: ['400', '600', '700'], subsets: ['latin'], style: ['normal', 'italic'] })

async function getTeacher(slug: string) {
  const res = await fetch(`/api/teachers/${slug}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

async function verify(slug: string, userInput: string) {
  const res = await fetch('/api/verify', { method: 'POST', body: JSON.stringify({ slug, userInput }), headers: { 'Content-Type': 'application/json' } })
  const data = await res.json()
  return { ok: res.ok, data }
}

async function fetchNotice(slug: string, token: string) {
  const res = await fetch(`/api/notice/${slug}`, { headers: { Authorization: `Bearer ${token}` } })
  return res.json()
}

export default function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [template, setTemplate] = useState('')
  const [teacherName, setTeacherName] = useState('')
  const [userInput, setUserInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Unlocked details
  const [eventDetails, setEventDetails] = useState<any | null>(null)
  const [revealed, setRevealed] = useState(false)
  
  const [loading, setLoading] = useState(true)
  const [successStatus, setSuccessStatus] = useState(false)

  useEffect(() => {
    loadTeacher()
  }, [slug])

  const loadTeacher = async () => {
    try {
      const data = await getTeacher(slug)
      setTemplate(data.phrase_template || data.phrase_sentence || '')
      setTeacherName(data.name || '')
      setLoading(false)
    } catch (err) {
      setError('Nepodarilo sa načítať pozvánku. Uistite sa, že odkaz je správny.')
      setLoading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { ok, data } = await verify(slug, userInput)
    
    if (!ok || !data.success) {
      if (data.error) return setError(data.error)
      return setError('Nesprávne slovo. Skúste znova.')
    }
    
    // Fetch notice/details with the token
    const n = await fetchNotice(slug, data.token)
    if (n.success) {
      setSuccessStatus(true)
      setEventDetails(n.notice)
    }
  }

  if (loading) {
    return (
      <main className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#c4a661]/60 ${cormorant.className}`}>
        <p className="text-xl animate-pulse">Načítavam vašu pozvánku...</p>
      </main>
    )
  }

  // --- UNLOCKED / REVEALED STATE ---
  if (successStatus && eventDetails) {
    return (
      <main className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 ${cormorant.className}`}>
        <div className="relative w-full max-w-2xl overflow-hidden rounded-md border border-[#c4a661]/40 bg-[#121212] p-8 md:p-14 shadow-2xl shadow-[#c4a661]/10">
          
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c4a661]/60"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#c4a661]/60"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#c4a661]/60"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#c4a661]/60"></div>

          <div className="text-center relative z-10 mx-auto">
            <h2 className="text-[#c4a661] text-sm md:text-base tracking-[0.4em] uppercase mb-4">Srdečne Vás pozývame</h2>
            <h1 className={`${playfair.className} text-4xl md:text-5xl lg:text-6xl text-white mb-6`}>Naša Stužková</h1>
            <p className="text-xl text-neutral-300 italic mb-10">Vážený učiteľ/ka<br/><span className="text-2xl text-[#c4a661] mt-2 block">{teacherName}</span></p>

            <div className="mb-10 text-neutral-200">
               <p className="text-lg leading-relaxed">Prijmite naše pozvanie a oslávte s nami náš veľký deň, <br/>ktorý sa uskutoční:</p>
            </div>

            <div className="max-w-md mx-auto relative group">
              {!revealed ? (
                 <div className="relative">
                   <p className="absolute -top-6 w-full text-center text-xs text-[#c4a661]/70 uppercase tracking-widest z-10 pointer-events-none">Zotrite pre zobrazenie detailov</p>
                   <ScratchCard onReveal={() => setRevealed(true)} />
                 </div>
              ) : (
                <div className="animate-in fade-in zoom-in duration-700 bg-black/40 border border-[#c4a661]/20 p-8 rounded-lg backdrop-blur-sm">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">Dátum</p>
                      <p className="text-2xl text-[#c4a661]">{eventDetails.event_date || 'Doplníme'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">Čas</p>
                      <p className="text-2xl text-[#c4a661]">{eventDetails.event_time || 'Doplníme'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">Miesto</p>
                      <p className="text-xl text-white">{eventDetails.location || 'Doplníme'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 text-center text-sm text-[#c4a661]/50 tracking-widest">
              TEŠÍME SA NA VÁS
            </div>
          </div>
        </div>
      </main>
    )
  }

  // --- LOCKED STATE ---
  return (
    <main className={`min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 ${cormorant.className}`}>
      <div className="w-full max-w-xl border border-[#c4a661]/30 bg-[#121212] p-8 md:p-12 shadow-xl relative mt-8 md:mt-0">
        
        {/* Subtle gold line accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#c4a661] to-transparent"></div>

        <div className="text-center">
          <p className="text-[#c4a661] text-xs uppercase tracking-[0.3em] mb-2">Pre štart</p>
          <h1 className={`${playfair.className} text-3xl md:text-4xl text-white mb-6 font-semibold`}>Doplňte chýbajúce slovo</h1>
          
          <div className="w-12 h-[1px] bg-[#c4a661]/50 mx-auto mb-8"></div>
          
          {template ? (
            <div className="mb-10 text-xl md:text-2xl text-neutral-300 italic leading-relaxed">
              &quot;{template}&quot;
            </div>
          ) : null}
          
          <form className="mt-8 relative z-10" onSubmit={onSubmit}>
            <div className="max-w-xs mx-auto">
              <input
                type="text"
                autoComplete="off"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Zadajte slovo..."
                className="w-full bg-transparent border-b border-[#c4a661]/40 px-4 py-3 text-center text-xl text-[#c4a661] outline-none placeholder:text-neutral-600 focus:border-[#c4a661] transition"
              />
            </div>
            
            {error && <p className="mt-4 text-sm text-red-500 font-sans tracking-wide">{error}</p>}
            
            <button
              type="submit"
              className="mt-10 inline-flex items-center justify-center uppercase tracking-[0.2em] border border-[#c4a661] text-[#c4a661] px-8 py-3 text-sm hover:bg-[#c4a661] hover:text-black transition-colors duration-500"
            >
              Potvrdiť
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}