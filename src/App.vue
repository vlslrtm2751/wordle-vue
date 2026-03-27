<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors">
    <!-- Header -->
    <header class="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-3 px-4 transition-colors">
      <div class="max-w-lg mx-auto flex items-center justify-between">
        <!-- Theme + Language toggles -->
        <div class="flex items-center gap-2">
          <button
            class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-colors text-base"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <button
            class="h-9 px-2 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-colors text-xs font-bold tracking-wide"
            :aria-label="locale === 'en' ? 'Switch to Korean' : 'Switch to English'"
            @click="toggleLocale"
          >
            {{ locale === 'en' ? 'KO' : 'EN' }}
          </button>
        </div>

        <h1 class="text-3xl font-bold tracking-wider text-gray-900 dark:text-white transition-colors">WORDLE</h1>

        <!-- Help button -->
        <button
          class="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:border-gray-700 dark:hover:border-gray-300 font-bold text-lg transition-colors"
          aria-label="How to play"
          @click="showHelp = true"
        >
          ?
        </button>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex flex-col items-center justify-between py-4 gap-4">
      <!-- Game Board -->
      <div class="flex flex-col items-center gap-4">
        <GameBoard v-if="initialized" />
        <div v-else class="text-gray-400 dark:text-gray-500">{{ t('loading') }}</div>

        <!-- Hint buttons -->
        <div class="flex gap-3 mt-2">
          <button
            class="flex items-center gap-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="store.gameStatus !== 'playing' || store.isRevealing"
            :title="t('reveal_hint_title')"
            @click="wordle.hintReveal()"
          >
            <span>💡</span> {{ t('reveal_letter') }}
          </button>
          <button
            class="flex items-center gap-1.5 px-4 py-2 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="store.gameStatus !== 'playing' || store.isRevealing"
            :title="t('remove_hint_title')"
            @click="wordle.hintRemove()"
          >
            <span>🗑️</span> {{ t('remove_letter') }}
          </button>
        </div>
      </div>

      <!-- Keyboard -->
      <div class="w-full max-w-lg px-2">
        <Keyboard @key-press="handleKeyPress" />
      </div>
    </main>

    <!-- Toast -->
    <ToastMessage :message="store.toastMessage" />

    <!-- Result Modal -->
    <ResultModal />

    <!-- Help Modal -->
    <HelpModal v-model="showHelp" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameBoard from './components/GameBoard.vue'
import Keyboard from './components/Keyboard.vue'
import ToastMessage from './components/ToastMessage.vue'
import ResultModal from './components/ResultModal.vue'
import HelpModal from './components/HelpModal.vue'
import { useGameStore } from './stores/gameStore'
import { useWordle } from './composables/useWordle'
import { useKeyboard } from './composables/useKeyboard'
import { useI18n } from './composables/useI18n'
import { useTheme } from './composables/useTheme'

const store = useGameStore()
const wordle = useWordle()
const initialized = ref(false)
const showHelp = ref(false)

const { locale, t, toggleLocale } = useI18n()
const { isDark, toggleTheme } = useTheme()

useKeyboard()

onMounted(async () => {
  await store.init()
  initialized.value = true
})

function handleKeyPress(key: string) {
  if (key === 'ENTER') {
    wordle.submitGuess()
  } else if (key === 'BACKSPACE') {
    wordle.deleteLetter()
  } else {
    wordle.addLetter(key)
  }
}
</script>
