import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchWords, pickAnswer, pickRandomAnswer, isValidWord } from '../utils/wordUtils'
import { useI18n } from '../composables/useI18n'

const STORAGE_KEY = 'wordle-vue-state'
const WORD_LENGTH = 5
const MAX_GUESSES = 6

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export const useGameStore = defineStore('game', () => {
  const { t } = useI18n()

  const answer = ref('')
  const wordList = ref<string[]>([])
  const guesses = ref<string[][]>([])
  const currentRow = ref(0)
  const currentInput = ref<string[]>([])
  const tileStates = ref<string[][]>(
    Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('empty'))
  )
  const keyStates = ref<Record<string, string>>({})
  const gameStatus = ref<'playing' | 'won' | 'lost'>('playing')
  const toastMessage = ref('')
  // Key is exposed so GameBoard can detect shake triggers without string matching
  const toastKey = ref('')
  const isRevealing = ref(false)

  let toastTimer: ReturnType<typeof setTimeout> | null = null

  function setToast(key: string, duration = 2000, params?: Record<string, string>) {
    toastKey.value = key
    toastMessage.value = t(key as Parameters<typeof t>[0], params)
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastMessage.value = ''
      toastKey.value = ''
    }, duration)
  }

  function saveState() {
    const state = {
      date: getTodayStr(),
      answer: answer.value,
      guesses: guesses.value,
      currentRow: currentRow.value,
      currentInput: currentInput.value,
      tileStates: tileStates.value,
      keyStates: keyStates.value,
      gameStatus: gameStatus.value,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  function loadState(): boolean {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    try {
      const state = JSON.parse(raw)
      if (state.date !== getTodayStr()) return false
      answer.value = state.answer
      guesses.value = state.guesses
      currentRow.value = state.currentRow
      currentInput.value = state.currentInput
      tileStates.value = state.tileStates
      keyStates.value = state.keyStates
      gameStatus.value = state.gameStatus
      return true
    } catch {
      return false
    }
  }

  async function init() {
    const words = await fetchWords()
    wordList.value = words
    const restored = loadState()
    if (!restored) {
      answer.value = pickAnswer(words)
      resetToFresh()
    }
  }

  function resetToFresh() {
    guesses.value = []
    currentRow.value = 0
    currentInput.value = []
    tileStates.value = Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill('empty'))
    keyStates.value = {}
    gameStatus.value = 'playing'
    toastMessage.value = ''
    toastKey.value = ''
    isRevealing.value = false
  }

  function resetGame() {
    // Use random pick (not date-seeded) so each new game has a different word
    answer.value = pickRandomAnswer(wordList.value)
    resetToFresh()
    // Save new answer immediately so page refresh restores this game, not the date-seeded word
    saveState()
  }

  function addLetter(letter: string) {
    if (gameStatus.value !== 'playing') return
    if (isRevealing.value) return
    if (currentInput.value.length >= WORD_LENGTH) return
    currentInput.value = [...currentInput.value, letter.toUpperCase()]
    updateActiveTileStates()
  }

  function deleteLetter() {
    if (gameStatus.value !== 'playing') return
    if (isRevealing.value) return
    if (currentInput.value.length === 0) return
    currentInput.value = currentInput.value.slice(0, -1)
    updateActiveTileStates()
  }

  function updateActiveTileStates() {
    const row = currentRow.value
    const newStates = tileStates.value.map(r => [...r])
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (i < currentInput.value.length) {
        newStates[row][i] = 'active'
      } else {
        newStates[row][i] = 'empty'
      }
    }
    tileStates.value = newStates
  }

  function evaluateGuess(guess: string[]): string[] {
    const result: string[] = Array(WORD_LENGTH).fill('absent')
    const answerArr = answer.value.split('')
    const answerRemaining = [...answerArr]

    const guessRemaining: number[] = []
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guess[i] === answerArr[i]) {
        result[i] = 'correct'
        answerRemaining[i] = ''
      } else {
        guessRemaining.push(i)
      }
    }

    for (const i of guessRemaining) {
      const idx = answerRemaining.indexOf(guess[i])
      if (idx !== -1) {
        result[i] = 'present'
        answerRemaining[idx] = ''
      }
    }

    return result
  }

  async function submitGuess() {
    if (gameStatus.value !== 'playing') return
    if (isRevealing.value) return
    if (currentInput.value.length < WORD_LENGTH) {
      setToast('not_enough_letters')
      return
    }

    const word = currentInput.value.join('')
    if (!isValidWord(word, wordList.value)) {
      setToast('not_in_word_list')
      return
    }

    const evaluation = evaluateGuess(currentInput.value)
    const row = currentRow.value
    const guessLetters = [...currentInput.value]

    isRevealing.value = true

    for (let i = 0; i < WORD_LENGTH; i++) {
      await new Promise<void>(resolve => setTimeout(resolve, 300))
      const newStates = tileStates.value.map(r => [...r])
      newStates[row][i] = evaluation[i]
      tileStates.value = newStates
    }

    const newKeyStates = { ...keyStates.value }
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = guessLetters[i]
      const current = newKeyStates[letter]
      const next = evaluation[i]
      if (current === 'correct') continue
      if (current === 'present' && next !== 'correct') continue
      newKeyStates[letter] = next
    }
    keyStates.value = newKeyStates

    guesses.value = [...guesses.value, guessLetters]
    currentInput.value = []
    currentRow.value = row + 1
    isRevealing.value = false

    if (evaluation.every(s => s === 'correct')) {
      gameStatus.value = 'won'
      const winKeys = ['genius', 'magnificent', 'impressive', 'splendid', 'great', 'phew'] as const
      setToast(winKeys[row] ?? 'great', 3000)
    } else if (currentRow.value >= MAX_GUESSES) {
      gameStatus.value = 'lost'
      setToast('you_lose', 4000, { answer: answer.value })
    }

    saveState()
  }

  return {
    answer,
    wordList,
    guesses,
    currentRow,
    currentInput,
    tileStates,
    keyStates,
    gameStatus,
    toastMessage,
    toastKey,
    isRevealing,
    init,
    addLetter,
    deleteLetter,
    submitGuess,
    setToast,
    resetGame,
    updateActiveTileStates,
  }
})
