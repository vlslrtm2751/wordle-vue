<template>
  <div class="flex flex-col gap-1">
    <GameRow
      v-for="rowIndex in 6"
      :key="rowIndex - 1"
      :letters="getLetters(rowIndex - 1)"
      :states="store.tileStates[rowIndex - 1]"
      :isCurrentRow="rowIndex - 1 === store.currentRow"
      :isShaking="shakingRow === rowIndex - 1"
      :isWon="store.gameStatus === 'won' && rowIndex - 1 === store.currentRow - 1"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import GameRow from './GameRow.vue'
import { useGameStore } from '../stores/gameStore'

const store = useGameStore()
const shakingRow = ref(-1)

function getLetters(row: number): string[] {
  if (row < store.currentRow) {
    return store.guesses[row] || []
  } else if (row === store.currentRow) {
    return store.currentInput
  }
  return []
}

watch(() => store.toastMessage, (msg) => {
  if (msg === 'Not enough letters' || msg === 'Not in word list') {
    shakingRow.value = store.currentRow
    setTimeout(() => {
      shakingRow.value = -1
    }, 600)
  }
})
</script>
