<template>
  <!--
    Stand-in for the full keyboard while the phone's native keyboard is up: it
    keeps the green/yellow/grey letter feedback on screen in a fraction of the
    height, so the board does not get squeezed into the remaining sliver.
  -->
  <div class="flex w-full flex-col gap-0.5" :aria-label="ariaLabel" role="group">
    <div v-for="(row, rowIdx) in rows" :key="rowIdx" class="flex w-full justify-center gap-0.5">
      <span
        v-for="key in row"
        :key="key"
        class="min-w-0 grow basis-0 rounded-sm py-0.5 text-center text-[clamp(0.5rem,2.6vw,0.7rem)] font-bold leading-tight"
        :class="chipClass(key)"
      >
        {{ key }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()

const rows = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
]

function chipClass(key: string) {
  switch (store.keyStates[key]) {
    case 'correct': return 'bg-green-600 text-white'
    case 'present': return 'bg-yellow-500 text-white'
    case 'absent': return 'bg-gray-600 text-white'
    case 'hint-removed': return 'bg-gray-300 text-gray-400 line-through dark:bg-gray-600 dark:text-gray-500'
    default: return 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
  }
}

const ariaLabel = computed(() => 'Letter status')
</script>
