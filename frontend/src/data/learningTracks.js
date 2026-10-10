/** @typedef {import('../types/learning.js').Track} Track */

/** @type {Track[]} */
export const learningTracks = [
  {
    id: 'development',
    title: '개발',
    description: '새로운 요구사항을 분석하고 기능을 처음부터 설계하고 구현합니다.',
    examples: [
      '화면 구현',
      'API 설계',
      'Service 로직 작성',
      'DB 테이블 설계',
      '테스트 작성',
      '배포 준비',
    ],
    status: 'comingSoon',
    statusLabel: '준비 중',
  },
  {
    id: 'operation',
    title: '운영',
    description: '이미 운영 중인 시스템에서 발생하는 문제를 분석하고 해결합니다.',
    examples: [
      '중복 저장',
      '로그인 상태 유실',
      '동시 수정 충돌',
      '성능 저하',
      '권한 오류',
      '배포 장애',
      '운영 장애',
    ],
    status: 'available',
    statusLabel: '학습 가능',
  },
  {
    id: 'improve',
    title: '개선',
    description: '이미 있는 코드를 읽고, 어디를 어떻게 바꿔야 하는지 찾아 안전하게 수정합니다.',
    examples: [
      '화면과 코드 연결',
      '컴포넌트 찾기',
      '코드 구조 읽기',
      '레거시 탐색',
    ],
    status: 'available',
    statusLabel: '학습 가능',
  },
  {
    id: 'basic',
    title: '기초',
    description: '실무가 익숙해졌다면, Java 문법·자료구조·알고리즘으로 한 단계 깊이 내려갑니다.',
    examples: [
      'Java 문법',
      '자료구조',
      '알고리즘',
      '시간복잡도',
    ],
    status: 'available',
    statusLabel: '학습 가능',
  },
];

export const TRACK_COMING_SOON_MESSAGE = '개발 트랙은 준비 중입니다';
