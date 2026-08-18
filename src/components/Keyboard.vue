<template>
  <div class="flex w-full flex-col" :style="{ gap: 'var(--gap)' }">
    <div
      v-for="(row, rowIdx) in keyRows"
      :key="rowIdx"
      class="flex w-full"
      :style="{ gap: 'var(--gap)' }"
    >
      <!-- Half-unit spacers keep the middle row centred and every row exactly
           10 units wide, so all three rows line up at any viewport width. -->
      <div v-if="row.pad" class="basis-0 grow-[0.5]" aria-hidden="true"></div>
      <KeyCap
        v-for="key in row.keys"
        :key="key.label"
        :label="key.label"
        :state="store.keyStates[key.label]"
        :wide="key.wide"
        @key-press="handleKey"
      />
      <div v-if="row.pad" class="basis-0 grow-[0.5]" aria-hidden="true"></div>
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

const letter = (l: string) => ({ label: l, wide: false })

// Every row totals 10 flex units: 10x1 / 0.5+9x1+0.5 / 1.5+7x1+1.5
const keyRows = [
  { pad: false, keys: ['Q','W','E','R','T','Y','U','I','O','P'].map(letter) },
  { pad: true, keys: ['A','S','D','F','G','H','J','K','L'].map(letter) },
  {
    pad: false,
    keys: [
      { label: 'ENTER', wide: true },
      ...['Z','X','C','V','B','N','M'].map(letter),
      { label: 'BACKSPACE', wide: true },
    ],
  },
]

function handleKey(key: string) {
  emit('key-press', key)
}
</script>
