<template>
  <div class="flex gap-1" :class="{ 'row-shake': isShaking }">
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
