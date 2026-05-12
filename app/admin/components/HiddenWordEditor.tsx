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
  const preview = sentence || 'Sem napis vetu a potom klikni slovo, ktore ma byt skryte.'
  const escapedHiddenWord = hiddenWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const previewParts = hiddenWord
    ? sentence.split(new RegExp(`(${escapedHiddenWord})`, 'i'))
    : [sentence]

  return (
    <div className="space-y-4 rounded-2xl border border-[#c4a661]/20 bg-black/25 p-5">
      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/85">Cela veta</label>
        <textarea
          value={sentence}
          onChange={(e) => {
            onSentenceChange(e.target.value)
            if (hiddenWord && !e.target.value.toLowerCase().includes(hiddenWord.toLowerCase())) {
              onHiddenWordChange('')
            }
          }}
          rows={3}
          placeholder="Napr. Ja pockam, ja mam casu dost."
          className="mt-2 w-full rounded-xl border border-[#c4a661]/20 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-[#c4a661]"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-xs uppercase tracking-[0.2em] text-[#c4a661]/85">
            Klikni na slovo na skrytie
          </label>
          {hiddenWord && (
            <span className="rounded-full border border-[#c4a661]/40 bg-[#c4a661]/15 px-3 py-1 text-xs text-[#c4a661]">
              Skryte: {hiddenWord}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 rounded-xl border border-[#c4a661]/15 bg-black/30 p-3">
          {words.length === 0 ? (
            <p className="text-sm text-neutral-500">Najprv napis vetu.</p>
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
                      ? 'border-[#c4a661] bg-[#c4a661] text-[#0a0a0a]'
                      : 'border-[#c4a661]/30 bg-[#c4a661]/5 text-neutral-200 hover:border-[#c4a661]/60 hover:bg-[#c4a661]/15 hover:text-[#f0dba7]'
                  }`}
                >
                  {word}
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-[#c4a661]/25 bg-[#c4a661]/5 p-4 text-sm text-neutral-200">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#c4a661]/80">Nahlad</p>
        <p className="leading-7">
          {sentence ? (
            <>
              {previewParts.map((part, index) =>
                hiddenWord && part.toLowerCase() === hiddenWord.toLowerCase() ? (
                  <span key={index} className="rounded-md bg-[#c4a661]/20 px-1.5 py-0.5 text-[#f0dba7]">
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
