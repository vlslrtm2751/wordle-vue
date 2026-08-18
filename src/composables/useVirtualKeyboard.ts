import { onMounted, onUnmounted, ref } from 'vue'

/*
 * Detects the phone's native on-screen keyboard and reports the height the app
 * still has to work with.
 *
 * Neither platform gives a direct signal, so we watch visualViewport and treat
 * a large sudden loss of height as the keyboard. Comparing against the tallest
 * height seen so far (rather than window.innerHeight) is what makes this work
 * on both platforms: iOS shrinks only the visual viewport, while Chrome on
 * Android can shrink the layout viewport too, which would leave
 * `innerHeight - visualViewport.height` at roughly zero.
 */

// Browser toolbars collapse by ~50-100px; a keyboard takes far more than this.
const KEYBOARD_THRESHOLD_PX = 150

const keyboardOpen = ref(false)
// Pixel height to constrain the app to, or null to fall back to the CSS height.
const appHeight = ref<string | null>(null)

let baselineHeight = 0
let baselineWidth = 0

function sync() {
  const vv = window.visualViewport
  if (!vv) return

  // Pinch zoom shrinks the visual viewport too — not a keyboard.
  if (vv.scale > 1.01) return

  // Rotating the device invalidates the remembered height.
  if (vv.width !== baselineWidth) {
    baselineWidth = vv.width
    baselineHeight = 0
  }
  if (vv.height > baselineHeight) baselineHeight = vv.height

  const open = baselineHeight - vv.height > KEYBOARD_THRESHOLD_PX
  keyboardOpen.value = open
  appHeight.value = open ? `${Math.round(vv.height)}px` : null
}

export function useVirtualKeyboard() {
  onMounted(() => {
    const vv = window.visualViewport
    if (!vv) return
    sync()
    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    // Browsers configured with interactive-widget=resizes-content shrink the
    // layout viewport instead, which surfaces as a plain window resize.
    window.addEventListener('resize', sync)
    window.addEventListener('orientationchange', sync)
  })

  onUnmounted(() => {
    const vv = window.visualViewport
    if (!vv) return
    vv.removeEventListener('resize', sync)
    vv.removeEventListener('scroll', sync)
    window.removeEventListener('resize', sync)
    window.removeEventListener('orientationchange', sync)
  })

  return { keyboardOpen, appHeight }
}
