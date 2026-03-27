<template>
  <button
    class="h-14 rounded font-bold text-sm uppercase cursor-pointer select-none transition-colors"
    :class="[widthClass, colorClass]"
    @click="$emit('key-press', label)"
  >
    {{ displayLabel }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  state?: string
  wide?: boolean
}>()

defineEmits<{
  (e: 'key-press', key: string): void
}>()

const displayLabel = computed(() => {
  if (props.label === 'BACKSPACE') return '←'
  return props.label
})

const widthClass = computed(() => {
  return props.wide ? 'px-3 min-w-[4rem]' : 'w-10'
})

const colorClass = computed(() => {
  switch (props.state) {
    case 'correct': return 'bg-green-600 text-white'
    case 'present': return 'bg-yellow-500 text-white'
    case 'absent': return 'bg-gray-600 text-white'
    case 'hint-removed': return 'bg-gray-300 dark:bg-gray-600 text-gray-400 dark:text-gray-500 line-through'
    default: return 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
  }
})
</script>
