import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';
import { curriculumRepository } from './content/v2';

function renderAt(path) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('V2 화면 주소', () => {
  it('46개 Chapter를 Part별 순서대로 제공한다', () => {
    const parts = curriculumRepository.listParts();

    expect(curriculumRepository.listChapters()).toHaveLength(46);
    expect(parts.map((part) => curriculumRepository.listChapters(part.id).length))
      .toEqual([5, 4, 5, 5, 5, 5, 5, 6, 6]);
  });

  it('커리큘럼 홈에서 Part 0과 여덟 교육 Part를 보여준다', () => {
    const html = renderAt('/curriculum');

    expect(html).toContain('개발 작업 공간');
    expect(html).toContain('프론트엔드');
    expect(html).toContain('데이터');
    expect(html).toContain('중간계층 애플리케이션');
    expect(html).toContain('서버·실행 환경');
    expect(html).toContain('빌드·배포');
    expect(html).toContain('네트워크');
    expect(html).toContain('규모 확장');
    expect(html).toContain('운영과 장애');
  });

  it('Part 0 상세에서 시험 이관된 설명을 보여준다', () => {
    const html = renderAt('/parts/workspace');

    expect(html).toContain('소스코드는 어디에 있고, 터미널은 무엇을 하는 걸까?');
    expect(html).toContain('교육 범위');
    expect(html).toContain('파일·폴더');
    expect(html).toContain('이미 가진 역량과 연결');
    expect(html).toContain('이 Part를 마치면');
    expect(html).toContain('설명만 제공');
    expect(html).toContain('소스코드도 폴더 안에 있는 파일이다');
    expect(html).toContain('5개 설명');
    expect(html).toContain('내용 설계 중');
  });

  it('Part 4 상세에서 기존 runtime Chapter 주소를 보존한다', () => {
    const html = renderAt('/parts/runtime');

    expect(html).toContain('내 컴퓨터에서 실행되는 프로그램을 다른 사람도 쓰게 하려면?');
    expect(html).toContain('Runtime');
    expect(html).toContain('프로젝트 운영 관점으로 실행 조건과 담당 범위를 명확히 하고');
    expect(html).toContain('코드와 실행 중인 프로그램은 무엇이 다를까?');
    expect(html).toContain('/chapters/runtime-basics');
  });

  it('Part 1에서 반복 학습 설계를 보여준다', () => {
    const html = renderAt('/parts/frontend');

    expect(html).toContain('깜빡이 학습 · 동일 개념 3회 연속');
    expect(html).toContain('같은 문제와 같은 답안으로 3회 연속 정답이면 암기 완료입니다.');
  });

  it('Chapter 입구에서 핵심 질문과 연결된 시스템 지도를 보여준다', () => {
    const html = renderAt('/chapters/runtime-basics');

    expect(html).toContain('파일이 존재하는데 왜 서비스는 동작하지 않는가?');
    expect(html).toContain('Source Code');
    expect(html).toContain('11개 영역');
    expect(html).toContain('62개 요소');
    expect(html).toContain('7개 연결 강조');
    expect(html).toContain('data-node-state="primary"');
    expect(html).toContain('이번 Chapter에서 따라갈 연결');
    expect(html).not.toContain('맵 준비 중');
    expect(html).toContain('Chapter 시작하기 · 준비 중');
  });

  it('마지막 Chapter 개요와 시스템 지도를 보여준다', () => {
    const html = renderAt('/chapters/backup-and-recovery');

    expect(html).toContain('백업이 존재한다는 것만으로 복구할 수 있는가?');
    expect(html).toContain('62개 요소');
    expect(html).toContain('Chapter 시작하기 · 준비 중');
  });

  it('잘못된 주소에는 찾을 수 없다는 안내를 보여준다', () => {
    const html = renderAt('/does-not-exist');

    expect(html).toContain('페이지를 찾을 수 없습니다');
    expect(html).toContain('커리큘럼 홈으로');
  });

  it('내용이 비어 있는 Chapter 학습 주소에는 준비 안내를 보여준다', () => {
    const html = renderAt('/chapters/runtime-basics/learn');

    expect(html).toContain('학습 콘텐츠 준비 중');
    expect(html).toContain('공통 학습 화면은 준비되었습니다');
    expect(html).toContain('Chapter 소개로 돌아가기');
  });
});
