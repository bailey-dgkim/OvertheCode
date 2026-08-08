import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';

function renderAt(path) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('V2 화면 주소', () => {
  it('커리큘럼 홈에서 Part 5개를 보여준다', () => {
    const html = renderAt('/curriculum');

    expect(html).toContain('시스템을 읽는다');
    expect(html).toContain('올바르게 동작하게 만든다');
    expect(html).toContain('다른 시스템과 함께 동작한다');
    expect(html).toContain('규모와 장애를 다룬다');
    expect(html).toContain('운영에 전달하고 지킨다');
  });

  it('Part 상세에서 등록된 Chapter를 보여준다', () => {
    const html = renderAt('/parts/read-system');

    expect(html).toContain('코드가 프로그램이 되는 과정');
    expect(html).toContain('내용 설계 중');
  });

  it('Chapter 입구에서 핵심 질문과 연결된 시스템 지도를 보여준다', () => {
    const html = renderAt('/chapters/runtime-basics');

    expect(html).toContain('AI가 만들어준 코드는 어떻게 실행 중인 서비스가 되는가?');
    expect(html).toContain('Source Code');
    expect(html).toContain('10개 영역');
    expect(html).toContain('37개 요소');
    expect(html).toContain('7개 연결 강조');
    expect(html).toContain('data-node-state="primary"');
    expect(html).toContain('이번 Chapter에서 따라갈 연결');
    expect(html).not.toContain('맵 준비 중');
    expect(html).toContain('Chapter 시작하기 · 준비 중');
  });

  it('잘못된 주소에는 찾을 수 없다는 안내를 보여준다', () => {
    const html = renderAt('/does-not-exist');

    expect(html).toContain('페이지를 찾을 수 없습니다');
    expect(html).toContain('커리큘럼 홈으로');
  });
});
