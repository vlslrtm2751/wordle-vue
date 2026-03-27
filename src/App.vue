<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="border-b border-gray-300 py-3 px-4">
      <div class="max-w-lg mx-auto flex items-center justify-center relative">
        <h1 class="text-3xl font-bold tracking-wider text-gray-900">WORDLE</h1>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 flex flex-col items-center justify-between py-4 gap-4">
      <!-- Game Board -->
      <div class="flex flex-col items-center gap-4">
        <GameBoard v-if="initialized" />
        <div v-else class="text-gray-400">Loading...</div>

        <!-- Hint buttons -->
        <div class="flex gap-3 mt-2">
          <button
            class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            :disabled="store.gameStatus !== 'playing' || store.isRevealing"
            @click="wordle.hintReveal()"
          >
            💡 Reveal Letter
          </button>
          <button
            class="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            :disabled="store.gameStatus !== 'playing' || store.isRevealing"
            @click="wordle.hintRemove()"
          >
            🗑️ Remove Letter
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GameBoard from './components/GameBoard.vue'
import Keyboard from './components/Keyboard.vue'
import ToastMessage from './components/ToastMessage.vue'
import ResultModal from './components/ResultModal.vue'
import { useGameStore } from './stores/gameStore'
import { useWordle } from './composables/useWordle'
import { useKeyboard } from './composables/useKeyboard'

const store = useGameStore()
const wordle = useWordle()
const initialized = ref(false)

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
