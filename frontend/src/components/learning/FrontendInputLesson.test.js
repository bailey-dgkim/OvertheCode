import { describe, expect, it } from 'vitest';
import {
  CORRECT_SEQUENCE,
  EVENT_TYPES,
  INPUT_FLOW,
  LESSON_STEPS,
  MEMORY_ITEMS,
  SEQUENCE_CARDS,
} from './FrontendInputLesson';
import { isCorrectSequence } from './frontendInputLessonUtils';

describe('Chapter 4 사용자 입력 교육 콘텐츠', () => {
  it('입력 이해, 실행 순서 미션, 실제 코드 적용과 API 연결을 제공한다', () => {
    expect(LESSON_STEPS.map((step) => step.short)).toEqual([
      '버튼과 State',
      'Event',
      'onClick',
      '전체 흐름',
      'Event Handler',
      'onChange',
      'Event Object',
      '실행 순서 미션',
      'OTC 코드 적용',
      '필수 암기',
      '다음 질문',
    ]);
  });

  it('사용자 행동에서 화면 변경까지의 전체 흐름을 유지한다', () => {
    expect(INPUT_FLOW).toEqual([
      '사용자',
      '버튼 클릭',
      'click Event',
      'onClick',
      'Event Handler',
      'setStatus()',
      'State 변경',
      'Re-rendering',
      'DOM 반영',
      '화면 변경',
    ]);
  });

  it('대표 Event 네 종류와 필수 암기 다섯 개념을 제공한다', () => {
    expect(EVENT_TYPES.map(([event]) => event)).toEqual(['click', 'change', 'input', 'submit']);
    expect(MEMORY_ITEMS.map(([concept]) => concept)).toEqual([
      'Event',
      'onClick',
      'onChange',
      'Event Handler',
      'Event Object',
    ]);
  });

  it('실습 미션 정답을 ② → ⑤ → ③ → ① → ④ 순서로 판정한다', () => {
    const correctItems = CORRECT_SEQUENCE.map((id) => (
      SEQUENCE_CARDS.find((item) => item.id === id)
    ));

    expect(isCorrectSequence(correctItems, CORRECT_SEQUENCE)).toBe(true);
    expect(isCorrectSequence(SEQUENCE_CARDS, CORRECT_SEQUENCE)).toBe(false);
    expect(correctItems.map((item) => item.marker)).toEqual(['②', '⑤', '③', '①', '④']);
  });
});
