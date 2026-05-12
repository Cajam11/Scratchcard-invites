'use client'

import { useState, useEffect } from 'react'
import HiddenWordEditor from '@/app/admin/components/HiddenWordEditor'

interface Teacher {
  id: string
  name: string
  slug: string
  phrase_template: string
  phrase_sentence: string
  hidden_word: string
  event_date: string | null
  event_time: string | null
  location: string | null
  created_at: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sentence: '',
    hidden_word: '',
    event_date: '',
    event_time: '',
    location: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  
  // NEW: State for live preview
  const [previewTeacher, setPreviewTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/teachers')
      const data = await res.json()
      if (res.ok) setTeachers(data.teachers || [])
    } catch (err) {
      console.error(err)
      setMessage('Chyba pri nacitavani ucitelov')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')
    setQrUrl('')

    try {
      const response = await fetch('/api/admin/teachers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (!response.ok) {
        setMessage(`Chyba: ${result.error}`)
        return
      }

      setMessage(`Ucitel "${result.teacher.name}" bol uspesne vytvoreny!`)
      setQrUrl(result.qrDataUrl)
      setFormData({
        name: '',
        sentence: '',
        hidden_word: '',
        event_date: '',
        event_time: '',
        location: '',
      })

      await loadTeachers()
    } catch (err) {
      setMessage('Chyba siete')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#c4a661]">Ucitelia</h1>
        <p className="mt-2 text-slate-400">Spravujte ucitelov a ich pozvanky</p>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl border border-[#c4a661] bg-[#121212] px-6 py-3 font-semibold text-[#c4a661] transition hover:bg-[#c4a661] hover:text-black"
        >
          {showForm ? 'Zrusit' : '+ Pridat ucitela'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-2xl border border-[#c4a661]/40 bg-[#121212] p-8 shadow-xl">
          <h2 className="mb-6 text-xl font-semibold text-white">Pridat noveho ucitela</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">Meno</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Meno Priezvisko"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-4 py-2 text-white placeholder:text-slate-500 outline-none focus:border-[#c4a661]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Datum stuzkovej</label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-4 py-2 text-white outline-none focus:border-[#c4a661]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Cas</label>
                <input
                  type="time"
                  value={formData.event_time}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-4 py-2 text-white outline-none focus:border-[#c4a661]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Miesto</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Miestnost, sala"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-4 py-2 text-white placeholder:text-slate-500 outline-none focus:border-[#c4a661]"
                />
              </div>
            </div>

            <HiddenWordEditor
              sentence={formData.sentence}
              hiddenWord={formData.hidden_word}
              onSentenceChange={(sentence) => setFormData({ ...formData, sentence })}
              onHiddenWordChange={(hidden_word) => setFormData({ ...formData, hidden_word })}
            />

            <button
              type="submit"
              disabled={submitting || !formData.hidden_word || !formData.sentence}
              className="w-full rounded-lg bg-[#c4a661] py-3 tracking-widest uppercase font-semibold text-black transition hover:bg-[#a68a4d] disabled:opacity-50"
            >
              {submitting ? 'Vytvaram...' : 'Vytvorit ucitela'}
            </button>

            {message && (
              <div
                className={`rounded-lg border p-3 ${
                  message.startsWith('Chyba')
                    ? 'border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border-green-500/30 bg-green-500/10 text-green-400'
                }`}
              >
                {message}
              </div>
            )}

            {qrUrl && (
              <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
                <p className="mb-3 text-sm font-medium text-amber-300">QR kod pozvanky:</p>
                <img src={qrUrl} alt="QR code" className="h-48 w-48 rounded-lg bg-white p-2" />
              </div>
            )}
          </form>
        </div>
      )}

      {previewTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="relative w-full max-w-2xl border border-[#c4a661]/40 bg-[#121212] p-8 md:p-14 shadow-2xl">
             <button onClick={() => setPreviewTeacher(null)} className="absolute top-4 right-4 text-[#c4a661] hover:text-white">XZavriet</button>
             <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#c4a661]/60"></div>
             <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#c4a661]/60"></div>
             <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#c4a661]/60"></div>
             <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#c4a661]/60"></div>

             <div className="text-center relative z-10 mx-auto">
                <h2 className="text-[#c4a661] text-sm tracking-[0.4em] uppercase mb-4">Srdecne Vas pozyvame (Nahl'ad)</h2>
                <h1 className="text-4xl text-white mb-6">Nasa Stuzkova</h1>
                <p className="text-xl text-neutral-300 italic mb-10">Vazeny ucitel/ka<br/><span className="text-2xl text-[#c4a661] mt-2 block">{previewTeacher.name}</span></p>

                <div className="animate-in fade-in zoom-in duration-700 bg-black/40 border border-[#c4a661]/20 p-8 rounded-lg backdrop-blur-sm max-w-md mx-auto">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">Datum</p>
                      <p className="text-2xl text-[#c4a661]">{previewTeacher.event_date || 'Doplnime'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">Cas</p>
                      <p className="text-2xl text-[#c4a661]">{previewTeacher.event_time || 'Doplnime'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1">Miesto</p>
                      <p className="text-xl text-white">{previewTeacher.location || 'Doplnime'}</p>
                    </div>
                  </div>
                </div>
            </div>
           </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-[#c4a661]/20 bg-[#121212]/80 p-8 shadow-lg">
        {loading ? (
          <p className="text-[#c4a661]">Nacitavam...</p>
        ) : teachers.length === 0 ? (
          <p className="text-slate-400">Zatial neboli vytvoreni ziadni ucitelia.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#c4a661]/30 text-[#c4a661]">
                <tr>
                  <th className="pb-3">Meno</th>
                  <th className="pb-3">Veta (oznamko)</th>
                  <th className="pb-3">Skryte slovo</th>
                  <th className="pb-3">Datum pridania</th>
                  <th className="pb-3">Akcia</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 text-white font-medium">{teacher.name}</td>
                    <td className="py-3 text-slate-400 truncate max-w-xs">{teacher.phrase_sentence}</td>
                    <td className="py-3 text-[#c4a661] font-mono">{teacher.hidden_word}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(teacher.created_at).toLocaleDateString('sk-SK')}
                    </td>
                    <td className="py-3">
                      <button 
                        onClick={() => setPreviewTeacher(teacher)}
                        className="text-xs uppercase tracking-widest text-[#c4a661] border border-[#c4a661] px-2 py-1 hover:bg-[#c4a661] hover:text-black transition"
                      >
                        Nahlad
                      </button>
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