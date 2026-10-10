# 뭘 바꾸려면 어디를 열어야 하나

구조를 외울 필요는 없습니다. 찾는 방법 하나와 표 하나면 됩니다.

---

## 0. 가장 먼저 — 화면에 보이는 글자로 검색하기

이 방법 하나로 90%는 찾습니다. **구조를 몰라도 됩니다.**

```bash
cd frontend
grep -rn "찾고싶은문구" src/
```

실제 예시:

```bash
$ grep -rn "문제 해결 시작" src/
src/data/cases/operation-01.json:11:  "actionLabel": "문제 해결 시작"
```

→ 아, 이 버튼 글자는 케이스 JSON에 있구나. 바로 열어서 고치면 됩니다.

```bash
$ grep -rn "개념 사전" src/components/
src/components/operation/OperationCaseList.jsx:34:  📖 개념 사전
```

→ 버튼은 케이스 목록 화면에 있구나.

**옵션 설명**: `-r`은 하위 폴더까지, `-n`은 줄 번호 표시. IDE라면 `Cmd+Shift+F`(전체 검색)가 같은 일을 합니다.

검색이 안 될 때는 문구가 조각나 있을 수 있습니다. 짧게 잘라서 다시 해보세요. `"주문이 두 건 생성"` 대신 `"두 건"`처럼요.

---

## 1. 이걸 바꾸려면 → 여기

### 콘텐츠 (글자, 문제, 개념)

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 질문·선택지·정답·피드백 | `src/data/cases/operation-NN.json` |
| Mission / Problem 문구 | `src/data/cases/operation-NN.json` |
| 최종 해결안, 키워드 매핑 | `src/data/cases/operation-NN.json` |
| 미션 완료 배지 이름 | `src/data/cases/operation-NN.json` |
| 케이스 카드의 제목·난이도·소요시간·키워드 | `src/data/operationCases.js` |
| 케이스를 열거나 잠그기 (`status`) | `src/data/operationCases.js` |
| 개념의 정의·실무 예시 | `src/data/concepts.js` |
| 계층 대응표, 판별 질문 3개 | `src/data/concepts.js` |
| 랜딩 화면 문구 | `src/data/landing.js` |
| 트랙(개발/운영) 설명 | `src/data/learningTracks.js` |
| "준비 중입니다" 토스트 문구 | `learningTracks.js` / `operationCases.js` 하단 |

**콘텐츠는 거의 다 `src/data/` 안에 있습니다.** 여기부터 찾으세요.

### 화면 모양 (배치, 순서, 동작)

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 선택지 배치, 정/오답 표시 방식 | `components/operation/QuizStep.jsx` |
| 피드백 박스 구성 | `components/operation/FeedbackPanel.jsx` |
| 상단 진행률 헤더 | `components/common/ProgressHeader.jsx` |
| 케이스 카드 모양 | `components/operation/OperationCaseCard.jsx` |
| 케이스 목록 화면 | `components/operation/OperationCaseList.jsx` |
| 개념 사전 화면 | `components/concepts/ConceptDictionary.jsx` |
| 랜딩 화면 구성 | `components/landing/LandingScreen.jsx` |
| 미션 완료 화면 | `components/operation/MissionComplete.jsx` |

### 색, 크기, 여백

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 브랜드 색, 계층 배지 색, 여백 값 | `src/styles/tokens.css` |
| 학습 화면 스타일 (`.oc-*`) | `src/styles/learning.css` |
| 랜딩 화면 스타일 (`.ld-*`) | `src/styles/landing.css` |
| 기본 글자 크기, 리셋 | `src/index.css` |

**색을 바꾼다면 `tokens.css`의 변수만 고치세요.** 개별 CSS 파일에 색을 직접 쓰면 나중에 한 번에 못 바꿉니다.

### 동작과 저장

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 진행 상태 저장 방식, localStorage | `src/hooks/useLearningProgress.js` |
| 어떤 화면을 보여줄지 결정 (`view`) | `src/hooks/useLearningProgress.js` |
| 진행률 계산 방식 | `src/hooks/useLearningProgress.js` |
| 화면 연결 (어느 view에 어느 컴포넌트) | `src/App.jsx` |
| 스텝 타입 → 컴포넌트 연결 | `components/operation/CasePlayer.jsx` |

---

## 2. 자주 하는 작업 순서

### 새 케이스 추가 (예: 구조 트랙 01)

1. `src/data/cases/xxx.json` 파일 생성 (기존 파일 복사해서 시작)
2. `src/data/caseContents.js`에 import 한 줄 + 레지스트리 한 줄 추가
3. `src/data/operationCases.js`에 카드 메타 추가, `status: 'available'`
4. 새 개념이 있으면 `src/data/concepts.js`에 추가
5. `npm run validate:cases` 실행

**딱 이 순서입니다.** 컴포넌트나 스타일은 건드릴 일이 없습니다.

### 문제 하나 고치기

1. 화면에 보이는 문구로 `grep`
2. 나온 JSON 파일에서 수정
3. `npm run validate:cases`

### 개념 하나 추가하기

1. `src/data/concepts.js`에 객체 추가 (`id`, `name`, `domain`, `definition`, `example`, `source`)
2. 케이스에서 쓰려면 그 JSON의 `conceptRefs`에 `{ "id": "새id", "usedAt": "..." }` 추가
3. `npm run validate:cases` — 없는 id를 참조하면 여기서 걸립니다

### 색 바꾸기

1. `src/styles/tokens.css`에서 변수 값만 수정
2. 끝

---

## 3. 표에 없는 걸 만났을 때 — 판단 기준

스스로 물어볼 질문 세 개입니다.

**① 화면에 글자로 보이는가?**
→ `src/data/` 어딘가입니다. grep으로 찾으세요.

**② 화면이 아니라 "어떻게 동작하는가"인가?**
(저장, 계산, 어떤 화면을 보여줄지)
→ `src/hooks/useLearningProgress.js`

**③ 보이는 모양이나 배치인가?**
→ `src/components/` 안. 화면 이름으로 파일을 찾으면 됩니다.

### 헷갈리기 쉬운 두 가지

**"질문 문구를 바꾸고 싶다"** — `components/operation/QuizStep.jsx`가 아니라 **JSON**입니다.
QuizStep은 *어떻게 보여줄지*만 알고, *무엇을 보여줄지*는 모릅니다.

**"케이스 제목을 바꾸고 싶다"** — 케이스 JSON이 아니라 **`operationCases.js`**입니다.
제목은 카드 메타가 단독으로 갖고 있습니다. JSON에는 제목이 아예 없습니다.

---

## 4. 파일별로 무엇을 소유하는가

같은 정보가 두 곳에 있으면 반드시 어긋납니다. 그래서 소유자를 하나로 정해뒀습니다.

| 파일 | 이것만 갖는다 |
|---|---|
| `operationCases.js` | 케이스 카드 메타 (제목·난이도·시간·키워드·status) |
| `cases/operation-NN.json` | 학습 단계(steps) **만**. 제목·난이도 없음 |
| `concepts.js` | 개념의 정의와 예시 **만** |
| `caseContents.js` | id → JSON 연결 목록 |
| `useLearningProgress.js` | 진행 상태와 저장 |
| `tokens.css` | 색·여백 값 |

케이스 JSON은 개념을 `{ "id": "idempotency" }`처럼 **참조만** 합니다. 정의를 복사해 넣지 마세요.

---

## 5. 고치고 나서 확인하기

```bash
cd frontend

npm run validate:cases   # 콘텐츠 구조 검사 (JSON 고쳤으면 필수)
npm run lint             # 코드 문법·규칙 검사
npm run dev              # 브라우저에서 직접 확인
```

`validate:cases`가 잡아주는 것들:

- 정답이 선택지에 없음 ← **화면상 멀쩡한데 영원히 다음으로 못 넘어감**
- 없는 개념 id 참조 ← 개념 복습 화면에서 조용히 사라짐
- 필수 필드 누락
- 카드는 있는데 콘텐츠 파일이 없음 (또는 그 반대)

JSON을 고쳤다면 **브라우저보다 이걸 먼저** 돌리세요. 1초면 끝나고, 눈으로 놓치는 걸 잡습니다.

---

## 6. 전체 지도

```
frontend/src/
├── App.jsx                    화면 연결
│
├── data/                      ← 내용 (글자, 문제, 개념)
│   ├── cases/*.json             학습 단계
│   ├── operationCases.js        카드 메타
│   ├── concepts.js              개념 정의
│   ├── caseContents.js          id → JSON 연결
│   ├── landing.js               랜딩 문구
│   └── learningTracks.js        트랙 설명
│
├── components/                ← 모양 (어떻게 보여줄지)
│   ├── landing/
│   ├── onboarding/
│   ├── operation/               학습 화면들
│   ├── concepts/                개념 사전
│   └── common/                  버튼·배지·헤더
│
├── hooks/                     ← 동작 (상태, 저장)
│   └── useLearningProgress.js
│
├── styles/                    ← 색과 여백
│   ├── tokens.css
│   ├── learning.css
│   └── landing.css
│
└── types/learning.js          데이터 형태 설명 (실행 안 됨)
```

한 줄 요약: **data는 내용, components는 모양, hooks는 동작, styles는 색.**
