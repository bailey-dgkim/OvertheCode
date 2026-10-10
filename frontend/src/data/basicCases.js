/** @typedef {import('../types/learning.js').CaseSummary} CaseSummary */

/**
 * 기초 트랙 케이스 목록(카드용 메타 데이터).
 * 상세 콘텐츠는 cases/basic-NN.json에 분리해 둔다.
 *
 * 기초 트랙은 실무 트랙(운영·개선)의 심층 선행 과정이다.
 * 실무에서 출발해 코드가 익숙해지면 Java 문법·자료구조·알고리즘으로 내려간다.
 *
 * 학습 순서는 Java 문법 → 자료구조 → 알고리즘. 카드 배열도 그 순서로 둔다.
 * (id 번호는 만든 순서라 자료구조가 앞 번호지만, 노출 순서는 아래 배열이 정한다.)
 *
 * @type {CaseSummary[]}
 */
export const basicCases = [
  /* ---------- Java 문법 ---------- */
  {
    id: 'basic-08',
    track: 'basic',
    section: 'Java 문법',
    number: '01',
    title: '낯선 코드를 한글로 읽어봅시다 — 변수',
    description: '외국어처럼, 코드 한 줄을 한글로 해석합니다.',
    difficulty: '입문',
    estimatedMinutes: 6,
    keywords: ['변수', '자료형', '할당'],
    status: 'available',
  },

  /* ---------- 자료구조 ---------- */
  {
    id: 'basic-01',
    track: 'basic',
    section: '자료구조',
    number: '01',
    title: '되돌리기를 만들려는데, 어떤 자료구조가 필요할까요',
    description: '마지막에 넣은 것이 먼저 나오는 스택.',
    difficulty: '입문',
    estimatedMinutes: 6,
    keywords: ['스택', 'LIFO', '시간복잡도'],
    status: 'available',
  },
  {
    id: 'basic-02',
    track: 'basic',
    section: '자료구조',
    number: '02',
    title: '먼저 온 요청부터 공정하게 처리하려면',
    description: '먼저 넣은 것이 먼저 나오는 큐.',
    difficulty: '입문',
    estimatedMinutes: 6,
    keywords: ['큐', 'FIFO', '스택과 비교'],
    status: 'available',
  },
  {
    id: 'basic-03',
    track: 'basic',
    section: '자료구조',
    number: '03',
    title: '학번으로 점수를 즉시 찾으려면',
    description: '키로 값을 바로 꺼내는 해시맵.',
    difficulty: '입문',
    estimatedMinutes: 7,
    keywords: ['해시맵', '키-값', 'O(1)'],
    status: 'available',
  },
  {
    id: 'basic-04',
    track: 'basic',
    section: '자료구조',
    number: '04',
    title: '중복을 없애고 있는지 빠르게 확인하려면',
    description: '중복이 없는 모임, 집합.',
    difficulty: '입문',
    estimatedMinutes: 6,
    keywords: ['집합', '중복 없음', 'contains'],
    status: 'available',
  },
  {
    id: 'basic-05',
    track: 'basic',
    section: '자료구조',
    number: '05',
    title: '폴더 안의 폴더 같은 계층을 표현하려면',
    description: '위에서 아래로 갈라지는 트리.',
    difficulty: '입문',
    estimatedMinutes: 7,
    keywords: ['트리', '계층', 'O(log n)'],
    status: 'available',
  },
  {
    id: 'basic-06',
    track: 'basic',
    section: '자료구조',
    number: '06',
    title: '서로 얽힌 관계망을 표현하려면',
    description: '점과 선으로 이뤄진 그래프.',
    difficulty: '초급',
    estimatedMinutes: 7,
    keywords: ['그래프', '노드-간선', '트리와 비교'],
    status: 'available',
  },
  {
    id: 'basic-07',
    track: 'basic',
    section: '자료구조',
    number: '07',
    title: '항상 가장 급한 것부터 처리하려면',
    description: '우선순위가 맨 위에 오는 힙.',
    difficulty: '초급',
    estimatedMinutes: 7,
    keywords: ['힙', '우선순위 큐', 'O(log n)'],
    status: 'available',
  },

  /* ---------- 알고리즘 ---------- */
  {
    id: 'basic-09',
    track: 'basic',
    section: '알고리즘',
    number: '01',
    title: '합이 10이 되는 두 수를 확실하게 찾으려면',
    description: '모든 경우를 다 보는 완전탐색.',
    difficulty: '입문',
    estimatedMinutes: 6,
    keywords: ['완전탐색', 'brute force', 'O(n²)'],
    status: 'available',
  },
];

export const BASIC_CASE_COMING_SOON_MESSAGE = '이 기초 과정은 준비 중입니다';
