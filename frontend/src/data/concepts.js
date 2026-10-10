/**
 * 개념 사전 — 모든 개념 정의의 단일 출처.
 *
 * 미션 콘텐츠(cases/operation-NN.json)는 개념을 id로만 참조하고,
 * 정의 문구는 여기에만 존재한다. 정의가 여러 곳에 갈라지면
 * 미션 화면과 사전 화면이 서로 다른 설명을 보여주게 된다.
 *
 * source.type
 *   'mission'   — 미션을 풀며 만나는 개념. 해당 케이스를 완료하면 '학습함'이 된다.
 *   'reference' — 미션과 무관하게 항상 참고할 수 있는 개념.
 */

export const DOMAINS = [
  { id: 'cs', label: 'CS' },
  { id: 'db', label: 'DB' },
  { id: 'network', label: 'Network' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'infra', label: 'Infra' },
];

/** Architecture 도메인 안에서의 하위 묶음 */
export const CONCEPT_GROUPS = {
  principle: '원칙',
  backendLayer: '백엔드 계층',
  frontendFolder: '프론트엔드 폴더',
};

const MISSION_01 = { type: 'mission', caseId: 'operation-01', label: '운영 케이스 01' };
const MISSION_02 = { type: 'mission', caseId: 'operation-02', label: '운영 케이스 02' };
const MISSION_03 = { type: 'mission', caseId: 'operation-03', label: '운영 케이스 03' };
const MISSION_04 = { type: 'mission', caseId: 'operation-04', label: '운영 케이스 04' };
const MISSION_05 = { type: 'mission', caseId: 'operation-05', label: '운영 케이스 05' };
const MISSION_06 = { type: 'mission', caseId: 'operation-06', label: '운영 케이스 06' };
const MISSION_07 = { type: 'mission', caseId: 'operation-07', label: '운영 케이스 07' };
const MISSION_08 = { type: 'mission', caseId: 'operation-08', label: '운영 케이스 08' };
const MISSION_09 = { type: 'mission', caseId: 'operation-09', label: '운영 케이스 09' };
const MISSION_10 = { type: 'mission', caseId: 'operation-10', label: '운영 케이스 10' };
const REFERENCE_LAYER = { type: 'reference', label: '계층과 책임 분리' };

export const concepts = [
  /* ---------- CS ---------- */
  {
    id: 'idempotency',
    name: '멱등성',
    domain: 'cs',
    definition:
      '같은 요청을 여러 번 실행해도 최종 결과가 한 번 실행한 것과 같도록 만드는 성질',
    example: '같은 주문 저장 요청이 세 번 들어와도 주문은 한 건만 생성된다',
    source: MISSION_01,
  },
  {
    id: 'race-condition',
    name: 'Race Condition',
    domain: 'cs',
    definition:
      '여러 작업이 같은 자원에 동시에 접근하면서 실행 순서에 따라 결과가 달라지는 문제',
    example: '두 요청이 동시에 중복 여부를 확인해 둘 다 주문이 없다고 판단한다',
    source: MISSION_01,
  },

  {
    id: 'password-hash',
    name: '비밀번호 해시',
    domain: 'cs',
    definition:
      '원문을 복원할 수 없는 형태로 변환해 저장하고, 검증할 때는 같은 방식으로 변환한 값끼리 비교하는 방법',
    example: 'DB가 유출되어도 저장된 값에서 원래 비밀번호를 되돌릴 수 없다',
    source: MISSION_02,
  },
  {
    id: 'heap-memory',
    name: '힙 메모리',
    domain: 'cs',
    definition:
      '애플리케이션이 실행 중에 데이터를 올려두는 공간. 한계를 넘으면 프로세스가 느려지거나 죽는다.',
    example: '10만 건짜리 파일을 통째로 올리면 힙이 가득 차 서비스가 멈춘다',
    source: MISSION_04,
  },
  {
    id: 'streaming',
    name: '스트리밍 처리',
    domain: 'cs',
    definition:
      '데이터 전체를 메모리에 올리지 않고 일정 단위로 나눠 읽으며 처리하는 방식',
    example: '엑셀 파일을 한 줄씩 읽어 처리하면 파일 크기와 무관하게 메모리 사용량이 일정하다',
    source: MISSION_04,
  },

  {
    id: 'sync-async',
    name: '동기와 비동기',
    domain: 'cs',
    definition:
      '동기는 작업이 끝날 때까지 기다렸다가 다음으로 넘어가고, 비동기는 기다리지 않고 먼저 진행하는 방식',
    example: '주문 저장이 메일 발송 완료를 기다리면 사용자도 그만큼 기다리게 된다',
    source: MISSION_05,
  },
  {
    id: 'trust-boundary',
    name: '신뢰 경계',
    domain: 'cs',
    definition:
      '내가 통제할 수 있는 영역과 그럴 수 없는 영역의 경계. 경계 밖에서 온 값은 검증 대상이지 근거가 아니다.',
    example: '브라우저에서 실행되는 코드와 그 코드가 보내는 값은 사용자가 마음대로 바꿀 수 있다',
    forbidden: '클라이언트가 보낸 값을 권한이나 금액 판단의 근거로 쓰는 것',
    source: MISSION_06,
  },
  {
    id: 'port-process',
    name: '프로세스와 포트',
    domain: 'cs',
    definition:
      '서버 프로그램은 프로세스로 실행되고, 특정 포트 번호로 들어오는 요청을 받는다',
    example: 'Spring Boot가 8080 포트로 떠 있어도 그 포트가 외부에 열려 있지 않으면 접속할 수 없다',
    source: MISSION_07,
  },

  {
    id: 'resource-leak',
    name: '자원 반환 누락',
    domain: 'cs',
    definition:
      '빌려 쓴 자원(커넥션, 파일, 스레드)을 다 쓰고 돌려주지 않아 사용할 수 있는 양이 점점 줄어드는 문제',
    example: '요청마다 커넥션을 반환하지 않으면 시간이 지날수록 남은 커넥션이 없어진다',
    forbidden: '자원을 늘려 증상을 미루는 것 — 누수는 그대로라 다시 고갈된다',
    source: MISSION_08,
  },
  {
    id: 'cache-hit-miss',
    name: 'Cache Hit / Miss',
    domain: 'cs',
    definition:
      '찾는 값이 캐시에 있으면 Hit, 없어서 원본까지 가야 하면 Miss',
    example: 'Hit이면 메모리에서 즉시 반환하고, Miss면 DB를 조회한 뒤 캐시에 채워 넣는다',
    source: MISSION_09,
  },

  /* ---------- DB ---------- */
  {
    id: 'unique-constraint',
    name: 'Unique Constraint',
    domain: 'db',
    definition: 'DB에서 특정 컬럼 또는 컬럼 조합의 중복 저장을 허용하지 않는 규칙',
    example: '같은 주문번호를 가진 주문을 두 건 INSERT할 수 없게 한다',
    source: MISSION_01,
  },
  {
    id: 'data-integrity',
    name: '데이터 무결성',
    domain: 'db',
    definition: '데이터가 정해진 규칙에 맞게 정확하고 일관된 상태를 유지하는 것',
    example: '업무상 하나만 존재해야 하는 주문번호가 중복되지 않는다',
    source: MISSION_01,
  },

  {
    id: 'lost-update',
    name: '갱신 손실',
    domain: 'db',
    definition:
      '두 작업이 같은 데이터를 각자 읽은 뒤 순서대로 저장하면서, 먼저 저장된 변경이 조용히 덮어써지는 문제',
    example: '두 사용자가 같은 주문을 수정하자 먼저 저장한 사람의 내용이 사라진다',
    source: MISSION_03,
  },
  {
    id: 'optimistic-lock',
    name: '낙관적 락',
    domain: 'db',
    definition:
      '충돌이 드물다고 보고 잠그지 않되, 저장 시점에 값이 그대로인지 확인해 달라졌으면 실패시키는 방식',
    example: '읽을 때의 version을 함께 보내고 WHERE version = 3 이 일치할 때만 UPDATE한다',
    source: MISSION_03,
  },
  {
    id: 'pessimistic-lock',
    name: '비관적 락',
    domain: 'db',
    definition:
      '충돌이 잦다고 보고 데이터를 읽는 시점에 잠가서 다른 작업을 기다리게 하는 방식',
    example: 'SELECT ... FOR UPDATE로 행을 잠그면 다른 요청은 잠금이 풀릴 때까지 대기한다',
    forbidden: '잠금 구간이 길어지면 대기와 교착이 늘어난다',
    source: MISSION_03,
  },
  {
    id: 'batch-insert',
    name: 'Batch Insert',
    domain: 'db',
    definition: '여러 행을 한 번의 요청으로 묶어 저장해 DB 왕복과 커밋 비용을 줄이는 방법',
    example: '10만 건을 한 건씩 넣는 대신 1천 건씩 묶어 100번에 나눠 넣는다',
    source: MISSION_04,
  },
  {
    id: 'transaction-scope',
    name: '트랜잭션 범위',
    domain: 'db',
    definition: '어디부터 어디까지를 하나의 성공·실패 단위로 묶을지 정하는 것',
    example: '10만 건을 한 트랜잭션으로 묶으면 마지막에 실패했을 때 전부 되돌려야 한다',
    forbidden: '트랜잭션 안에서 외부 API 호출이나 파일 처리 같은 오래 걸리는 작업',
    source: MISSION_04,
  },

  {
    id: 'connection-pool',
    name: 'Connection Pool',
    domain: 'db',
    definition:
      'DB 연결을 미리 만들어 두고 빌려주고 돌려받는 방식. 개수가 한정되어 있다.',
    example: '풀이 비면 새 요청은 연결을 얻지 못해 대기하다 타임아웃된다',
    counterpart: '자원 반환 누락',
    source: MISSION_08,
  },
  {
    id: 'pre-aggregation',
    name: '사전 집계',
    domain: 'db',
    definition:
      '자주 보는 통계를 미리 계산해 요약 테이블에 저장해두고, 조회 시에는 그 결과만 읽는 방식',
    example: '매일 새벽 전날 주문을 집계해두면 통계 화면은 요약 테이블만 조회한다',
    source: MISSION_10,
  },

  /* ---------- Network ---------- */
  {
    id: 'duplicate-request',
    name: '중복 요청',
    domain: 'network',
    definition:
      '사용자의 연속 클릭이나 네트워크 재시도로 동일한 요청이 서버에 여러 번 도달하는 상황',
    example: '응답이 늦어지자 클라이언트가 같은 저장 요청을 다시 보낸다',
    source: MISSION_01,
  },

  {
    id: 'http-stateless',
    name: 'HTTP 무상태',
    domain: 'network',
    definition:
      'HTTP는 각 요청을 독립적으로 처리하며 이전 요청을 기억하지 않는다는 성질',
    example: '로그인에 성공해도 다음 요청에는 그 사실이 담겨 있지 않아 서버가 알 수 없다',
    source: MISSION_02,
  },
  {
    id: 'session',
    name: '세션',
    domain: 'network',
    definition:
      '서버가 로그인 상태를 보관하고, 그 보관함을 가리키는 식별자만 쿠키로 주고받는 방식',
    example: '서버가 세션 ID를 쿠키로 내려주면 브라우저가 매 요청마다 자동으로 함께 보낸다',
    source: MISSION_02,
  },
  {
    id: 'jwt',
    name: 'JWT',
    domain: 'network',
    definition:
      '사용자 정보와 서명을 담은 토큰을 발급해, 서버가 상태를 보관하지 않고도 검증만으로 신원을 확인하는 방식',
    example: '서버가 토큰을 저장하지 않아도 서명이 유효하면 그 사용자로 인정한다',
    source: MISSION_02,
  },

  {
    id: 'timeout',
    name: 'Timeout',
    domain: 'network',
    definition: '응답을 언제까지 기다릴지 정해두고, 넘으면 포기하는 설정',
    example: '외부 API에 타임아웃이 없으면 상대가 느려질 때 내 서버까지 함께 멈춘다',
    source: MISSION_05,
  },
  {
    id: 'retry',
    name: '재시도',
    domain: 'network',
    definition: '일시적인 실패를 가정하고 일정 횟수까지 다시 시도하는 것',
    example: '네트워크 순단으로 실패한 메일 발송을 잠시 뒤 다시 시도한다',
    forbidden: '멱등하지 않은 작업을 무한정 재시도하는 것',
    counterpart: '멱등성',
    source: MISSION_05,
  },
  {
    id: 'cors',
    name: 'CORS',
    domain: 'network',
    definition:
      '브라우저가 현재 페이지와 다른 출처로 요청을 보낼 때, 서버가 허용했는지 확인하는 규칙',
    example: 'app.example.com에서 api.example.com을 부르려면 서버가 그 출처를 허용해야 한다',
    forbidden: '모든 출처를 허용해 열어두는 것',
    source: MISSION_07,
  },

  /* ---------- Architecture — 원칙 ---------- */
  {
    id: 'defense-in-depth',
    name: '다층 방어',
    domain: 'architecture',
    group: 'principle',
    definition:
      '한 계층에만 의존하지 않고 여러 계층에서 같은 문제를 단계적으로 방어하는 설계',
    example: 'Frontend → Backend → Database → Monitoring 순서로 중복 저장을 방지한다',
    source: MISSION_01,
  },
  {
    id: 'layer-dependency-direction',
    name: '계층 의존 방향',
    domain: 'architecture',
    group: 'principle',
    definition:
      'Controller → Service → Repository 한 방향으로만 의존한다. 역방향 참조는 금지한다.',
    example: 'Repository가 Service를 부르면 순환 참조가 생기고 단위 테스트가 불가능해진다',
    forbidden: '역방향 참조, 계층 건너뛰기(Controller가 Repository를 직접 호출)',
    source: REFERENCE_LAYER,
  },
  {
    id: 'separation-of-concerns',
    name: '관심사의 분리',
    domain: 'architecture',
    group: 'principle',
    definition: '하나의 모듈은 바뀌는 이유가 하나여야 한다는 원칙',
    example:
      '콘텐츠 오타를 고치는데 컴포넌트 파일까지 열어야 한다면 분리가 잘못된 것이다',
    source: REFERENCE_LAYER,
  },

  {
    id: 'authentication',
    name: '인증',
    domain: 'architecture',
    group: 'principle',
    definition: '요청을 보낸 사람이 누구인지 확인하는 일',
    example: '아이디와 비밀번호를 검증한 뒤 이후 요청에서 쓸 인증 수단을 발급한다',
    counterpart: '인가(무엇을 할 수 있는지)',
    source: MISSION_02,
  },
  {
    id: 'async-processing',
    name: '비동기 처리',
    domain: 'architecture',
    group: 'principle',
    definition:
      '오래 걸리는 작업을 요청 처리 흐름에서 떼어내 뒤에서 수행하고, 응답은 먼저 돌려주는 방식',
    example: '업로드 요청은 작업 등록까지만 하고 즉시 응답한 뒤 Worker가 실제 등록을 진행한다',
    source: MISSION_04,
  },

  {
    id: 'loose-coupling',
    name: '느슨한 결합',
    domain: 'architecture',
    group: 'principle',
    definition:
      '한쪽이 상대의 내부 사정을 몰라도 되도록 연결을 느슨하게 두는 설계',
    example: '주문 서비스는 알림이 이메일인지 문자인지 알 필요 없이 이벤트만 발행한다',
    source: MISSION_05,
  },
  {
    id: 'producer-consumer',
    name: 'Producer / Consumer',
    domain: 'architecture',
    group: 'principle',
    definition:
      '일을 만들어 큐에 넣는 쪽과 꺼내 처리하는 쪽을 분리하는 구조',
    example: '주문 서비스가 알림 이벤트를 발행하고, 별도 Consumer가 그것을 받아 메일을 보낸다',
    counterpart: '메시지 큐',
    source: MISSION_05,
  },
  {
    id: 'authorization',
    name: '인가',
    domain: 'architecture',
    group: 'principle',
    definition: '확인된 사용자가 이 데이터나 기능에 접근할 권리가 있는지 판단하는 일',
    example: '로그인한 딜러가 다른 지점의 주문까지 조회할 수 있는지 서버가 판단한다',
    counterpart: '인증(누구인지)',
    forbidden: '화면에서 버튼을 숨기는 것으로 대신하는 것',
    source: MISSION_06,
  },
  {
    id: 'rbac',
    name: 'RBAC',
    domain: 'architecture',
    group: 'principle',
    definition: '사용자에게 직접 권한을 주지 않고 역할에 권한을 부여한 뒤 역할을 배정하는 방식',
    example: '딜러 역할은 자기 지점만, 법인 관리자 역할은 전체 주문을 볼 수 있다',
    source: MISSION_06,
  },
  {
    id: 'environment-separation',
    name: '환경 분리',
    domain: 'architecture',
    group: 'principle',
    definition:
      '같은 코드가 개발·검증·운영에서 서로 다른 주소와 자원을 바라보도록 설정을 밖으로 빼두는 것',
    example: 'API 주소와 DB 접속 정보를 코드가 아니라 환경변수로 관리한다',
    forbidden: '주소나 접속 정보를 코드에 직접 적어두는 것',
    source: MISSION_07,
  },

  {
    id: 'correlation-id',
    name: 'Correlation ID',
    domain: 'architecture',
    group: 'principle',
    definition:
      '요청마다 고유한 식별자를 부여하고 모든 로그에 함께 남겨, 흩어진 기록을 하나의 흐름으로 묶는 방법',
    example: '실패한 요청의 ID로 검색하면 프론트·백엔드·DB 로그가 한 줄기로 이어진다',
    source: MISSION_08,
  },
  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker',
    domain: 'architecture',
    group: 'principle',
    definition:
      '특정 대상의 실패가 일정 수준을 넘으면 한동안 호출 자체를 중단해, 장애가 번지는 것을 막는 장치',
    example: '외부 결제 API가 계속 실패하면 잠시 호출을 끊어 우리 서버 스레드가 묶이지 않게 한다',
    counterpart: 'Timeout',
    source: MISSION_08,
  },
  {
    id: 'cache-aside',
    name: 'Cache Aside',
    domain: 'architecture',
    group: 'principle',
    definition:
      '캐시에 있으면 그대로 쓰고, 없으면 원본에서 읽어와 캐시에 채운 뒤 반환하는 방식',
    example: '코드 목록을 조회할 때 캐시를 먼저 보고, 없을 때만 DB를 읽는다',
    source: MISSION_09,
  },
  {
    id: 'cache-invalidation',
    name: '캐시 무효화',
    domain: 'architecture',
    group: 'principle',
    definition:
      '원본이 바뀌었을 때 캐시에 남은 옛 값을 지우거나 갱신해 주는 일',
    example: '관리자가 코드 목록을 수정하면 그 순간 해당 캐시를 함께 지운다',
    forbidden: '캐시를 넣기만 하고 지우는 시점을 정하지 않는 것',
    source: MISSION_09,
  },
  {
    id: 'oltp-olap-separation',
    name: '조회용 데이터 분리',
    domain: 'architecture',
    group: 'principle',
    definition:
      '실시간 업무 처리용 데이터와 분석·통계용 데이터를 분리해, 무거운 집계가 업무를 방해하지 않게 하는 것',
    example: '통계 화면은 원본 주문 테이블 대신 집계 테이블을 조회한다',
    source: MISSION_10,
  },

  /* ---------- Architecture — 백엔드 계층 ---------- */
  {
    id: 'layer-controller',
    name: 'Controller',
    domain: 'architecture',
    group: 'backendLayer',
    definition: 'HTTP를 아는 유일한 계층. 요청을 받아 응답으로 바꾼다.',
    forbidden: '업무 규칙, 조건 분기로 된 판단, SQL, 트랜잭션 경계',
    counterpart: 'components',
    source: REFERENCE_LAYER,
  },
  {
    id: 'layer-service',
    name: 'Service',
    domain: 'architecture',
    group: 'backendLayer',
    definition: '업무 규칙과 트랜잭션 경계를 담당한다.',
    forbidden: 'HttpServletRequest, 세션, 화면 전용 포맷팅, SQL',
    counterpart: 'hooks',
    source: REFERENCE_LAYER,
  },
  {
    id: 'layer-repository',
    name: 'Repository',
    domain: 'architecture',
    group: 'backendLayer',
    definition: '데이터 접근만 담당한다.',
    forbidden: '업무 판단(한도 초과면 거절 같은 규칙)',
    counterpart: 'api',
    source: REFERENCE_LAYER,
  },
  {
    id: 'layer-entity',
    name: 'Entity',
    domain: 'architecture',
    group: 'backendLayer',
    definition: 'DB 테이블의 모양을 표현하는 객체.',
    forbidden: 'API 응답으로 그대로 나가는 것 자체',
    counterpart: 'types',
    source: REFERENCE_LAYER,
  },
  {
    id: 'layer-dto',
    name: 'DTO',
    domain: 'architecture',
    group: 'backendLayer',
    definition: '계층과 시스템의 경계를 넘는 데이터의 모양.',
    forbidden: '업무 로직',
    counterpart: 'types',
    source: REFERENCE_LAYER,
  },

  /* ---------- Architecture — 프론트엔드 폴더 ---------- */
  {
    id: 'folder-components',
    name: 'components',
    domain: 'architecture',
    group: 'frontendFolder',
    definition: '보여주기와 사용자 입력 받기를 담당한다.',
    forbidden: '저장 로직, 직접 fetch 호출, 업무 규칙',
    counterpart: 'Controller',
    source: REFERENCE_LAYER,
  },
  {
    id: 'folder-hooks',
    name: 'hooks',
    domain: 'architecture',
    group: 'frontendFolder',
    definition: '화면과 무관한 상태와 로직을 담당한다.',
    forbidden: 'JSX, 특정 화면에서만 의미 있는 처리',
    counterpart: 'Service',
    source: REFERENCE_LAYER,
  },
  {
    id: 'folder-api',
    name: 'api',
    domain: 'architecture',
    group: 'frontendFolder',
    definition: '서버 통신만 담당한다.',
    forbidden: '화면 상태 변경',
    counterpart: 'Repository',
    source: REFERENCE_LAYER,
  },
  {
    id: 'folder-data',
    name: 'data',
    domain: 'architecture',
    group: 'frontendFolder',
    definition: '내용 — 무엇을 보여주고 가르치는가.',
    forbidden: '로직',
    source: REFERENCE_LAYER,
  },
  {
    id: 'folder-types',
    name: 'types',
    domain: 'architecture',
    group: 'frontendFolder',
    definition: '모양 — 데이터가 어떤 형태인가.',
    forbidden: '실행되는 코드 (빌드하면 사라져야 정상)',
    counterpart: 'Entity / DTO',
    source: REFERENCE_LAYER,
  },
  {
    id: 'folder-styles',
    name: 'styles',
    domain: 'architecture',
    group: 'frontendFolder',
    definition: '외형 — 어떤 모습으로 보이는가.',
    source: REFERENCE_LAYER,
  },

  /* ---------- Infra ---------- */
  {
    id: 'shared-session-store',
    name: '공유 세션 저장소',
    domain: 'infra',
    definition:
      '서버가 여러 대일 때 로그인 상태를 각 서버 메모리가 아닌 공용 저장소에 두어, 어느 서버가 요청을 받아도 같은 결과가 나오게 하는 것',
    example: '세션을 Redis에 저장하면 로드밸런서가 어느 서버로 보내든 로그인이 유지된다',
    source: MISSION_02,
  },
  {
    id: 'load-balancer',
    name: '로드밸런서',
    domain: 'infra',
    definition: '들어오는 요청을 여러 서버에 나눠 보내는 장치',
    example: '같은 사용자의 두 요청이 서로 다른 서버로 갈 수 있다',
    source: MISSION_02,
  },
  {
    id: 'apm',
    name: 'APM · 지표',
    domain: 'infra',
    definition:
      'CPU, 메모리, 응답시간, 커넥션 사용량처럼 시스템 상태를 수치로 관측하는 도구와 지표',
    example: '코드만 봐서는 알 수 없는 자원 고갈을 그래프 추이로 확인한다',
    source: MISSION_08,
  },
  {
    id: 'distributed-cache',
    name: '공유 캐시',
    domain: 'infra',
    definition:
      '서버마다 따로 두지 않고 모든 서버가 같은 캐시를 바라보게 하는 방식',
    example: 'Redis에 캐시를 두면 어느 서버가 응답해도 같은 값을 돌려준다',
    counterpart: '공유 세션 저장소',
    source: MISSION_09,
  },
  {
    id: 'ttl',
    name: 'TTL',
    domain: 'infra',
    definition: '저장된 값이 유효한 시간. 지나면 자동으로 만료된다.',
    example: 'TTL이 10분이면 원본이 바뀌어도 최대 10분간 옛 값이 나올 수 있다',
    forbidden: 'TTL만으로 일관성을 보장하려는 것',
    source: MISSION_09,
  },
  {
    id: 'scheduler',
    name: '스케줄러 · 배치',
    domain: 'infra',
    definition: '정해진 시각에 작업을 자동 실행하고 성공·실패를 관리하는 장치',
    example: '매일 새벽 2시에 전날 주문을 집계하고 결과를 운영에서 확인한다',
    source: MISSION_10,
  },
  {
    id: 'message-queue',
    name: '메시지 큐',
    domain: 'infra',
    definition:
      '보낸 쪽과 받는 쪽 사이에 두어, 처리 속도 차이를 흡수하고 일감을 임시 보관하는 장치',
    example: '메일 서버가 느려도 이벤트는 큐에 쌓이고 사용자 응답은 지연되지 않는다',
    source: MISSION_05,
  },
  {
    id: 'dead-letter-queue',
    name: 'Dead Letter Queue',
    domain: 'infra',
    definition: '정해진 횟수만큼 재시도해도 계속 실패하는 메시지를 따로 옮겨 격리하는 보관소',
    example: '수신 주소가 잘못된 메일은 큐를 막지 않도록 DLQ로 보내 나중에 분석한다',
    source: MISSION_05,
  },
  {
    id: 'audit-log',
    name: '감사 로그',
    domain: 'infra',
    definition: '누가 언제 어떤 데이터에 접근하거나 변경했는지 남기는 기록',
    example: '다른 지점 주문 조회 시도가 있었는지 사후에 추적할 수 있다',
    source: MISSION_06,
  },
  {
    id: 'firewall',
    name: '방화벽 · 보안 그룹',
    domain: 'infra',
    definition: '어떤 출발지에서 어떤 포트로 들어오는 접근을 허용할지 통제하는 규칙',
    example: '서버는 떠 있지만 8080 포트가 열려 있지 않아 외부에서 연결되지 않는다',
    source: MISSION_07,
  },
  {
    id: 'cdn',
    name: 'CDN',
    domain: 'infra',
    definition: '정적 파일을 사용자와 가까운 위치에 복사해 두고 전달하는 배포망',
    example: '빌드된 React 파일을 CloudFront로 배포해 어디서든 빠르게 받게 한다',
    source: MISSION_07,
  },
  {
    id: 'object-storage',
    name: '오브젝트 스토리지',
    domain: 'infra',
    definition:
      '파일을 애플리케이션 서버의 디스크가 아니라 별도의 공용 저장소에 두는 방식',
    example: '업로드 파일을 S3에 두면 어느 서버나 Worker가 꺼내 처리할 수 있다',
    source: MISSION_04,
  },
];

/** 백엔드 계층과 프론트엔드 폴더의 대응 관계 */
export const LAYER_MAP = [
  { backend: 'Controller', frontend: 'components', role: '바깥세상과 만나는 면' },
  { backend: 'Service', frontend: 'hooks', role: '판단과 상태' },
  { backend: 'Repository', frontend: 'api', role: '데이터를 가져오는 통로' },
  { backend: 'Entity / DTO', frontend: 'types', role: '데이터의 모양' },
];

/** 파일을 어디에 둘지 헷갈릴 때 던지는 질문 */
export const PLACEMENT_QUESTIONS = [
  {
    question: '화면이 완전히 바뀌어도 이 코드는 그대로인가?',
    answer: '그렇다면 Service / hooks',
  },
  {
    question: 'DB를 다른 제품으로 바꾸면 이 코드가 바뀌는가?',
    answer: '그렇다면 Repository / api',
  },
  {
    question: '이걸 고치면 다른 폴더도 같이 열어야 하나?',
    answer: '그렇다면 분리가 잘못된 것',
  },
];

export function findConcept(conceptId) {
  return concepts.find((concept) => concept.id === conceptId) ?? null;
}

/** 미션에서 참조하는 개념 목록을 사전 정의와 합쳐서 돌려준다. */
export function resolveConceptRefs(refs = []) {
  return refs
    .map((ref) => {
      const concept = findConcept(ref.id);
      return concept ? { ...concept, usedAt: ref.usedAt } : null;
    })
    .filter(Boolean);
}
