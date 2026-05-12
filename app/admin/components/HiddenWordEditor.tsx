'use client'

import { splitSentenceWords } from '@/lib/phrase'

type Props = {
  sentence: string
  hiddenWord: string
  onSentenceChange: (value: string) => void
  onHiddenWordChange: (value: string) => void
}

export default function HiddenWordEditor({
  sentence,
  hiddenWord,
  onSentenceChange,
  onHiddenWordChange,
}: Props) {
  const words = splitSentenceWords(sentence)
  const preview = sentence || 'Sem napíšte vetu a potom kliknite slovo, ktoré má byť skryté.'
  const escapedHiddenWord = hiddenWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const previewParts = hiddenWord
    ? sentence.split(new RegExp(`(${escapedHiddenWord})`, 'i'))
    : [sentence]

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/50 p-5">
      <div>
        <label className="block text-sm font-medium text-slate-300">Celá veta</label>
        <textarea
          value={sentence}
          onChange={(e) => {
            onSentenceChange(e.target.value)
            if (hiddenWord && !e.target.value.toLowerCase().includes(hiddenWord.toLowerCase())) {
              onHiddenWordChange('')
            }
          }}
          rows={3}
          placeholder="Napr.: Ja počkám, ja mám času dosť."
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-amber-300"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium text-slate-300">Klikni na slovo, ktoré sa skryje</label>
          {hiddenWord && <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">Skryté: {hiddenWord}</span>}
        </div>
        <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-3">
          {words.length === 0 ? (
            <p className="text-sm text-slate-500">Najprv napíš vetu.</p>
          ) : (
            words.map((word, index) => {
              const isActive = hiddenWord.toLowerCase() === word.toLowerCase()
              return (
                <button
                  key={`${word}-${index}`}
                  type="button"
                  onClick={() => onHiddenWordChange(word)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? 'border-amber-300 bg-amber-300 text-slate-950 shadow-[0_0_0_1px_rgba(251,191,36,0.25)]'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-amber-300/50 hover:bg-amber-300/10 hover:text-amber-200'
                  }`}
                >
                  {word}
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">Náhľad</p>
        <p className="leading-7">
          {sentence ? (
            <>
              {previewParts.map((part, index) =>
                hiddenWord && part.toLowerCase() === hiddenWord.toLowerCase() ? (
                  <span key={index} className="rounded-md bg-amber-300/15 px-1.5 py-0.5 text-amber-200">
                    {part}
                  </span>
                ) : (
                  <span key={index}>{part}</span>
                )
              )}
            </>
          ) : (
            preview
          )}
        </p>
      </div>
    </div>
  )
}
