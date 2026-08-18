<template>
  <!-- Keys are flex units, never fixed pixels, so a row can never be wider
       than the viewport. Wide keys take 1.5 units. -->
  <button
    class="basis-0 min-w-0 select-none overflow-hidden rounded px-0.5 font-bold uppercase leading-none transition-colors"
    :class="[wide ? 'grow-[1.5]' : 'grow', colorClass, fontClass]"
    :style="{ height: 'var(--key-h)' }"
    :aria-label="label"
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

// ENTER carries five characters in a 1.5-unit key, so it needs a smaller ramp.
const fontClass = computed(() =>
  props.label === 'ENTER'
    ? 'text-[clamp(0.5rem,2.3vw,0.72rem)]'
    : 'text-[clamp(0.7rem,3.4vw,0.95rem)]'
)

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
