<template>
  <div
    v-if="store.gameStatus !== 'playing'"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
  >
    <div class="bg-white rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
      <h2 class="text-2xl font-bold mb-2">
        {{ store.gameStatus === 'won' ? '🎉 You Won!' : '😞 Game Over' }}
      </h2>
      <p class="text-lg text-gray-600 mb-1">The answer was:</p>
      <p class="text-3xl font-bold text-green-600 mb-4">{{ store.answer }}</p>
      
      <div v-if="store.gameStatus === 'won'" class="mb-4 text-gray-700">
        You guessed it in {{ store.guesses.length }} {{ store.guesses.length === 1 ? 'try' : 'tries' }}!
      </div>

      <button
        class="bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors w-full"
        @click="store.resetGame()"
      >
        New Game
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
</script>
