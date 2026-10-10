import { describe, expect, it } from 'vitest';
import { LESSON_STEPS, MEMORY_ITEMS } from './FrontendBrowserLesson';

describe('Chapter 2 교육 콘텐츠', () => {
  it('중복을 덜어낸 학습 순서와 실제 코드 추적을 제공한다', () => {
    expect(LESSON_STEPS.map((step) => step.short)).toEqual([
      'HTML에서 화면',
      'DOM',
      'React의 위치',
      'Component',
      'JSX · .jsx',
      '렌더링',
      '화면에서 찾기',
      'OTC 코드 추적',
      '필수 암기',
    ]);
  });

  it('필수 암기 아홉 개념을 빠짐없이 제공한다', () => {
    expect(MEMORY_ITEMS).toEqual([
      ['Browser', '웹 코드를 해석·실행하고 화면을 제공하는 프로그램'],
      ['HTML', '웹페이지의 구조'],
      ['CSS', '웹페이지의 모양'],
      ['JavaScript', '웹페이지의 동작을 구현하는 프로그래밍 언어'],
      ['DOM', '브라우저가 웹페이지를 구조화해서 표현한 것'],
      ['React', 'JavaScript로 UI를 만들기 위한 라이브러리'],
      ['Component', 'React에서 UI를 구성하는 단위'],
      ['JSX', 'JavaScript 안에서 UI 구조를 표현하는 문법'],
      ['.jsx', 'JSX를 포함한 JavaScript 파일에 흔히 사용하는 확장자'],
    ]);
  });
});
