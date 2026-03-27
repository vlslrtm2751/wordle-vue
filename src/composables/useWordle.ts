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
    const absentLetters = Object.keys(keyStates).filter(k => keyStates[k] === 'absent')

    if (absentLetters.length === 0) {
      store.setToast('No letters to remove')
      return
    }

    const randomIdx = Math.floor(Math.random() * absentLetters.length)
    const letter = absentLetters[randomIdx]
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
