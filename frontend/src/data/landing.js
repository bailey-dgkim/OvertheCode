/**
 * 랜딩 화면 콘텐츠.
 * 문구가 곧 이 서비스의 주장이라 컴포넌트와 분리해 둔다.
 */

export const landingHero = {
  eyebrow: 'Over the Code',
  title: ['코드 너머,', '그 심연으로'],
  subtitle: '기능을 만드는 법이 아니라, 시스템을 책임지는 법을 배웁니다.',
  cta: '시작하기',
  scrollHint: '아래로 내려서 더 알아보기',
};

/** 두 번째 섹션 — 이 서비스가 존재하는 이유 */
export const landingManifesto = [
  {
    id: 'anyone-can-build',
    lead: '누구나 개발할 수 있게 됐습니다.',
    body: '하지만 누구나 운영할 수 있는 것은 아닙니다.',
  },
  {
    id: 'ai-writes-code',
    lead: 'AI가 코드를 대신 써줍니다.',
    body: '그렇다고 좋은 개발자의 사고방식까지 갖게 되는 것은 아닙니다.',
  },
  {
    id: 'what-companies-want',
    lead: '대부분의 회사가 당신에게 요구하는 것은',
    body: '새 코드를 짜는 일보다, 기능을 만들기 위해 좋은 질문을 던지는 방식과 이미 돌아가고 있는 코드를 지켜내는 일입니다.',
  },
];

/** 세 번째 섹션 — 두 개의 트랙 예고 */
export const landingTracks = [
  {
    id: 'development',
    headline: '좋은 개발자의 사고방식을 학습하세요',
    description:
      '요구사항을 분석하고, 화면과 API와 테이블로 옮기고, 배포까지 준비하는 과정을 따라갑니다.',
    trackLabel: '개발 트랙',
    status: 'comingSoon',
    statusLabel: '준비 중',
  },
  {
    id: 'operation',
    headline: '실무에서 마주하는 운영 이슈를 트러블슈팅 하세요',
    description:
      '중복 저장, 로그인 유실, 동시 수정 충돌, 성능 저하, 운영 장애를 직접 파고들며 해결합니다.',
    trackLabel: '운영 트랙',
    status: 'available',
    statusLabel: '학습 가능',
  },
];

export const landingClosing = {
  title: '이제, 시작해볼까요?',
  cta: '시작하기',
};
