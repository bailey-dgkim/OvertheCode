/** @typedef {import('../types/learning.js').CaseSummary} CaseSummary */

/**
 * 운영 트랙 케이스 목록(카드용 메타 데이터).
 * 상세 학습 콘텐츠는 cases/operation-NN.json에 분리해 둔다.
 * 새 케이스를 열 때는 상세 파일을 추가하고 여기 status만 'available'로 바꾼다.
 *
 * @type {CaseSummary[]}
 */
export const operationCases = [
  {
    id: 'operation-01',
    track: 'operation',
    number: '01',
    title: '저장 버튼을 두 번 눌렀더니 주문이 두 건 생성되었습니다',
    description: '중복 요청, 멱등성, 동시성, DB 제약조건을 학습합니다.',
    difficulty: '초급',
    estimatedMinutes: 10,
    keywords: ['중복 요청', '멱등성', 'Unique Constraint', '동시성'],
    status: 'available',
  },
  {
    id: 'operation-02',
    track: 'operation',
    number: '02',
    title: '로그인했는데 다음 화면에서 다시 로그아웃됩니다',
    description: 'HTTP Stateless, Cookie, Session, JWT, Load Balancer를 학습합니다.',
    difficulty: '초급',
    estimatedMinutes: 12,
    keywords: ['HTTP', 'Cookie', 'Session', 'JWT', 'Redis'],
    status: 'available',
  },
  {
    id: 'operation-03',
    track: 'operation',
    number: '03',
    title: '두 사용자가 수정하자 먼저 저장한 내용이 사라졌습니다',
    description: 'Race Condition, Optimistic Lock, Version Column을 학습합니다.',
    difficulty: '중급',
    estimatedMinutes: 12,
    keywords: ['동시성', 'Optimistic Lock', 'Version'],
    status: 'available',
  },
  {
    id: 'operation-04',
    track: 'operation',
    number: '04',
    title: '대용량 엑셀 업로드 후 서버가 멈췄습니다',
    description: 'Heap, Streaming, Batch Insert, Queue, Worker를 학습합니다.',
    difficulty: '중급',
    estimatedMinutes: 15,
    keywords: ['Heap', 'Stream', 'Batch', 'Queue', 'S3'],
    status: 'available',
  },
  {
    id: 'operation-05',
    track: 'operation',
    number: '05',
    title: '이메일 발송 때문에 주문 저장 화면이 느려졌습니다',
    description: '동기·비동기, 메시지 큐, Producer, Consumer를 학습합니다.',
    difficulty: '중급',
    estimatedMinutes: 15,
    keywords: ['Async', 'Queue', 'Producer', 'Consumer', 'DLQ'],
    status: 'available',
  },
  {
    id: 'operation-06',
    track: 'operation',
    number: '06',
    title: '다른 딜러의 주문이 조회됩니다',
    description: '인증, 인가, 신뢰 경계, RBAC를 학습합니다.',
    difficulty: '중급',
    estimatedMinutes: 12,
    keywords: ['Authorization', 'RBAC', 'Trust Boundary', 'Audit'],
    status: 'available',
  },
  {
    id: 'operation-07',
    track: 'operation',
    number: '07',
    title: '로컬에서는 되는데 운영 배포 후 API가 호출되지 않습니다',
    description: '환경변수, DNS, Port, CORS, Security Group을 학습합니다.',
    difficulty: '중급',
    estimatedMinutes: 15,
    keywords: ['DNS', 'Port', 'CORS', 'EC2', 'CloudFront'],
    status: 'available',
  },
  {
    id: 'operation-08',
    track: 'operation',
    number: '08',
    title: '운영에서 간헐적으로 500 오류가 발생합니다',
    description: '로그, 메트릭, Correlation ID, Connection Pool을 학습합니다.',
    difficulty: '고급',
    estimatedMinutes: 18,
    keywords: ['Logging', 'Metric', 'APM', 'Connection Pool'],
    status: 'available',
  },
  {
    id: 'operation-09',
    track: 'operation',
    number: '09',
    title: '거의 바뀌지 않는 코드 목록 조회가 느립니다',
    description: 'Cache Hit, Cache Miss, Redis, TTL, Cache Invalidation을 학습합니다.',
    difficulty: '중급',
    estimatedMinutes: 12,
    keywords: ['Cache', 'Redis', 'TTL', 'Consistency'],
    status: 'available',
  },
  {
    id: 'operation-10',
    track: 'operation',
    number: '10',
    title: '통계 화면을 열 때마다 30초 이상 걸립니다',
    description: 'Batch, 사전 집계, 집계 테이블, Scheduler를 학습합니다.',
    difficulty: '중급',
    estimatedMinutes: 15,
    keywords: ['Batch', 'GROUP BY', 'Scheduler', 'Idempotent Job'],
    status: 'available',
  },
];

export const CASE_COMING_SOON_MESSAGE = '이 케이스는 준비 중입니다';

export function findCaseSummary(caseId) {
  return operationCases.find((item) => item.id === caseId) ?? null;
}
