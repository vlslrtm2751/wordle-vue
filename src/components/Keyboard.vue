<template>
  <div class="flex flex-col gap-1 items-center">
    <div v-for="(row, rowIdx) in keyRows" :key="rowIdx" class="flex gap-1">
      <KeyCap
        v-for="key in row"
        :key="key.label"
        :label="key.label"
        :state="store.keyStates[key.label]"
        :wide="key.wide"
        @key-press="handleKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import KeyCap from './KeyCap.vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

const emit = defineEmits<{
  (e: 'key-press', key: string): void
}>()

const keyRows = [
  ['Q','W','E','R','T','Y','U','I','O','P'].map(l => ({ label: l, wide: false })),
  ['A','S','D','F','G','H','J','K','L'].map(l => ({ label: l, wide: false })),
  [
    { label: 'ENTER', wide: true },
    ...['Z','X','C','V','B','N','M'].map(l => ({ label: l, wide: false })),
    { label: 'BACKSPACE', wide: true },
  ],
]

function handleKey(key: string) {
  emit('key-press', key)
}
</script>
