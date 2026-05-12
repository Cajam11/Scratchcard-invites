const DIACRITICS_RE = /[\u0300-\u036f]/g
const NON_WORD_RE = /[^\p{L}\p{N}\s'-]/gu

export function normalizePhrase(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(DIACRITICS_RE, '')
    .replace(NON_WORD_RE, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function maskSentence(sentence: string, hiddenWord: string) {
  if (!sentence || !hiddenWord) return sentence

  const escaped = hiddenWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const wordPattern = new RegExp(`\\b${escaped}\\b`, 'i')
  return sentence.replace(wordPattern, '________')
}

export function splitSentenceWords(sentence: string) {
  return sentence
    .trim()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
}
