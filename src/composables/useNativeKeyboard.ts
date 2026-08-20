import { ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'

const WORD_LENGTH = 5

/*
 * Bridges the phone's own keyboard to the current guess.
 *
 * Earlier attempts classified each edit by reading `beforeinput.inputType` and
 * cancelling it. That does not survive real IMEs: Gboard delivers every letter
 * as a composition, so the browser reports `insertCompositionText` (frequently
 * not even cancelable) rather than `insertText`, and the letters never arrived.
 *
 * So this does not try to classify edits at all. The hidden field is allowed to
 * hold the guess, and the row simply mirrors whatever the field now contains.
 * Any IME that can type into a text field therefore works, and backspace needs
 * no special handling — the field shrinking is the whole signal. That also
 * retires the empty-field problem, since the field is only ever empty when the
 * row is too.
 */
export function useNativeKeyboard() {
  const store = useGameStore()
  const inputRef = ref<HTMLInputElement | null>(null)

  let composing = false
  let submitting = false

  const canPlay = () => store.gameStatus === 'playing' && !store.isRevealing
  const rowText = () => store.currentInput.join('')

  function sanitize(value: string) {
    return value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, WORD_LENGTH)
  }

  /** Field → row. */
  function syncFromField() {
    const el = inputRef.value
    if (!el) return
    if (!canPlay()) {
      // Mid-reveal edits are dropped, so put the field back where the row is.
      syncToField()
      return
    }
    const next = sanitize(el.value)
    if (next === rowText()) return
    store.$patch({ currentInput: next.split('') })
    store.updateActiveTileStates()
  }

  /** Row → field, for hints, submits and the on-screen keyboard. */
  function syncToField() {
    const el = inputRef.value
    // Rewriting the value mid-composition breaks the IME's composing region.
    if (!el || composing) return
    const want = rowText()
    if (el.value === want) return
    el.value = want
    try {
      el.setSelectionRange(want.length, want.length)
    } catch {
      /* some inputs refuse selection APIs; the value still matters */
    }
  }

  async function submit() {
    if (submitting) return
    submitting = true
    try {
      await store.submitGuess()
    } finally {
      submitting = false
      syncToField()
    }
  }

  function onInput() {
    // Fires during composition too, so letters land as they are typed rather
    // than only when the IME commits the word.
    syncFromField()
  }

  function onCompositionStart() {
    composing = true
  }

  function onCompositionEnd() {
    composing = false
    syncFromField()
    syncToField()
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  function onBeforeInput(e: InputEvent) {
    // Some keyboards report the go/return key as a line break instead of Enter.
    if (e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') {
      if (e.cancelable) e.preventDefault()
      submit()
    }
  }

  function focus() {
    const el = inputRef.value
    if (!el) return
    syncToField()
    el.focus({ preventScroll: true })
    const end = el.value.length
    try {
      el.setSelectionRange(end, end)
    } catch {
      /* ignore */
    }
  }

  function blur() {
    inputRef.value?.blur()
  }

  // Keep the field aligned when the row changes from anywhere else.
  watch(() => store.currentInput, () => syncToField())

  return {
    inputRef,
    focus,
    blur,
    onInput,
    onKeydown,
    onBeforeInput,
    onCompositionStart,
    onCompositionEnd,
  }
}
