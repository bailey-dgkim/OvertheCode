-- =========================================================
-- Over the Code V1 Seed Data
-- Initial content: API와 통신 > HTTP 기초
-- =========================================================

-- 실습용 초기화
-- seed를 여러 번 실행해도 중복이 덜 나도록 관련 데이터 삭제
-- 주의: 지금은 로컬 개발용이므로 괜찮음

DELETE FROM user_quiz_results;
DELETE FROM user_lesson_progress;
DELETE FROM user_term_progress;
DELETE FROM quiz_choices;
DELETE FROM quiz_questions;
DELETE FROM code_examples;
DELETE FROM lesson_terms;
DELETE FROM lessons;
DELETE FROM terms;
DELETE FROM modules;
DELETE FROM chapters;

-- =========================================================
-- Chapter
-- =========================================================

INSERT INTO chapters (
    id,
    title,
    description,
    display_order,
    is_active
) VALUES (
    1,
    'API와 통신',
    '웹 시스템에서 클라이언트와 서버가 데이터를 주고받는 방식, HTTP, REST API, 요청/응답 구조를 학습한다.',
    1,
    true
);

-- =========================================================
-- Module
-- =========================================================

INSERT INTO modules (
    id,
    chapter_id,
    title,
    description,
    display_order,
    is_active
) VALUES (
    1,
    1,
    'HTTP 기초',
    'HTTP 요청과 응답의 기본 구조를 이해하고, API 통신의 출발점을 학습한다.',
    1,
    true
);

-- =========================================================
-- Terms
-- =========================================================

INSERT INTO terms (
    id,
    module_id,
    name,
    short_definition,
    practical_context,
    example_sentence,
    display_order,
    is_active
) VALUES
(
    1,
    1,
    'HTTP',
    '클라이언트와 서버가 웹에서 데이터를 주고받기 위한 통신 규칙이다.',
    'API 연동, 화면 조회, 서버 응답 오류, 상태 코드 확인 등 대부분의 웹 시스템 논의에서 기본 전제가 되는 개념이다.',
    'GET /api/terms 요청은 서버에게 용어 목록을 달라고 보내는 HTTP 요청이다.',
    1,
    true
),
(
    2,
    1,
    'Client',
    '서버에 요청을 보내는 쪽이다.',
    '웹 브라우저, 모바일 앱, 프론트엔드 화면, 다른 서버 등이 클라이언트 역할을 할 수 있다.',
    '사용자가 버튼을 누르면 브라우저라는 클라이언트가 서버에 요청을 보낸다.',
    2,
    true
),
(
    3,
    1,
    'Server',
    '클라이언트의 요청을 받아 처리하고 응답을 돌려주는 쪽이다.',
    '비즈니스 로직 처리, DB 조회, 인증 확인, 외부 시스템 연동 등이 서버에서 수행된다.',
    '서버는 GET /api/terms 요청을 받고 DB에서 용어 목록을 조회해 응답한다.',
    3,
    true
),
(
    4,
    1,
    'Request',
    '클라이언트가 서버에 보내는 요청이다.',
    '화면 조회, 저장, 수정, 삭제 같은 사용자 행동은 대부분 Request로 서버에 전달된다.',
    '로그인 버튼을 누르면 클라이언트는 로그인 Request를 서버로 전송한다.',
    4,
    true
),
(
    5,
    1,
    'Response',
    '서버가 클라이언트에게 돌려주는 응답이다.',
    '서버 처리 결과, 조회 데이터, 오류 메시지, 상태 코드 등이 Response에 담긴다.',
    '서버는 로그인 성공 여부와 사용자 정보를 Response로 돌려준다.',
    5,
    true
),
(
    6,
    1,
    'Status Code',
    'HTTP 응답 결과를 숫자로 표현한 값이다.',
    '운영 중 오류를 분석할 때 200, 400, 401, 403, 404, 500 같은 상태 코드는 원인 파악의 중요한 단서가 된다.',
    '500 상태 코드는 서버 내부 처리 중 문제가 발생했을 가능성을 의미한다.',
    6,
    true
),
(
    7,
    1,
    'GET',
    '서버에서 데이터를 조회할 때 주로 사용하는 HTTP Method다.',
    '목록 조회, 상세 조회, 검색 조건 조회 같은 API에서 자주 사용된다.',
    'GET /api/terms 요청은 용어 목록을 조회하는 요청이다.',
    7,
    true
),
(
    8,
    1,
    'POST',
    '서버에 데이터를 생성하거나 처리를 요청할 때 주로 사용하는 HTTP Method다.',
    '회원가입, 로그인, 주문 생성, 게시글 작성처럼 서버에 데이터를 보내는 기능에서 자주 사용된다.',
    'POST /api/login 요청은 로그인 정보를 서버에 보내는 요청이다.',
    8,
    true
);

-- =========================================================
-- Lessons
-- =========================================================

INSERT INTO lessons (
    id,
    module_id,
    title,
    summary,
    body_markdown,
    display_order,
    is_active
) VALUES
(
    1,
    1,
    '클라이언트와 서버는 어떻게 대화하는가',
    'HTTP 통신의 가장 기본 구조인 클라이언트, 서버, 요청, 응답의 관계를 이해한다.',
    '## 클라이언트와 서버의 기본 흐름

웹 시스템에서 클라이언트는 서버에 요청을 보내고, 서버는 요청을 처리한 뒤 응답을 돌려준다.

가장 단순한 흐름은 다음과 같다.

1. 사용자가 화면에서 어떤 행동을 한다.
2. 클라이언트가 서버에 HTTP Request를 보낸다.
3. 서버가 요청을 해석하고 필요한 처리를 한다.
4. 서버가 HTTP Response를 돌려준다.
5. 클라이언트는 응답 결과를 화면에 반영한다.

이 구조를 이해하면 API, 인증, DB 조회, 오류 분석을 훨씬 쉽게 이해할 수 있다.',
    1,
    true
),
(
    2,
    1,
    'Request에는 무엇이 들어가는가',
    'HTTP Request의 구성 요소인 Method, URL, Header, Body의 역할을 이해한다.',
    '## HTTP Request의 구성

HTTP Request는 클라이언트가 서버에 보내는 요청이다.

Request에는 보통 다음 정보가 포함된다.

- Method: 어떤 행동을 원하는지 나타낸다. 예: GET, POST
- URL: 어느 자원에 요청하는지 나타낸다.
- Header: 요청에 대한 부가 정보를 담는다. 예: 인증 토큰, Content-Type
- Body: 서버에 전달할 실제 데이터를 담는다.

예를 들어 로그인 요청에서는 이메일과 비밀번호 같은 정보가 Body에 들어갈 수 있다.

반면 단순 목록 조회 요청에서는 Body 없이 URL과 Method만으로도 요청이 가능하다.',
    2,
    true
),
(
    3,
    1,
    'Response와 Status Code는 어떻게 읽는가',
    '서버가 돌려주는 Response와 상태 코드가 실무에서 어떤 의미를 가지는지 이해한다.',
    '## HTTP Response 읽기

HTTP Response는 서버가 클라이언트에게 돌려주는 응답이다.

Response에는 보통 다음 정보가 포함된다.

- Status Code: 요청 처리 결과를 나타내는 숫자
- Header: 응답에 대한 부가 정보
- Body: 클라이언트가 실제로 사용할 데이터

상태 코드는 운영 이슈를 볼 때 특히 중요하다.

- 200번대: 요청 성공
- 400번대: 클라이언트 요청 문제
- 500번대: 서버 처리 문제

예를 들어 404는 요청한 자원을 찾을 수 없다는 뜻이고, 500은 서버 내부에서 문제가 발생했을 가능성을 의미한다.',
    3,
    true
);

-- =========================================================
-- Lesson-Term Mapping
-- =========================================================

INSERT INTO lesson_terms (
    lesson_id,
    term_id,
    display_order
) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 3),
(1, 4, 4),
(1, 5, 5),

(2, 4, 1),
(2, 7, 2),
(2, 8, 3),

(3, 5, 1),
(3, 6, 2);

-- =========================================================
-- Code Examples
-- =========================================================

INSERT INTO code_examples (
    id,
    lesson_id,
    title,
    code_type,
    code_content,
    explanation,
    display_order,
    is_active
) VALUES
(
    1,
    1,
    '용어 목록 조회 요청',
    'HTTP',
    'GET /api/terms HTTP/1.1
Host: example.com',
    '클라이언트가 서버에게 용어 목록을 요청하는 HTTP GET 요청 예시다.',
    1,
    true
),
(
    2,
    2,
    '로그인 요청 예시',
    'HTTP',
    'POST /api/login HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "email": "bailey@example.com",
  "password": "password123"
}',
    '클라이언트가 로그인 정보를 서버에 보내는 POST 요청 예시다. 실제 서비스에서는 비밀번호를 안전하게 처리해야 한다.',
    1,
    true
),
(
    3,
    3,
    '용어 목록 응답 예시',
    'JSON',
    '{
  "data": [
    {
      "id": 1,
      "name": "HTTP",
      "shortDefinition": "클라이언트와 서버가 웹에서 데이터를 주고받기 위한 통신 규칙"
    }
  ]
}',
    '서버가 클라이언트에게 JSON 형식으로 용어 목록을 돌려주는 응답 예시다.',
    1,
    true
);

-- =========================================================
-- Quiz Questions
-- =========================================================

INSERT INTO quiz_questions (
    id,
    module_id,
    lesson_id,
    term_id,
    question_text,
    question_format,
    question_type,
    explanation,
    display_order,
    is_active
) VALUES
(
    1,
    1,
    NULL,
    1,
    'HTTP의 설명으로 가장 적절한 것은?',
    'MULTIPLE_CHOICE',
    'TERM_RECALL',
    'HTTP는 클라이언트와 서버가 웹에서 데이터를 주고받기 위한 통신 규칙이다.',
    1,
    true
),
(
    2,
    1,
    3,
    6,
    '운영 중 API 호출 결과 500 상태 코드가 발생했다. 가장 먼저 의심할 수 있는 영역은?',
    'MULTIPLE_CHOICE',
    'PRACTICAL_CONTEXT',
    '500번대 상태 코드는 일반적으로 서버 내부 처리 중 문제가 발생했을 가능성을 의미한다.',
    2,
    true
),
(
    3,
    1,
    2,
    8,
    '다음 요청에서 HTTP Method는 무엇인가?\n\nPOST /api/login',
    'MULTIPLE_CHOICE',
    'CODE_READING',
    'HTTP 요청의 맨 앞에 있는 POST가 Method다.',
    3,
    true
);

-- =========================================================
-- Quiz Choices
-- =========================================================

INSERT INTO quiz_choices (
    id,
    question_id,
    choice_text,
    is_correct,
    explanation,
    display_order,
    is_active
) VALUES
-- Q1
(
    1,
    1,
    '데이터를 영구 저장하는 데이터베이스',
    false,
    '이는 DB에 대한 설명이다. HTTP는 저장소가 아니라 통신 규칙이다.',
    1,
    true
),
(
    2,
    1,
    '클라이언트와 서버가 웹에서 데이터를 주고받기 위한 통신 규칙',
    true,
    'HTTP에 대한 올바른 설명이다.',
    2,
    true
),
(
    3,
    1,
    '서버 내부에서 정해진 시간마다 실행되는 작업',
    false,
    '이는 배치나 스케줄러에 가까운 설명이다.',
    3,
    true
),
(
    4,
    1,
    '사용자 비밀번호를 암호화하는 방식',
    false,
    '이는 해시 또는 암호화 개념에 가깝다.',
    4,
    true
),

-- Q2
(
    5,
    2,
    '서버 내부 로직, DB 조회, 외부 연동 등 서버 처리 영역',
    true,
    '500번대 오류는 서버 내부 처리 중 문제가 발생했을 가능성이 높다.',
    1,
    true
),
(
    6,
    2,
    '사용자가 URL을 잘못 입력한 경우만 의미한다',
    false,
    'URL을 잘못 입력한 경우는 보통 404 같은 400번대 오류와 더 관련 있다.',
    2,
    true
),
(
    7,
    2,
    '인증 토큰이 없어서 접근이 거절된 경우만 의미한다',
    false,
    '인증 문제는 보통 401 또는 403 상태 코드와 관련 있다.',
    3,
    true
),
(
    8,
    2,
    '항상 프론트엔드 화면 디자인 문제를 의미한다',
    false,
    '500 오류는 일반적으로 화면 디자인보다 서버 처리 문제와 관련 있다.',
    4,
    true
),

-- Q3
(
    9,
    3,
    'GET',
    false,
    '요청 예시에 적힌 Method는 GET이 아니라 POST다.',
    1,
    true
),
(
    10,
    3,
    'POST',
    true,
    '요청의 맨 앞에 있는 POST가 HTTP Method다.',
    2,
    true
),
(
    11,
    3,
    '/api/login',
    false,
    '/api/login은 요청 대상 URL 또는 path에 해당한다.',
    3,
    true
),
(
    12,
    3,
    'HTTP',
    false,
    'HTTP는 통신 규칙이고, 이 요청의 Method는 POST다.',
    4,
    true
);

-- =========================================================
-- Sequence Reset
-- 수동으로 id를 넣었기 때문에 다음 자동 증가값을 맞춰준다.
-- =========================================================

SELECT setval('chapters_id_seq', (SELECT MAX(id) FROM chapters));
SELECT setval('modules_id_seq', (SELECT MAX(id) FROM modules));
SELECT setval('terms_id_seq', (SELECT MAX(id) FROM terms));
SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));
SELECT setval('code_examples_id_seq', (SELECT MAX(id) FROM code_examples));
SELECT setval('quiz_questions_id_seq', (SELECT MAX(id) FROM quiz_questions));
SELECT setval('quiz_choices_id_seq', (SELECT MAX(id) FROM quiz_choices));
