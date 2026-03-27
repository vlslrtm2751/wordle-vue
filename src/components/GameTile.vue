<template>
  <div
    class="w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase select-none"
    :class="[stateClass, animationClass]"
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
    case 'active': return 'border-gray-400 text-gray-900'
    default: return 'border-gray-300 text-gray-900'
  }
})

const animationClass = computed(() => {
  if (props.bouncing) return 'tile-bounce'
  if (props.state === 'correct' || props.state === 'present' || props.state === 'absent') return 'tile-flip'
  if (props.letter && props.state === 'active') return 'tile-pop'
  return ''
})
</script>
