import { useGameStore } from '../stores/gameStore'

export function useWordle() {
  const store = useGameStore()

  function addLetter(letter: string) {
    store.addLetter(letter)
  }

  function deleteLetter() {
    store.deleteLetter()
  }

  function submitGuess() {
    store.submitGuess()
  }

  function hintReveal() {
    if (store.gameStatus !== 'playing') return
    if (store.isRevealing) return

    const answer = store.answer
    const input = [...store.currentInput]

    // Find first position where input doesn't match answer
    for (let i = 0; i < 5; i++) {
      if (input[i] !== answer[i]) {
        // Fill positions 0..i with correct letters
        const newInput: string[] = []
        for (let j = 0; j <= i; j++) {
          newInput.push(answer[j])
        }
        store.$patch({ currentInput: newInput })
        store.updateActiveTileStates()
        return
      }
    }
  }

  function hintRemove() {
    if (store.gameStatus !== 'playing') return
    if (store.isRevealing) return

    const keyStates = { ...store.keyStates }
    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    // Only pick from letters that are still unknown (not yet guessed, not already hint-removed)
    // AND that are actually not in the answer — so the hint is always truthful and new information
    const candidates = ALPHABET.filter(letter => {
      const state = keyStates[letter]
      if (state !== undefined) return false          // already known (absent/present/correct/hint-removed)
      return !store.answer.includes(letter)          // not in the answer
    })

    if (candidates.length === 0) {
      store.setToast('no_letters_to_remove')
      return
    }

    const letter = candidates[Math.floor(Math.random() * candidates.length)]
    keyStates[letter] = 'hint-removed'
    store.$patch({ keyStates })
  }

  return {
    addLetter,
    deleteLetter,
    submitGuess,
    hintReveal,
    hintRemove,
  }
}
