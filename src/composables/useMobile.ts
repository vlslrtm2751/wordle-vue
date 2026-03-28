import { ref, onMounted, onUnmounted } from 'vue'

const query =
  typeof window !== 'undefined' ? window.matchMedia('(pointer: coarse)') : null

const isMobile = ref(query?.matches ?? false)

function update(e: MediaQueryListEvent) {
  isMobile.value = e.matches
}

export function useMobile() {
  onMounted(() => query?.addEventListener('change', update))
  onUnmounted(() => query?.removeEventListener('change', update))
  return { isMobile }
}
