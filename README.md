# wordle-vue

Vue 3로 만든 5글자 단어 맞추기 게임 (Wordle clone)

## 🎮 게임 소개

매일 새로운 5글자 영단어를 6번의 시도 안에 맞추는 게임입니다.

- 🟩 **초록색** — 정확한 위치에 있는 글자
- 🟨 **노란색** — 단어에 포함되지만 위치가 다른 글자
- ⬛ **회색** — 단어에 없는 글자

## 🛠 기술 스택

| 기술 | 설명 |
|------|------|
| **Vue 3** | Composition API + `<script setup>` |
| **TypeScript** | 정적 타입 |
| **Vite** | 빠른 개발 서버 및 빌드 도구 |
| **Pinia** | 전역 상태 관리 |
| **Tailwind CSS** | 유틸리티 기반 스타일링 |

## 📁 프로젝트 구조

```
wordle-vue/
├── public/
│   └── words.json            # 정답 단어 목록 (5글자)
├── src/
│   ├── assets/styles/
│   │   └── main.css          # Tailwind + 커스텀 애니메이션
│   ├── components/
│   │   ├── GameBoard.vue     # 6×5 전체 그리드
│   │   ├── GameRow.vue       # 한 줄 (시도 1회)
│   │   ├── GameTile.vue      # 글자 1칸 (색상 + 애니메이션)
│   │   ├── Keyboard.vue      # 화면 키보드
│   │   ├── KeyCap.vue        # 키보드 키 1개
│   │   ├── ToastMessage.vue  # 알림 메시지
│   │   └── ResultModal.vue   # 게임 종료 결과 팝업
│   ├── composables/
│   │   ├── useWordle.ts      # 핵심 게임 로직
│   │   └── useKeyboard.ts    # 물리 키보드 이벤트 처리
│   ├── stores/
│   │   └── gameStore.ts      # Pinia 전역 상태
│   ├── utils/
│   │   └── wordUtils.ts      # 단어 유효성 검사, 정답 선택
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🚀 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🎯 게임 기능

- **매일 다른 정답** — 날짜 기반 시드로 매일 고정된 단어 선택
- **6번의 시도** — 최대 6번 안에 맞춰야 함
- **실시간 색상 피드백** — 제출 후 타일 플립 애니메이션과 함께 결과 표시
- **화면 + 물리 키보드** — 마우스 클릭 또는 실제 키보드로 입력
- **진행 상태 저장** — localStorage로 오늘의 게임 상태 복원
- **토스트 메시지** — "단어 없음", "글자 부족" 등 안내 메시지

### 💡 힌트 기능

| 버튼 | 기능 |
|------|------|
| 💡 **Reveal Letter** | 현재 줄에서 정답의 한 글자를 채워줌 |
| 🗑️ **Remove Letter** | 정답에 없는 글자 하나를 키보드에서 비활성화 |

## 📊 데이터 흐름

```
물리 키보드 / KeyCap 클릭
        ↓
  useKeyboard.ts
  (이벤트 정규화)
        ↓
  useWordle.ts  ←→  gameStore.ts (Pinia)
  (게임 로직)        (전역 상태)
        ↓
GameBoard → GameRow → GameTile
     (상태 기반 렌더링)
```

## 🗂 Pinia 스토어 상태

```typescript
{
  answer: string          // 오늘의 정답 (예: 'CRANE')
  guesses: string[][]     // 제출된 단어들
  currentRow: number      // 현재 시도 줄 (0~5)
  currentInput: string[]  // 입력 중인 글자
  tileStates: string[][]  // 6×5 타일 상태 배열
  keyStates: Record<string, string>  // 키보드 키 상태
  gameStatus: 'playing' | 'won' | 'lost'
  toastMessage: string
  isRevealing: boolean    // 애니메이션 진행 중
}
```

## 📝 라이선스

MIT

