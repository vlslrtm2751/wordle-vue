<template>
  <!-- Width comes from the row (flex-1), height from the row's own height, so
       the tile stays square without any fixed pixel size. -->
  <div
    data-tile
    class="flex h-full min-w-0 flex-1 select-none items-center justify-center border-2 font-bold uppercase leading-none"
    :class="[stateClass, animationClass]"
    :style="{ fontSize: 'clamp(0.75rem, min(6.5vw, 3.6dvh), 1.75rem)' }"
  >
    {{ letter }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  letter: string
  state: string
  bouncing?: boolean
}>()

const stateClass = computed(() => {
  switch (props.state) {
    case 'correct': return 'bg-green-600 text-white border-green-600'
    case 'present': return 'bg-yellow-500 text-white border-yellow-500'
    case 'absent': return 'bg-gray-600 text-white border-gray-600'
    case 'active': return 'border-gray-400 dark:border-gray-400 text-gray-900 dark:text-white'
    default: return 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
  }
})

const animationClass = computed(() => {
  if (props.bouncing) return 'tile-bounce'
  if (props.state === 'correct' || props.state === 'present' || props.state === 'absent') return 'tile-flip'
  if (props.letter && props.state === 'active') return 'tile-pop'
  return ''
})
</script>
