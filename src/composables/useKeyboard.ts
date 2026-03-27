import { onMounted, onUnmounted } from 'vue'
import { useWordle } from './useWordle'

export function useKeyboard() {
  const { addLetter, deleteLetter, submitGuess } = useWordle()

  function handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey || event.metaKey) return

    const key = event.key

    if (key === 'Enter') {
      submitGuess()
    } else if (key === 'Backspace') {
      deleteLetter()
    } else if (/^[a-zA-Z]$/.test(key)) {
      addLetter(key.toUpperCase())
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
