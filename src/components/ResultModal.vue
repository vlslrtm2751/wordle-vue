<template>
  <div
    v-if="store.gameStatus !== 'playing'"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
  >
    <div class="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-sm w-full mx-4 text-center shadow-xl transition-colors">
      <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
        {{ store.gameStatus === 'won' ? t('you_won') : t('game_over') }}
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-300 mb-1">{{ t('the_answer_was') }}</p>
      <p class="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">{{ store.answer }}</p>

      <div v-if="store.gameStatus === 'won'" class="mb-4 text-gray-700 dark:text-gray-200">
        {{ guessedInText }}
      </div>

      <button
        class="bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors w-full"
        @click="store.resetGame()"
      >
        {{ t('new_game') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useI18n } from '../composables/useI18n'

const store = useGameStore()
const { locale, t } = useI18n()

const guessedInText = computed(() => {
  const n = store.guesses.length
  if (locale.value === 'ko') return `${n}번 만에 맞췄어요!`
  return `You guessed it in ${n} ${n === 1 ? 'try' : 'tries'}!`
})
</script>
