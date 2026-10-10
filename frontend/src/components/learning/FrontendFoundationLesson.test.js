import { describe, expect, it } from 'vitest';
import {
  DESIGN_ANSWERS,
  DESIGN_MISSION_ITEMS,
  FOUNDATION_FLOW,
  LESSON_STEPS,
  MEMORY_ITEMS,
  ROLE_ANSWERS,
  ROLE_MISSION_ITEMS,
  TECHNOLOGY_ANSWERS,
  TECHNOLOGY_MISSION_ITEMS,
  TECHNOLOGY_ROLES,
} from './FrontendFoundationLesson';
import { areLessonMatchesCorrect } from './frontendFoundationLessonUtils';

describe('Chapter 1 User, Client, Frontend 교육 콘텐츠', () => {
  it('큰 그림부터 세 미션과 다음 Chapter 연결까지 11단계로 구성한다', () => {
    expect(LESSON_STEPS).toHaveLength(11);
    expect(LESSON_STEPS.map((step) => step.short)).toEqual([
      '그림일까, 프로그램일까?',
      'User',
      'Client',
      '미션 · 역할 찾기',
      'Frontend의 위치',
      '디자인과 실행 화면',
      '미션 · 화면 구분',
      'HTML · CSS · JS',
      '미션 · 수정 위치',
      '필수 암기',
      '다음 질문',
    ]);
  });

  it('User, Client, Frontend 역할을 정확히 구분한다', () => {
    expect(ROLE_MISSION_ITEMS).toHaveLength(3);
    expect(ROLE_ANSWERS).toEqual({ person: 'user', chrome: 'client', 'react-code': 'frontend' });
    expect(areLessonMatchesCorrect(ROLE_ANSWERS, ROLE_ANSWERS)).toBe(true);
    expect(areLessonMatchesCorrect({ ...ROLE_ANSWERS, chrome: 'user' }, ROLE_ANSWERS)).toBe(false);
  });

  it('디자인과 실행되는 화면 미션의 정답을 제공한다', () => {
    expect(DESIGN_MISSION_ITEMS).toHaveLength(2);
    expect(DESIGN_ANSWERS).toEqual({ figma: 'design', chrome: 'running' });
  });

  it('HTML, CSS, JavaScript의 역할과 수정 위치를 연결한다', () => {
    expect(TECHNOLOGY_ROLES.map(([technology, , role]) => [technology, role])).toEqual([
      ['HTML', '화면의 구조'],
      ['CSS', '화면의 모양'],
      ['JavaScript', '화면의 동작'],
    ]);
    expect(TECHNOLOGY_MISSION_ITEMS).toHaveLength(3);
    expect(TECHNOLOGY_ANSWERS).toEqual({ structure: 'html', style: 'css', behavior: 'javascript' });
  });

  it('최종 암기 카드 여섯 개와 위치 관계를 제공한다', () => {
    expect(MEMORY_ITEMS.map(([concept]) => concept)).toEqual([
      'User',
      'Client',
      'Browser',
      'Frontend',
      'HTML · CSS · JavaScript',
      'React',
    ]);
    expect(FOUNDATION_FLOW).toEqual([
      '사용자 User',
      '클라이언트 Client',
      '브라우저 Browser',
      'Frontend 코드 실행',
      '사용자가 보는 화면',
    ]);
  });
});
