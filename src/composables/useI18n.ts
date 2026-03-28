import { ref } from 'vue'

type Locale = 'en' | 'ko'

// Module-level singleton so all components share the same locale ref
const locale = ref<Locale>(
  (typeof window !== 'undefined'
    ? (localStorage.getItem('wordle-locale') as Locale)
    : null) ?? 'en'
)

const messages = {
  en: {
    // Toast
    not_enough_letters: 'Not enough letters',
    not_in_word_list: 'Not in word list',
    no_letters_to_remove: 'No unknown letters left to remove',
    genius: 'Genius!',
    magnificent: 'Magnificent!',
    impressive: 'Impressive!',
    splendid: 'Splendid!',
    great: 'Great!',
    phew: 'Phew!',
    you_lose: 'Answer: {answer}',
    // General UI
    loading: 'Loading...',
    tap_to_type: 'Tap to type',
    typing: 'Typing...',
    reveal_letter: 'Reveal Letter',
    remove_letter: 'Remove Letter',
    reveal_hint_title: 'Fill in the next correct letter',
    remove_hint_title: 'Cross out a random absent letter',
    // Help modal
    help_title: 'How to Play',
    help_intro: 'Guess the 5-letter word in 6 tries. After each guess, tiles change color to show how close you were.',
    help_colors_section: 'Tile Colors',
    help_green: 'correct letter, correct position',
    help_yellow: 'correct letter, wrong position',
    help_gray: 'letter not in the word',
    help_hints_section: 'Hints',
    help_reveal_desc: 'fills in the next correct letter in your current guess.',
    help_remove_desc: 'crosses out a random letter not in the word, narrowing your choices.',
    got_it: 'Got it!',
    // Result modal
    you_won: '🎉 You Won!',
    game_over: '😞 Game Over',
    the_answer_was: 'The answer was:',
    new_game: 'New Game',
  },
  ko: {
    // Toast
    not_enough_letters: '글자가 부족합니다',
    not_in_word_list: '단어 목록에 없는 단어입니다',
    no_letters_to_remove: '제거할 수 있는 알파벳이 없습니다',
    genius: '천재!',
    magnificent: '훌륭해요!',
    impressive: '대단해요!',
    splendid: '멋져요!',
    great: '잘했어요!',
    phew: '휴~!',
    you_lose: '정답: {answer}',
    // General UI
    loading: '로딩 중...',
    tap_to_type: '탭하여 입력',
    typing: '입력 중...',
    reveal_letter: '글자 힌트',
    remove_letter: '오답 제거',
    reveal_hint_title: '정답의 다음 글자를 채워줍니다',
    remove_hint_title: '단어에 없는 글자를 지워줍니다',
    // Help modal
    help_title: '게임 방법',
    help_intro: '5글자 단어를 6번 안에 맞추세요. 입력 후 타일 색상이 정답과 얼마나 가까운지 알려줍니다.',
    help_colors_section: '타일 색상',
    help_green: '위치와 알파벳이 정확히 일치',
    help_yellow: '알파벳은 맞지만 위치가 다름',
    help_gray: '단어에 없는 알파벳',
    help_hints_section: '힌트',
    help_reveal_desc: '현재 입력창에 다음 정답 글자를 채워줍니다.',
    help_remove_desc: '정답에 없는 글자 하나를 취소선으로 표시해 선택지를 줄여줍니다.',
    got_it: '확인!',
    // Result modal
    you_won: '🎉 정답!',
    game_over: '😞 게임 오버',
    the_answer_was: '정답은:',
    new_game: '새 게임',
  },
} as const

type MessageKey = keyof typeof messages.en

export function useI18n() {
  function t(key: MessageKey, params?: Record<string, string>): string {
    const dict = messages[locale.value] as Record<string, string>
    const msg = dict[key] ?? (messages.en as Record<string, string>)[key] ?? key
    if (!params) return msg
    return msg.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
  }

  function toggleLocale() {
    locale.value = locale.value === 'en' ? 'ko' : 'en'
    localStorage.setItem('wordle-locale', locale.value)
  }

  return { locale, t, toggleLocale }
}
