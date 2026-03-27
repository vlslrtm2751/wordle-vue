import { ref } from 'vue'

// Module-level singleton
const isDark = ref(false)

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('wordle-theme')
  isDark.value =
    saved === 'dark' ||
    (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark.value)
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    localStorage.setItem('wordle-theme', isDark.value ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, toggleTheme }
}
