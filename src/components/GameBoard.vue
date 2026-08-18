<template>
  <!--
    Two nested aspect boxes so the board is letterboxed correctly whichever axis
    runs out first. `aspect-ratio` only honours the ratio on the axis that is
    `auto`, so a single box with `height:100%` + `max-width` silently squashes
    the tiles once the width clamp bites.

    Outer: height-driven — width follows the available height, then gets clamped
    by the viewport width and by a max board width so tiles stay a sane size.
    Inner: width-driven off that (possibly clamped) width, which restores the
    ratio, and is centred vertically in the leftover space.
  -->
  <div
    class="mx-auto flex h-full max-h-full items-center aspect-[5/6]"
    :style="{ maxWidth: 'min(100%, 22rem)' }"
  >
    <div class="flex w-full max-h-full flex-col aspect-[5/6]" :style="{ gap: 'var(--gap)' }">
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

watch(() => store.toastKey, (key) => {
  if (key === 'not_enough_letters' || key === 'not_in_word_list') {
    shakingRow.value = store.currentRow
    setTimeout(() => {
      shakingRow.value = -1
    }, 600)
  }
})
</script>
