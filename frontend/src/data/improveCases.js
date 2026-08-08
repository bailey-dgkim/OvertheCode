/** @typedef {import('../types/learning.js').CaseSummary} CaseSummary */

/**
 * 개선 트랙 케이스 목록(카드용 메타 데이터).
 * 상세 학습 콘텐츠는 cases/improve-NN.json에 분리해 둔다.
 *
 * 개선 트랙은 "이미 있는 코드를 안전하게 바꾼다" — 부임/탐색/수정 경험을 다룬다.
 *
 * @type {CaseSummary[]}
 */
export const improveCases = [
  {
    id: 'improve-01',
    track: 'improve',
    number: '01',
    title: '주문 폼에 항목 하나를 추가하려면 어디를 고쳐야 할까요',
    description: '화면에 보이는 것이 코드 어디에 있는지 직접 찾아갑니다.',
    difficulty: '입문',
    estimatedMinutes: 5,
    keywords: ['화면과 코드', '컴포넌트 찾기', 'JSX 읽기'],
    status: 'available',
  },
];

export const IMPROVE_CASE_COMING_SOON_MESSAGE = '이 미션은 준비 중입니다';
