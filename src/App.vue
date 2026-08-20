<template>
  <div
    class="flex h-full flex-col overflow-hidden bg-white transition-colors dark:bg-gray-900"
    :style="{
      height: nativeKeyboardOpen ? appHeight ?? undefined : undefined,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
    }"
  >
    <!-- Header -->
    <header class="shrink-0 border-b border-gray-300 bg-white px-3 py-1.5 transition-colors dark:border-gray-700 dark:bg-gray-900">
      <div class="mx-auto flex max-w-lg items-center justify-between gap-2">
        <div class="flex items-center gap-1.5">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 text-sm text-gray-600 transition-colors hover:border-gray-500 sm:h-9 sm:w-9 sm:text-base dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-400"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <button
            class="flex h-8 items-center justify-center rounded-full border-2 border-gray-300 px-2 text-xs font-bold tracking-wide text-gray-600 transition-colors hover:border-gray-500 sm:h-9 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-400"
            :aria-label="locale === 'en' ? 'Switch to Korean' : 'Switch to English'"
            @click="toggleLocale"
          >
            {{ locale === 'en' ? 'KO' : 'EN' }}
          </button>
        </div>

        <h1 class="text-xl font-bold tracking-wider text-gray-900 transition-colors sm:text-3xl dark:text-white">WORDLE</h1>

        <button
          class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-400 text-base font-bold text-gray-600 transition-colors hover:border-gray-700 sm:h-9 sm:w-9 sm:text-lg dark:border-gray-500 dark:text-gray-300 dark:hover:border-gray-300"
          aria-label="How to play"
          @click="showHelp = true"
        >
          ?
        </button>
      </div>
    </header>

    <!-- Main content: the board absorbs the leftover height, hints and keyboard are fixed -->
    <main class="flex min-h-0 flex-1 flex-col items-center gap-1.5 px-1 py-1.5">
      <!-- Game Board — tap to open native keyboard on mobile -->
      <div
        class="flex min-h-0 w-full flex-1 items-center justify-center"
        @click="toggleNativeKeyboard"
      >
        <GameBoard v-if="initialized" />
        <div v-else class="text-gray-400 dark:text-gray-500">{{ t('loading') }}</div>
      </div>

      <!-- Hint buttons -->
      <div class="flex shrink-0 gap-2">
        <button
          class="flex items-center gap-1 whitespace-nowrap rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1.5 sm:px-4 sm:py-1.5 sm:text-sm dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
          :disabled="store.gameStatus !== 'playing' || store.isRevealing"
          :title="t('reveal_hint_title')"
          @click="wordle.hintReveal()"
        >
          <span>💡</span> {{ t('reveal_letter') }}
        </button>
        <button
          class="flex items-center gap-1 whitespace-nowrap rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1.5 sm:px-4 sm:py-1.5 sm:text-sm dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50"
          :disabled="store.gameStatus !== 'playing' || store.isRevealing"
          :title="t('remove_hint_title')"
          @click="wordle.hintRemove()"
        >
          <span>🗑️</span> {{ t('remove_letter') }}
        </button>
      </div>

      <!-- Keyboard — swapped for a compact status strip while the phone's own
           keyboard is covering the bottom of the screen -->
      <div class="w-full max-w-lg shrink-0 px-1">
        <KeyStatusStrip v-if="nativeKeyboardOpen" />
        <Keyboard v-else @key-press="handleKeyPress" />
      </div>
    </main>

    <!--
      Hidden field that summons the phone's own keyboard (focused by tapping the
      board) and then holds the guess, so the row can mirror it. It stays inside
      the visual viewport and non-interactive: an off-screen input makes iOS
      Safari scroll the page hunting for it, and 16px text stops iOS zooming in
      on focus.
    -->
    <input
      v-if="isMobile"
      ref="nativeInputRef"
      type="text"
      class="pointer-events-none fixed left-1/2 top-1/2 h-px w-px border-0 bg-transparent p-0 text-[16px] opacity-0"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="characters"
      spellcheck="false"
      inputmode="text"
      enterkeyhint="go"
      tabindex="-1"
      @input="native.onInput"
      @beforeinput="native.onBeforeInput"
      @compositionstart="native.onCompositionStart"
      @compositionend="native.onCompositionEnd"
      @keydown.stop="native.onKeydown"
    />

    <ToastMessage :message="store.toastMessage" />
    <ResultModal />
    <HelpModal v-model="showHelp" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import GameBoard from './components/GameBoard.vue'
import Keyboard from './components/Keyboard.vue'
import KeyStatusStrip from './components/KeyStatusStrip.vue'
import ToastMessage from './components/ToastMessage.vue'
import ResultModal from './components/ResultModal.vue'
import HelpModal from './components/HelpModal.vue'
import { useGameStore } from './stores/gameStore'
import { useWordle } from './composables/useWordle'
import { useKeyboard } from './composables/useKeyboard'
import { useI18n } from './composables/useI18n'
import { useTheme } from './composables/useTheme'
import { useMobile } from './composables/useMobile'
import { useVirtualKeyboard } from './composables/useVirtualKeyboard'
import { useNativeKeyboard } from './composables/useNativeKeyboard'

const store = useGameStore()
const wordle = useWordle()
const initialized = ref(false)
const showHelp = ref(false)

const { locale, t, toggleLocale } = useI18n()
const { isDark, toggleTheme } = useTheme()
const { isMobile } = useMobile()
const { keyboardOpen, appHeight } = useVirtualKeyboard()

// Only mobile gets the swap: a desktop window resize must never hide the keys.
const nativeKeyboardOpen = computed(() => isMobile.value && keyboardOpen.value)

const native = useNativeKeyboard()
const nativeInputRef = native.inputRef

useKeyboard()

onMounted(async () => {
  await store.init()
  initialized.value = true
})

function toggleNativeKeyboard() {
  if (!isMobile.value) return
  // Tapping the board opens the phone keyboard; tapping again dismisses it and
  // brings the on-screen keyboard back, so neither input mode is a dead end.
  if (nativeKeyboardOpen.value) native.blur()
  else native.focus()
}

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
