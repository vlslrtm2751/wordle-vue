<template>
  <div
    class="flex min-h-0 flex-1 justify-center"
    :class="{ 'row-shake': isShaking }"
    :style="{ gap: 'var(--gap)' }"
  >
    <GameTile
      v-for="i in 5"
      :key="i"
      :letter="letters[i - 1] || ''"
      :state="states[i - 1] || 'empty'"
      :bouncing="isWon"
      :style="isWon ? { animationDelay: `${(i - 1) * 100}ms` } : {}"
    />
  </div>
</template>

<script setup lang="ts">
import GameTile from './GameTile.vue'

defineProps<{
  letters: string[]
  states: string[]
  isCurrentRow?: boolean
  isShaking?: boolean
  isWon?: boolean
}>()
</script>
