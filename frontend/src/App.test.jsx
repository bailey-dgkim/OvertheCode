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
  it('47개 Chapter를 Part별 순서대로 제공한다', () => {
    const parts = curriculumRepository.listParts();

    expect(curriculumRepository.listChapters()).toHaveLength(47);
    expect(parts.map((part) => curriculumRepository.listChapters(part.id).length))
      .toEqual([5, 5, 5, 5, 5, 5, 5, 6, 6]);
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

  it('Part 1은 교육 범위와 5개 Chapter만 간결하게 보여준다', () => {
    const html = renderAt('/parts/frontend');

    expect(html).toContain('&quot;나 이런 화면 하나 만들어줘&quot; 뒤에서 벌어지고 있는 수많은 일들');
    expect(html).toContain('교육 범위');
    expect(html).toContain('5개 Chapter');
    expect(html).toContain('프론트엔드는 어디에서 실행될까?');
    expect(html).toContain('화면 코드는 어디에 있을까?');
    expect(html).toContain('화면과 상태');
    expect(html).toContain('사용자 입력');
    expect(html).toContain('API 호출의 시작');
    expect(html).toContain('cv2-foundation-badge');
    expect(html).toContain('기초');
    expect(html).toContain('프론트엔드 인증 퀴즈');
    expect(html).toContain('/parts/frontend/quiz');
    expect(html).toContain('cv2-chapter-card__badges');
    expect(html).toContain('cv2-chapter-card__info');
    expect(html).toContain('핵심 질문');
    expect(html).toContain('학습 구성');
    expect(html).toContain('Chapter 시작');
    expect(html).toContain('/chapters/frontend-components/learn');
    expect(html).not.toContain('AI가 만든 주문 화면에서 사용자에게 보이는 요소와 그것을 그리는 Component를 연결합니다.');
    expect(html).not.toContain('대표 시스템 영역');
    expect(html).not.toContain('Core Question');
    expect(html).not.toContain('이미 가진 역량과 연결');
    expect(html).toContain('화면에 보이는 요소, 브라우저가 기억하는 상태');
    expect(html).not.toContain('깜빡이 학습 · 동일 개념 3회 연속');
    expect(html).toContain('11개 학습 단계 · 35분');
    expect(html).not.toContain('학습 목표');
  });

  it('프론트엔드 인증 퀴즈 소개 화면을 제공한다', () => {
    const html = renderAt('/parts/frontend/quiz');

    expect(html).toContain('화면을 보고');
    expect(html).toContain('수정 위치를 찾아라');
    expect(html).toContain('주문 관리 프로젝트');
    expect(html).toContain('macOS 주문 관리 앱');
    expect(html).toContain('cv2-order-card');
    expect(html).toContain('15개');
    expect(html).toContain('12문항 이상');
    expect(html).toContain('인증 퀴즈 시작');
  });

  it('Chapter 2 주소에서 중간 화면 없이 본 학습을 시작한다', () => {
    const html = renderAt('/chapters/frontend-state-events');

    expect(html).toContain('HTML을 화면으로 만드는 과정');
    expect(html).toContain('브라우저는 받은 HTML을 해석해서 화면을 만듭니다.');
    expect(html).not.toContain('브라우저를 다시 생각해보기');
  });

  it('Chapter 1에서 User와 Client의 위치를 배우는 학습 플레이어를 제공한다', () => {
    const directHtml = renderAt('/chapters/frontend-components');
    const lessonHtml = renderAt('/chapters/frontend-components/learn');

    expect(directHtml).toContain('AI가 만든 주문 화면은 그냥 그림일까?');
    expect(directHtml).not.toContain('Chapter 시작하기');
    expect(lessonHtml).toContain('AI가 만든 주문 화면은 그냥 그림일까?');
    expect(lessonHtml).toContain('상세보기');
    expect(lessonHtml).toContain('1 / 11');
    expect(lessonHtml).toContain('미션 · 역할 찾기');
    expect(lessonHtml).toContain('미션 · 화면 구분');
    expect(lessonHtml).toContain('미션 · 수정 위치');
    expect(lessonHtml).toContain('필수 암기');
    expect(lessonHtml).not.toContain('학습 콘텐츠 준비 중');
  });

  it('Chapter 2 본 학습 화면을 제공한다', () => {
    const html = renderAt('/chapters/frontend-state-events/learn');

    expect(html).toContain('HTML을 화면으로 만드는 과정');
    expect(html).toContain('브라우저는 받은 HTML을 해석해서 화면을 만듭니다.');
    expect(html).toContain('1 / 9');
    expect(html).toContain('OTC 코드 추적');
    expect(html).toContain('React의 위치');
    expect(html).toContain('JSX · .jsx');
    expect(html).toContain('필수 암기');
    expect(html).not.toContain('대화');
    expect(html).not.toContain('학습 콘텐츠 준비 중');
  });

  it('Chapter 3에서 화면과 상태 학습 플레이어를 제공한다', () => {
    const directHtml = renderAt('/chapters/browser-and-server-state');
    const lessonHtml = renderAt('/chapters/browser-and-server-state/learn');

    expect(directHtml).toContain('같은 Component인데 화면은 왜 달라질까?');
    expect(directHtml).not.toContain('Chapter 시작하기');
    expect(lessonHtml).toContain('같은 Component인데 화면은 왜 달라질까?');
    expect(lessonHtml).toContain('배송 준비중');
    expect(lessonHtml).toContain('배송 완료');
    expect(lessonHtml).toContain('1 / 13');
    expect(lessonHtml).toContain('미션 · status');
    expect(lessonHtml).toContain('미션 · itemCount');
    expect(lessonHtml).toContain('필수 암기');
    expect(lessonHtml).not.toContain('학습 콘텐츠 준비 중');
  });

  it('Chapter 4에서 사용자 입력 학습 플레이어를 제공한다', () => {
    const directHtml = renderAt('/chapters/frontend-review');
    const lessonHtml = renderAt('/chapters/frontend-review/learn');

    expect(directHtml).toContain('버튼 클릭과 State 변경 사이에는 무엇이 있을까?');
    expect(directHtml).not.toContain('Chapter 시작하기');
    expect(lessonHtml).toContain('버튼 클릭과 State 변경 사이에는 무엇이 있을까?');
    expect(lessonHtml).toContain('배송 완료 처리');
    expect(lessonHtml).toContain('1 / 11');
    expect(lessonHtml).toContain('Event Handler');
    expect(lessonHtml).toContain('실행 순서 미션');
    expect(lessonHtml).toContain('Event Object');
    expect(lessonHtml).not.toContain('학습 콘텐츠 준비 중');
  });

  it('Chapter 5에서 API 호출의 시작 학습 플레이어를 제공한다', () => {
    const directHtml = renderAt('/chapters/frontend-api-call');
    const lessonHtml = renderAt('/chapters/frontend-api-call/learn');

    expect(directHtml).toContain('배송 완료로 보이는데, 정말 주문 데이터도 바뀌었을까?');
    expect(directHtml).not.toContain('Chapter 시작하기');
    expect(lessonHtml).toContain('배송 완료로 보이는데, 정말 주문 데이터도 바뀌었을까?');
    expect(lessonHtml).toContain('새로고침 시뮬레이션');
    expect(lessonHtml).toContain('1 / 14');
    expect(lessonHtml).toContain('Request · Response');
    expect(lessonHtml).toContain('코드 읽기 미션');
    expect(lessonHtml).toContain('HTTP Method');
    expect(lessonHtml).not.toContain('학습 콘텐츠 준비 중');
  });

  it('준비 중인 Chapter도 중간 화면 없이 준비 안내로 이동한다', () => {
    const html = renderAt('/chapters/runtime-basics');

    expect(html).toContain('학습 콘텐츠 준비 중');
    expect(html).toContain('Part로 돌아가기');
    expect(html).not.toContain('Chapter 시작하기');
  });

  it('마지막 Chapter도 중간 화면 없이 준비 안내로 이동한다', () => {
    const html = renderAt('/chapters/backup-and-recovery');

    expect(html).toContain('학습 콘텐츠 준비 중');
    expect(html).toContain('Part로 돌아가기');
    expect(html).not.toContain('Chapter 시작하기');
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
    expect(html).toContain('Part로 돌아가기');
  });
});
