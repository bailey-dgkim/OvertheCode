import { useState } from 'react';
import { Link } from 'react-router-dom';
import DevToolsLab from './DevToolsLab';
import FrontendLessonShell from './FrontendLessonShell';
import { useFrontendLessonProgress } from './frontendLessonProgress';
import OtcCodeQuiz from './OtcCodeQuiz';
import {
  areEndpointMatchesCorrect,
  isApiInterpretationCorrect,
} from './frontendApiLessonUtils';

const LESSON_STEPS = [
  { short: '화면만 바뀐 상태', title: '배송 완료로 보이는데, 정말 주문 데이터도 바뀌었을까?' },
  { short: 'Client와 Server', title: '브라우저 State와 서버 데이터는 같은 것이 아니다' },
  { short: 'Request · Response', title: 'Client와 Server는 요청과 응답으로 대화한다' },
  { short: 'API', title: '프론트엔드는 서버의 어디로 요청을 보낼까?' },
  { short: 'fetch()', title: 'Event Handler에서 브라우저 밖으로 요청 보내기' },
  { short: 'HTTP Method', title: '요청의 목적은 HTTP Method로 읽는다' },
  { short: 'URL · ID', title: '어떤 데이터를 다룰지는 URL에서 찾는다' },
  { short: 'JSON', title: '어떻게 바꿀지는 JSON 데이터로 전달한다' },
  { short: '코드 읽기 미션', title: '이 fetch 코드는 서버에 무엇을 요청할까?' },
  { short: '기능 연결 미션', title: 'API 주소와 화면 기능을 연결하라' },
  { short: 'OTC 코드 적용', title: '실제 OTC의 Network 요청을 찾아보자' },
  { short: 'Response와 State', title: '서버 응답이 다시 화면 변경으로 이어진다' },
  { short: '전체 흐름', title: '버튼 하나 뒤의 전체 실행 흐름을 완성하다' },
  { short: '필수 암기', title: '서버 입구에서 기억할 여덟 개념' },
];

const HTTP_METHODS = [
  ['GET', '조회', '데이터를 보여주세요'],
  ['POST', '생성', '새 데이터를 만들어주세요'],
  ['PATCH', '변경', '기존 데이터의 일부를 바꿔주세요'],
  ['DELETE', '삭제', '기존 데이터를 지워주세요'],
];

const MEMORY_ITEMS = [
  ['Client', '서버에 요청을 보내고 응답을 받아 사용하는 쪽'],
  ['Server', '요청을 받아 처리하고 결과를 반환하는 쪽'],
  ['API', '프로그램끼리 기능이나 데이터를 주고받기 위해 정해놓은 접점'],
  ['Request', 'Client가 Server로 보내는 요청'],
  ['Response', 'Server가 Client로 돌려주는 결과'],
  ['HTTP Method', 'GET 조회 · POST 생성 · PATCH 변경 · DELETE 삭제처럼 요청 목적을 표현'],
  ['JSON', '프로그램 사이에서 데이터를 표현하고 주고받을 때 널리 사용하는 형식'],
  ['fetch()', '브라우저에서 HTTP Request를 보낼 수 있는 JavaScript API'],
];

const FULL_FLOW = [
  '사용자',
  '버튼 클릭',
  'Event',
  'Event Handler',
  'API 호출',
  'HTTP Request',
  'Server 처리',
  'HTTP Response',
  'State 변경',
  'Re-rendering',
  'DOM 반영',
  '화면 변경',
];

const API_QUESTION_OPTIONS = [
  { id: 'get-all-orders', label: '모든 주문을 조회한다.' },
  { id: 'create-order', label: '1024번 주문을 새로 생성한다.' },
  { id: 'patch-order-status', label: '1024번 주문의 상태를 COMPLETED로 변경한다.' },
  { id: 'delete-order', label: '1024번 주문을 삭제한다.' },
];

const ENDPOINTS = [
  { id: 'get-one', method: 'GET', path: '/api/orders/1024' },
  { id: 'post', method: 'POST', path: '/api/orders' },
  { id: 'patch', method: 'PATCH', path: '/api/orders/1024' },
  { id: 'delete', method: 'DELETE', path: '/api/orders/1024' },
];

const ENDPOINT_ACTIONS = [
  { id: 'view', label: '1024번 주문 상세보기' },
  { id: 'create', label: '새 주문 생성하기' },
  { id: 'complete', label: '1024번 주문 상태 변경하기' },
  { id: 'remove', label: '1024번 주문 삭제하기' },
];

const CORRECT_ENDPOINT_MATCHES = {
  'get-one': 'view',
  post: 'create',
  patch: 'complete',
  delete: 'remove',
};

const COMPLETE_REQUEST_CODE = `async function handleComplete() {
  await fetch("/api/orders/1024", {
    method: "PATCH",
    body: JSON.stringify({
      status: "COMPLETED"
    })
  });
}`;

function Arrow({ direction = 'right' }) {
  return (
    <span className={`cv2-lesson-arrow cv2-lesson-arrow--${direction}`} aria-hidden="true">
      →
    </span>
  );
}

function Definition({ concept, children }) {
  return (
    <aside className="cv2-lesson-definition">
      <strong>{concept}</strong>
      <p>{children}</p>
    </aside>
  );
}

function ApiOrderCard({ status, onComplete, onRefresh }) {
  const completed = status === '배송 완료';

  return (
    <article className="cv2-api-order-card">
      <div className="cv2-api-order-card__bar">
        <span>내 브라우저</span>
        <i>order.local</i>
      </div>
      <span className="cv2-api-order-card__eyebrow">주문 #1024</span>
      <h2>김철수</h2>
      <div className="cv2-api-order-card__status">
        <span>현재 화면의 상태</span>
        <strong className={completed ? 'is-complete' : ''}>{status}</strong>
      </div>
      <button type="button" onClick={onComplete} disabled={completed}>배송 완료 처리</button>
      <button className="is-secondary" type="button" onClick={onRefresh}>새로고침 시뮬레이션</button>
    </article>
  );
}

function BrowserOnlyStep() {
  const [status, setStatus] = useState('배송 준비중');
  const [refreshed, setRefreshed] = useState(false);

  const complete = () => {
    setStatus('배송 완료');
    setRefreshed(false);
  };

  const refresh = () => {
    setStatus('배송 준비중');
    setRefreshed(true);
  };

  return (
    <>
      <p className="cv2-lesson-lead">
        04에서 배운 대로 <code>setStatus(&quot;배송 완료&quot;)</code>를 실행해봅시다. 먼저 배송 완료 처리 버튼을 누른 뒤 새로고침을 시뮬레이션하세요.
      </p>
      <div className="cv2-api-opening">
        <ApiOrderCard status={status} onComplete={complete} onRefresh={refresh} />
        <section>
          <span>브라우저 안에서만 일어난 변경</span>
          <pre><code>{`function handleComplete() {
  setStatus("배송 완료");
}`}</code></pre>
          <div className="cv2-api-opening__result" role="status">
            <strong>{refreshed ? '다시 배송 준비중이 되었습니다.' : status === '배송 완료' ? '화면은 배송 완료로 바뀌었습니다.' : '버튼을 눌러 화면을 바꿔보세요.'}</strong>
            <p>{refreshed ? '서버의 주문 데이터는 바꾸지 않았기 때문에 원래 값으로 돌아올 수 있습니다.' : '하지만 아직 서버에는 아무 요청도 보내지 않았습니다.'}</p>
          </div>
        </section>
      </div>
      <aside className="cv2-lesson-emphasis">
        화면이 바뀌었다고 서버의 데이터까지 바뀐 것은 아닙니다.
      </aside>
    </>
  );
}

function ClientServerStep() {
  return (
    <>
      <p className="cv2-lesson-lead">같은 주문을 두 곳이 서로 다른 값으로 기억하는 상황을 나란히 비교해봅니다.</p>
      <div className="cv2-api-state-split">
        <article className="is-client">
          <span>Client · 내 브라우저</span>
          <code>status = &quot;배송 완료&quot;</code>
          <p>지금 내 화면을 구성하는 State</p>
        </article>
        <strong aria-label="같지 않음">≠</strong>
        <article className="is-server">
          <span>Server · 서비스 데이터</span>
          <code>status = &quot;배송 준비중&quot;</code>
          <p>여러 Client가 서버를 통해 접근하는 데이터</p>
        </article>
      </div>
      <div className="cv2-api-two-definitions">
        <Definition concept="Client">서버에 요청을 보내고 응답을 받아 사용하는 쪽. 지금은 브라우저의 프론트엔드를 뜻합니다.</Definition>
        <Definition concept="Server">Client의 요청을 받아 처리하고 결과를 돌려주는 프로그램입니다.</Definition>
      </div>
      <aside className="cv2-lesson-emphasis">
        State는 현재 화면을 위한 값입니다. 서비스가 계속 기억해야 할 데이터의 영구 저장은 다음 Part에서 다룹니다.
      </aside>
    </>
  );
}

function RequestResponseStep() {
  const [labResponse, setLabResponse] = useState(null);

  const requestOrder = async () => {
    const response = await fetch('/devtools/order-1024.json');
    setLabResponse(await response.json());
  };

  return (
    <>
      <p className="cv2-lesson-lead">브라우저가 서버의 주문도 바꾸려면 서버에 의미가 담긴 요청을 보내야 합니다.</p>
      <div className="cv2-api-roundtrip">
        <article><span>Client</span><strong>주문 화면</strong><small>브라우저</small></article>
        <div className="cv2-api-roundtrip__arrows">
          <p><strong>Request</strong><span>1024번 주문을 배송 완료로 변경해주세요.</span><i>→</i></p>
          <p><i>←</i><strong>Response</strong><span>변경된 주문 결과입니다.</span></p>
        </div>
        <article><span>Server</span><strong>주문 처리</strong><small>요청을 받고 결과 반환</small></article>
      </div>
      <div className="cv2-api-two-definitions">
        <Definition concept="Request">Client가 Server에 보내는 요청</Definition>
        <Definition concept="Response">Server가 처리한 뒤 Client에 돌려주는 결과</Definition>
      </div>
      <div className="cv2-api-linear-flow" aria-label="Client 다음 Request 다음 Server 다음 Response 다음 Client">
        {['Client', 'Request', 'Server', 'Response', 'Client'].map((item, index) => (
          <div key={`${item}-${index}`}><strong>{item}</strong>{index < 4 && <Arrow />}</div>
        ))}
      </div>
      <DevToolsLab
        tool="Network"
        title="화면 뒤에서 오간 Request와 Response를 찾아보자"
        steps={[
          'DevTools의 Network 탭을 열고 Fetch/XHR 필터를 선택합니다.',
          '아래 주문 데이터 요청 버튼을 누릅니다.',
          '목록에서 /devtools/order-1024.json 요청을 선택합니다.',
          'Headers에서 URL, HTTP Method, Status Code를 확인합니다.',
          'Payload와 Response에서 보낸 데이터와 받은 JSON을 비교합니다.',
        ]}
        answer="Network는 Frontend와 Backend 사이에 실제로 오간 HTTP Request와 Response를 확인하는 곳입니다. 화면의 값이 어디에서 왔는지 추측하지 않고 증거로 좁힐 수 있습니다."
      >
        <div className="cv2-devtools-lab__demo">
          <button type="button" onClick={requestOrder}>주문 데이터 요청</button>
          <pre><code>{labResponse ? JSON.stringify(labResponse, null, 2) : '아직 Response가 없습니다.'}</code></pre>
        </div>
      </DevToolsLab>
    </>
  );
}

function ApiStep() {
  return (
    <>
      <p className="cv2-lesson-lead">서버는 아무 주소에서나 모든 요청을 받지 않습니다. 미리 약속한 접점을 열어둡니다.</p>
      <div className="cv2-api-gate">
        <article><span>Frontend</span><strong>주문 화면</strong></article>
        <Arrow />
        <section>
          <span>API · 약속된 입구</span>
          <code><b>GET</b> /api/orders/1024</code>
          <code><b>PATCH</b> /api/orders/1024</code>
        </section>
        <Arrow />
        <article><span>Backend</span><strong>주문 서버</strong></article>
      </div>
      <Definition concept="API">
        프로그램끼리 기능이나 데이터를 주고받기 위해 정해놓은 접점. 프론트엔드가 Backend에 요청을 보내는 약속된 입구입니다.
      </Definition>
      <aside className="cv2-lesson-emphasis">
        같은 주소라도 GET이면 “보여주세요”, PATCH이면 “바꿔주세요”라는 서로 다른 요청이 됩니다.
      </aside>
    </>
  );
}

function FetchStep() {
  return (
    <>
      <p className="cv2-lesson-lead">이제 04의 Event Handler 안에 서버 요청을 연결합니다.</p>
      <div className="cv2-api-code-change">
        <section>
          <span>화면만 변경</span>
          <pre><code>{`function handleComplete() {
  setStatus("배송 완료");
}`}</code></pre>
        </section>
        <Arrow />
        <section className="is-request">
          <span>서버에 Request</span>
          <pre><code>{`async function handleComplete() {
  await fetch("/api/orders/1024", {
    method: "PATCH"
  });
}`}</code></pre>
        </section>
      </div>
      <Definition concept="fetch()">
        브라우저에서 HTTP Request를 보낼 수 있는 JavaScript API. 코드에서 fetch를 발견하면 “브라우저 밖과 통신하는 지점일 수 있겠다”고 읽을 수 있습니다.
      </Definition>
      <p className="cv2-api-footnote">프로젝트에 따라 <code>axios</code>라는 도구를 사용할 수도 있지만, 지금은 같은 목적의 이름이라는 정도만 알아둡니다.</p>
    </>
  );
}

function HttpMethodStep() {
  return (
    <>
      <p className="cv2-lesson-lead">HTTP Method를 보면 서버에 원하는 행동을 빠르게 추측할 수 있습니다.</p>
      <div className="cv2-api-method-grid">
        {HTTP_METHODS.map(([method, action, description], index) => (
          <article key={method}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <code>{method}</code>
            <strong>{action}</strong>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <Definition concept="HTTP Method">Request의 목적을 나타내는 표현</Definition>
      <aside className="cv2-lesson-emphasis">
        우선 <code>GET 조회 · POST 생성 · PATCH 변경 · DELETE 삭제</code> 네 가지를 연결해 기억하세요.
      </aside>
    </>
  );
}

function UrlStep() {
  return (
    <>
      <p className="cv2-lesson-lead">Method가 행동이라면 URL은 그 행동의 대상을 알려줍니다.</p>
      <div className="cv2-api-url-anatomy">
        <code><span>/api</span><span>/orders</span><strong>/1024</strong></code>
        <div><span>API 영역</span><span>주문 데이터</span><strong>주문 ID</strong></div>
      </div>
      <div className="cv2-api-url-readings">
        <article><code>GET /api/orders/1024</code><p>“1024번 주문을 보여주세요.”</p></article>
        <article><code>PATCH /api/orders/1024</code><p>“1024번 주문을 변경할게요.”</p></article>
      </div>
      <Definition concept="ID">여러 주문 중 특정 주문을 구분하는 값. 여기서는 <code>1024</code>가 주문 ID입니다.</Definition>
    </>
  );
}

function JsonStep() {
  return (
    <>
      <p className="cv2-lesson-lead">PATCH와 주문 ID만 보내면 서버는 “무엇을 어떤 값으로 바꿀지” 알 수 없습니다.</p>
      <div className="cv2-api-json-stage">
        <section>
          <span>HTTP Request</span>
          <code>PATCH /api/orders/1024</code>
          <pre><code>{`{
  "status": "COMPLETED"
}`}</code></pre>
        </section>
        <Arrow />
        <blockquote>
          <span>한국어로 읽기</span>
          <p><strong>1024번 주문</strong>의 <strong>status</strong>를 <strong>COMPLETED</strong>로 변경해주세요.</p>
        </blockquote>
      </div>
      <Definition concept="JSON">
        프로그램 사이에서 데이터를 표현하고 주고받을 때 널리 사용하는 텍스트 기반 형식. 처음에는 <code>&quot;이름&quot;: 값</code> 구조로 읽으면 충분합니다.
      </Definition>
    </>
  );
}

function CodeReadingMission({ isSolved, onSolved }) {
  const [answer, setAnswer] = useState(isSolved ? 'patch-order-status' : '');
  const [submitted, setSubmitted] = useState(isSolved);
  const correct = isApiInterpretationCorrect(answer);

  const checkAnswer = () => {
    setSubmitted(true);
    if (correct) onSolved();
  };

  return (
    <>
      <p className="cv2-lesson-lead">Method, URL, JSON을 한 줄씩 읽어 이 코드가 요청하는 행동을 고르세요.</p>
      <section className="cv2-api-mission-code">
        <span>OrderCard.jsx</span>
        <pre><code>{COMPLETE_REQUEST_CODE}</code></pre>
      </section>
      <div className="cv2-api-choice-list" role="radiogroup" aria-label="API 코드 해석 선택지">
        {API_QUESTION_OPTIONS.map((option, index) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={answer === option.id}
            className={answer === option.id ? 'is-selected' : ''}
            onClick={() => {
              setAnswer(option.id);
              setSubmitted(false);
            }}
          >
            <span>{String.fromCharCode(65 + index)}</span><strong>{option.label}</strong>
          </button>
        ))}
      </div>
      <div className="cv2-api-mission-check">
        <button className="cv2-button cv2-button--primary" type="button" onClick={checkAnswer} disabled={!answer}>코드 해석 확인</button>
      </div>
      {submitted && (
        <aside className={`cv2-state-feedback${correct ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{correct ? '정답입니다.' : 'Method, URL, JSON을 다시 나눠 읽어보세요.'}</strong>
          <p>{correct ? 'PATCH는 변경, 1024는 주문 ID, JSON의 status는 바꿀 값을 뜻합니다.' : '먼저 PATCH가 어떤 행동인지 확인한 뒤 대상 ID와 body를 연결하세요.'}</p>
        </aside>
      )}
    </>
  );
}

function EndpointMission({ isSolved, onSolved }) {
  const [matches, setMatches] = useState(isSolved ? CORRECT_ENDPOINT_MATCHES : {});
  const [submitted, setSubmitted] = useState(isSolved);
  const correct = areEndpointMatchesCorrect(matches, CORRECT_ENDPOINT_MATCHES);

  const setMatch = (endpointId, actionId) => {
    setMatches((current) => ({ ...current, [endpointId]: actionId }));
    setSubmitted(false);
  };

  const checkMatches = () => {
    setSubmitted(true);
    if (correct) onSolved();
  };

  return (
    <>
      <p className="cv2-lesson-lead">각 API가 화면의 어떤 기능과 이어지는지 선택하세요.</p>
      <div className="cv2-api-match-list">
        {ENDPOINTS.map((endpoint) => (
          <article key={endpoint.id}>
            <div><code>{endpoint.method}</code><strong>{endpoint.path}</strong></div>
            <label>
              <span className="oc-sr-only">{endpoint.method} {endpoint.path} 기능</span>
              <select value={matches[endpoint.id] ?? ''} onChange={(event) => setMatch(endpoint.id, event.target.value)}>
                <option value="">화면 기능 선택</option>
                {ENDPOINT_ACTIONS.map((action) => <option key={action.id} value={action.id}>{action.label}</option>)}
              </select>
            </label>
          </article>
        ))}
      </div>
      <div className="cv2-api-mission-check">
        <button className="cv2-button cv2-button--primary" type="button" onClick={checkMatches} disabled={Object.keys(matches).length !== ENDPOINTS.length}>기능 연결 확인</button>
      </div>
      {submitted && (
        <aside className={`cv2-state-feedback${correct ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{correct ? '모든 API를 올바르게 연결했습니다.' : '아직 맞지 않는 연결이 있습니다.'}</strong>
          <p>{correct ? '이제 API 명세에서 Method와 URL을 보고 화면 기능을 추측할 수 있습니다.' : 'GET 조회 · POST 생성 · PATCH 변경 · DELETE 삭제를 먼저 적용해보세요.'}</p>
        </aside>
      )}
    </>
  );
}

function ResponseStateStep() {
  const [phase, setPhase] = useState(0);
  const response = `{
  "orderId": 1024,
  "status": "COMPLETED"
}`;
  const phases = ['Response 도착', 'State 변경', 'Re-rendering', '화면 변경'];

  return (
    <>
      <p className="cv2-lesson-lead">서버가 성공 결과를 보내면 프론트엔드는 그 결과를 State에 반영할 수 있습니다.</p>
      <div className="cv2-api-response-demo">
        <section>
          <span>HTTP Response</span>
          <pre><code>{response}</code></pre>
          <button type="button" onClick={() => setPhase((current) => Math.min(current + 1, phases.length))} disabled={phase === phases.length}>
            {phase === phases.length ? '화면 반영 완료' : `${phases[phase]} 실행 →`}
          </button>
        </section>
        <ol>
          {phases.map((item, index) => (
            <li className={index < phase ? 'is-active' : ''} key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>
            </li>
          ))}
        </ol>
        <article className={phase === phases.length ? 'is-complete' : ''}>
          <span>주문 #1024</span><strong>{phase === phases.length ? '배송 완료' : '배송 준비중'}</strong>
        </article>
      </div>
      <aside className="cv2-lesson-emphasis">
        여기서 03의 흐름이 다시 등장합니다. <code>Response → State 변경 → Re-rendering → 화면 변경</code>
      </aside>
    </>
  );
}

function FullFlowStep() {
  return (
    <>
      <p className="cv2-lesson-lead">처음 봤던 버튼 하나 뒤에서 실제로 일어나는 일을 브라우저 안과 밖을 가로질러 봅니다.</p>
      <ol className="cv2-api-full-flow" aria-label={FULL_FLOW.join(' 다음 ')}>
        {FULL_FLOW.map((item, index) => (
          <li key={item} className={index === 4 || index === 6 || index === 8 ? 'is-key' : ''}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
            {index < FULL_FLOW.length - 1 && <Arrow />}
          </li>
        ))}
      </ol>
      <blockquote className="cv2-api-big-realization">
        <span>Part 1의 큰 그림</span>
        <p>우리가 처음 봤던 <strong>[배송 완료 처리]</strong> 버튼 하나 뒤에서 사실 이만큼의 일이 일어나고 있었습니다.</p>
      </blockquote>
    </>
  );
}

function MemoryAndBridgeStep() {
  return (
    <>
      <p className="cv2-lesson-lead">서버 내부는 아직 검은 상자로 두고, 프론트엔드가 서버 입구까지 요청을 보내는 데 필요한 개념만 정리합니다.</p>
      <dl className="cv2-api-memory-grid">
        {MEMORY_ITEMS.map(([concept, meaning], index) => (
          <div key={concept}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <dt>{concept}</dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
      <div className="cv2-api-core-diagram" aria-label="Client가 API를 통해 Server와 통신하는 흐름">
        <article><span>Client</span><small>브라우저</small></article>
        <div><strong>HTTP Request →</strong><span>API</span><strong>← HTTP Response</strong></div>
        <article><span>Server</span><small>아직은 검은 상자</small></article>
      </div>
      <section className="cv2-api-backend-bridge">
        <p className="cv2-eyebrow">Next · Backend</p>
        <span>좋아. 요청이 서버까지 도착했습니다.</span>
        <h2>그런데 서버는 이 요청을 받고 <strong>대체 무엇을 하는 걸까요?</strong></h2>
        <p>다음 Part에서는 서버 안을 열어 Controller → Service → Repository → DB 흐름을 따라갑니다.</p>
        <Link className="cv2-button cv2-button--primary" to="/parts/application">다음 주제 · Backend 살펴보기 →</Link>
      </section>
    </>
  );
}

const STATIC_STEP_CONTENT = [
  BrowserOnlyStep,
  ClientServerStep,
  RequestResponseStep,
  ApiStep,
  FetchStep,
  HttpMethodStep,
  UrlStep,
  JsonStep,
  null,
  null,
  null,
  ResponseStateStep,
  FullFlowStep,
  MemoryAndBridgeStep,
];

function FrontendApiLesson({ chapter }) {
  const progress = useFrontendLessonProgress(chapter.id, LESSON_STEPS.length);
  const { completedMissionIds, stepIndex } = progress;
  const codeMissionSolved = completedMissionIds.includes('api-code-reading');
  const matchMissionSolved = completedMissionIds.includes('api-endpoint-match');
  const isCodeMission = stepIndex === 8;
  const isMatchMission = stepIndex === 9;
  const isProjectMission = stepIndex === 10;
  const projectMissionSolved = completedMissionIds.includes('api-otc-code');
  const canContinue = (!isCodeMission || codeMissionSolved)
    && (!isMatchMission || matchMissionSolved)
    && (!isProjectMission || projectMissionSolved);
  const phaseIndex = stepIndex <= 4 ? 0 : stepIndex <= 7 ? 1 : stepIndex <= 10 ? 2 : 3;
  const StepContent = STATIC_STEP_CONTENT[stepIndex];

  return (
    <div className="cv2-api-lesson">
      <FrontendLessonShell
        canContinue={canContinue}
        chapter={chapter}
        lessonLabel="05 · API Call"
        onAdvance={progress.advance}
        onComplete={progress.complete}
        onOpenStep={progress.openStep}
        onPrevious={progress.previous}
        phases={['화면 밖으로', 'HTTP 요청 읽기', 'API 미션', '전체 흐름 완성']}
        phaseIndex={phaseIndex}
        recall={{
          choices: [
            { id: 'request', label: 'HTTP Request를 보내고 Response를 State에 반영한다.' },
            { id: 'state', label: '화면의 State만 바꾸고 끝낸다.' },
            { id: 'css', label: 'CSS 파일에 데이터를 기록한다.' },
          ],
          correctChoiceId: 'request',
          isSolved: completedMissionIds.includes('api-recall'),
          onSolved: () => progress.markMissionComplete('api-recall'),
          prompt: '새로고침 뒤에도 변경된 데이터가 남으려면 어떤 흐름이 필요할까요?',
        }}
        stepIndex={stepIndex}
        steps={LESSON_STEPS}
        titleId="api-lesson-title"
        unlockedThrough={progress.unlockedThrough}
      >
        {isCodeMission ? (
          <CodeReadingMission
            isSolved={codeMissionSolved}
            onSolved={() => progress.markMissionComplete('api-code-reading')}
          />
        ) : isMatchMission ? (
          <EndpointMission
            isSolved={matchMissionSolved}
            onSolved={() => progress.markMissionComplete('api-endpoint-match')}
          />
        ) : isProjectMission ? (
          <OtcCodeQuiz
            file="src/components/learning/FrontendApiLesson.jsx"
            code={"const response = await fetch('/devtools/order-1024.json');\nconst data = await response.json();"}
            prompt="브라우저에서 이 요청의 URL, 상태 코드와 Response JSON을 함께 확인하려면 어디를 열어야 할까요?"
            choices={[
              { id: 'network', label: 'DevTools의 Network 탭' },
              { id: 'elements', label: 'DevTools의 Elements 탭' },
              { id: 'css', label: 'landing.css 파일' },
            ]}
            correctChoiceId="network"
            explanation="Network 탭의 Fetch/XHR 요청을 선택하면 Headers, Payload와 Response를 한 흐름으로 확인할 수 있습니다."
            isSolved={projectMissionSolved}
            onSolved={() => progress.markMissionComplete('api-otc-code')}
          />
        ) : <StepContent />}
      </FrontendLessonShell>
    </div>
  );
}

export {
  API_QUESTION_OPTIONS,
  COMPLETE_REQUEST_CODE,
  CORRECT_ENDPOINT_MATCHES,
  ENDPOINTS,
  ENDPOINT_ACTIONS,
  FULL_FLOW,
  HTTP_METHODS,
  LESSON_STEPS,
  MEMORY_ITEMS,
};
export default FrontendApiLesson;
