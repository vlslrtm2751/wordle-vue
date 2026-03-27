export async function fetchWords(): Promise<string[]> {
  const response = await fetch('/words.json')
  const words: string[] = await response.json()
  return words.filter(w => w.length === 5)
}

export function pickAnswer(words: string[]): string {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const index = seed % words.length
  return words[index]
}

export function pickRandomAnswer(words: string[]): string {
  return words[Math.floor(Math.random() * words.length)]
}

export function isValidWord(word: string, wordList: string[]): boolean {
  return wordList.includes(word.toUpperCase())
}
