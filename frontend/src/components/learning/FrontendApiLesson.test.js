import { describe, expect, it } from 'vitest';
import {
  API_QUESTION_OPTIONS,
  COMPLETE_REQUEST_CODE,
  CORRECT_ENDPOINT_MATCHES,
  ENDPOINTS,
  ENDPOINT_ACTIONS,
  FULL_FLOW,
  HTTP_METHODS,
  LESSON_STEPS,
  MEMORY_ITEMS,
} from './FrontendApiLesson';
import {
  areEndpointMatchesCorrect,
  isApiInterpretationCorrect,
} from './frontendApiLessonUtils';

describe('Chapter 5 API 호출의 시작 교육 콘텐츠', () => {
  it('원고의 핵심 개념을 단계적으로 구성한다', () => {
    expect(LESSON_STEPS).toHaveLength(14);
    expect(LESSON_STEPS.map((step) => step.short)).toEqual([
      '화면만 바뀐 상태',
      'Client와 Server',
      'Request · Response',
      'API',
      'fetch()',
      'HTTP Method',
      'URL · ID',
      'JSON',
      '코드 읽기 미션',
      '기능 연결 미션',
      'OTC 코드 적용',
      'Response와 State',
      '전체 흐름',
      '필수 암기',
    ]);
  });

  it('필수 HTTP Method 네 가지의 역할을 정확히 연결한다', () => {
    expect(HTTP_METHODS.map(([method, action]) => [method, action])).toEqual([
      ['GET', '조회'],
      ['POST', '생성'],
      ['PATCH', '변경'],
      ['DELETE', '삭제'],
    ]);
  });

  it('코드 읽기 미션은 PATCH 주문 상태 변경만 정답으로 처리한다', () => {
    expect(API_QUESTION_OPTIONS).toHaveLength(4);
    expect(isApiInterpretationCorrect('patch-order-status')).toBe(true);
    expect(isApiInterpretationCorrect('get-all-orders')).toBe(false);
    expect(COMPLETE_REQUEST_CODE).toContain('method: "PATCH"');
    expect(COMPLETE_REQUEST_CODE).toContain('status: "COMPLETED"');
  });

  it('API와 화면 기능 매칭은 네 연결이 모두 맞아야 통과한다', () => {
    expect(ENDPOINTS).toHaveLength(4);
    expect(ENDPOINT_ACTIONS).toHaveLength(4);
    expect(areEndpointMatchesCorrect(CORRECT_ENDPOINT_MATCHES, CORRECT_ENDPOINT_MATCHES)).toBe(true);
    expect(areEndpointMatchesCorrect({ ...CORRECT_ENDPOINT_MATCHES, patch: 'remove' }, CORRECT_ENDPOINT_MATCHES)).toBe(false);
  });

  it('사용자 행동부터 서버 왕복과 화면 변경까지 전체 흐름을 포함한다', () => {
    expect(FULL_FLOW).toEqual([
      '사용자',
      '버튼 클릭',
      'Event',
      'Event Handler',
      'API 호출',
      'HTTP Request',
      'Server 처리',
      'HTTP Response',
      'State 변경',
      'Re-rendering',
      'DOM 반영',
      '화면 변경',
    ]);
  });

  it('최종 암기 카드 여덟 개를 제공한다', () => {
    expect(MEMORY_ITEMS.map(([concept]) => concept)).toEqual([
      'Client',
      'Server',
      'API',
      'Request',
      'Response',
      'HTTP Method',
      'JSON',
      'fetch()',
    ]);
  });
});
