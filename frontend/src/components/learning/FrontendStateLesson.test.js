import { describe, expect, it } from 'vitest';
import {
  LESSON_STEPS,
  MEMORY_ITEMS,
  PRACTICE_MISSIONS,
  STATE_FLOW,
} from './FrontendStateLesson';

describe('Chapter 3 화면과 상태 교육 콘텐츠', () => {
  it('이해, 실습, 실제 코드 적용과 다음 Chapter 연결을 제공한다', () => {
    expect(LESSON_STEPS.map((step) => step.short)).toEqual([
      '같은 Component',
      '구조와 값',
      '변수의 함정',
      'useState 해부',
      '변경의 흐름',
      'Variable vs State',
      'Component + State',
      '미션 · status',
      '미션 · itemCount',
      'Props',
      'OTC 코드 적용',
      '필수 암기',
      '다음 질문',
    ]);
  });

  it('State가 화면으로 반영되는 순서를 유지한다', () => {
    expect(STATE_FLOW).toEqual([
      'State 변경',
      'React re-rendering',
      'DOM 반영',
      '화면 변경',
    ]);
  });

  it('두 실습에서 서로 다른 State와 화면 영역을 연결한다', () => {
    expect(PRACTICE_MISSIONS).toEqual([
      expect.objectContaining({
        command: 'setStatus("배송 완료");',
        correctArea: 'status',
      }),
      expect.objectContaining({
        command: 'setItemCount(4);',
        correctArea: 'itemCount',
      }),
    ]);
  });

  it('최종 암기 카드 여섯 개념을 빠짐없이 제공한다', () => {
    expect(MEMORY_ITEMS.map(([concept]) => concept)).toEqual([
      'Variable',
      'State',
      'useState()',
      'setState 계열 함수',
      'Props',
      'Re-rendering',
    ]);
  });
});
