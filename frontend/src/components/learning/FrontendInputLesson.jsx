import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isCorrectSequence } from './frontendInputLessonUtils';
import DevToolsLab from './DevToolsLab';
import FrontendLessonShell from './FrontendLessonShell';
import { useFrontendLessonProgress } from './frontendLessonProgress';
import OtcCodeQuiz from './OtcCodeQuiz';

const LESSON_STEPS = [
  { short: '버튼과 State', title: '버튼 클릭과 State 변경 사이에는 무엇이 있을까?' },
  { short: 'Event', title: '사용자는 코드가 아니라 화면을 조작한다' },
  { short: 'onClick', title: 'React에서 클릭 Event를 연결하는 법' },
  { short: '전체 흐름', title: '사용자 행동에서 화면 변경까지 연결하기' },
  { short: 'Event Handler', title: 'handleXXX 함수는 왜 이렇게 많을까?' },
  { short: 'onChange', title: '버튼만 사용자 입력은 아니다' },
  { short: 'Event Object', title: 'Event에는 행동에 대한 정보가 들어 있다' },
  { short: '실행 순서 미션', title: '버튼 클릭 뒤 실행 순서를 맞춰라' },
  { short: 'OTC 코드 적용', title: '랜딩 버튼의 Event Handler를 실제 코드에서 읽어보자' },
  { short: '필수 암기', title: '04에서 기억할 다섯 개념' },
  { short: '다음 질문', title: '화면 밖의 서버로 이어질 차례' },
];

const EVENT_TYPES = [
  ['click', '버튼이나 요소를 클릭'],
  ['change', '입력값이나 선택값이 변경'],
  ['input', '입력창에 내용 입력'],
  ['submit', '폼의 내용을 제출'],
];

const INPUT_FLOW = [
  '사용자',
  '버튼 클릭',
  'click Event',
  'onClick',
  'Event Handler',
  'setStatus()',
  'State 변경',
  'Re-rendering',
  'DOM 반영',
  '화면 변경',
];

const MEMORY_ITEMS = [
  ['Event', '사용자의 클릭, 입력, 선택 등으로 브라우저에서 발생하는 사건'],
  ['onClick', '클릭 Event가 발생했을 때 실행할 동작을 연결'],
  ['onChange', '입력값 등이 변경됐을 때 실행할 동작을 연결'],
  ['Event Handler', 'Event가 발생했을 때 실행되는 함수'],
  ['Event Object', '발생한 Event에 대한 정보를 담은 객체'],
];

const SEQUENCE_CARDS = [
  { id: 'state', marker: '①', text: 'status가 "배송 완료"로 변경된다' },
  { id: 'click', marker: '②', text: '사용자가 버튼을 클릭한다' },
  { id: 'handler', marker: '③', text: 'handleComplete가 실행된다' },
  { id: 'render', marker: '④', text: '화면이 다시 렌더링된다' },
  { id: 'event', marker: '⑤', text: 'click Event가 발생한다' },
];

const CORRECT_SEQUENCE = ['click', 'event', 'handler', 'state', 'render'];

const ORDER_CARD_CODE = `function OrderCard() {
  const [status, setStatus] = useState("배송 준비중");

  function handleComplete() {
    setStatus("배송 완료");
  }

  return (
    <div>
      <p>{status}</p>

      <button onClick={handleComplete}>
        배송 완료 처리
      </button>
    </div>
  );
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

function EventOrderCard({ onComplete, status = '배송 준비중' }) {
  return (
    <article className="cv2-event-order-card">
      <div className="cv2-event-order-card__bar">
        <span>OrderCard</span>
        <i>주문 #1024</i>
      </div>
      <h2>주문 #1024</h2>
      <p>김철수</p>
      <div className="cv2-event-order-card__status">
        <span>상태</span>
        <strong className={status === '배송 완료' ? 'is-complete' : ''}>{status}</strong>
      </div>
      <button type="button" onClick={onComplete} disabled={!onComplete || status === '배송 완료'}>
        {status === '배송 완료' ? '배송 완료됨' : '배송 완료 처리'}
      </button>
    </article>
  );
}

function BridgeFromStateStep() {
  const [status, setStatus] = useState('배송 준비중');

  return (
    <>
      <p className="cv2-lesson-lead">
        03에서는 State가 바뀌면 React가 화면을 다시 렌더링한다는 것까지 배웠습니다. 이제 버튼과 State 사이를 직접 연결해봅니다.
      </p>
      <div className="cv2-event-opening">
        <EventOrderCard status={status} onComplete={() => setStatus('배송 완료')} />
        <section>
          <span>직접 눌러보세요</span>
          <h2>사용자가 버튼을 누른 사실을 React는 어떻게 알았을까요?</h2>
          <div className="cv2-event-opening__change">
            <code>배송 준비중</code><Arrow /><code>배송 완료</code>
          </div>
          <p>버튼 클릭과 <code>setStatus()</code> 사이에 Event와 Event Handler가 있습니다.</p>
        </section>
      </div>
    </>
  );
}

function EventStep() {
  const actions = [
    ['버튼 클릭', '마우스나 손가락으로 누르기'],
    ['글자 입력', '메모와 검색어 쓰기'],
    ['체크박스 선택', '옵션을 켜고 끄기'],
    ['메뉴 선택', '여러 값 중 하나 고르기'],
  ];

  return (
    <>
      <p className="cv2-lesson-lead">
        사용자는 <code>setStatus(&quot;배송 완료&quot;)</code> 같은 코드를 직접 실행하지 않습니다. 화면을 조작할 뿐입니다.
      </p>
      <div className="cv2-event-actions">
        {actions.map(([title, description], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <Definition concept="Event">
        클릭, 입력, 선택처럼 브라우저에서 발생하는 사건
      </Definition>
      <dl className="cv2-event-type-list">
        {EVENT_TYPES.map(([event, meaning]) => (
          <div key={event}><dt>{event}</dt><dd>{meaning}</dd></div>
        ))}
      </dl>
    </>
  );
}

function OnClickStep() {
  return (
    <>
      <p className="cv2-lesson-lead">버튼에 클릭됐을 때 실행할 함수를 연결해야 실제 동작이 생깁니다.</p>
      <div className="cv2-event-code-comparison">
        <section>
          <span>연결 전 · 눌러도 아무 일 없음</span>
          <pre><code>{`<button>
  배송 완료 처리
</button>`}</code></pre>
        </section>
        <Arrow />
        <section className="is-connected">
          <span>연결 후 · 클릭에 반응함</span>
          <pre><code>{`<button onClick={handleComplete}>
  배송 완료 처리
</button>`}</code></pre>
        </section>
      </div>
      <div className="cv2-event-connection">
        <article><code>onClick</code><strong>이 요소가 클릭됐을 때</strong></article>
        <Arrow />
        <article><code>handleComplete</code><strong>그때 실행할 함수</strong></article>
      </div>
      <section className="cv2-event-full-code">
        <span>전체 OrderCard.jsx</span>
        <pre><code>{ORDER_CARD_CODE}</code></pre>
      </section>
      <DevToolsLab
        tool="Console"
        title="현재 웹페이지에서 JavaScript를 직접 실행해보자"
        steps={[
          'DevTools의 Console 탭을 엽니다.',
          'const price = 10000; 을 입력하고 Enter를 누릅니다.',
          'const quantity = 3; 을 입력하고 Enter를 누릅니다.',
          'price * quantity를 입력해 30000이 나오는지 확인합니다.',
          'console.log("버튼 클릭"); 을 실행해 출력 위치를 확인합니다.',
        ]}
        answer="Console에서는 현재 웹페이지의 실행 환경에서 JavaScript를 직접 실행하고 값과 오류를 확인할 수 있습니다."
      />
    </>
  );
}

function FullFlowStep() {
  return (
    <>
      <p className="cv2-lesson-lead">사용자의 화면 조작이 03에서 배운 State 변경 흐름으로 들어가는 전체 과정입니다.</p>
      <ol className="cv2-event-flow" aria-label={INPUT_FLOW.join(' 다음 ')}>
        {INPUT_FLOW.map((item, index) => (
          <li key={item} className={index === 2 || index === 4 || index === 6 ? 'is-key' : ''}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
            {index < INPUT_FLOW.length - 1 && <Arrow />}
          </li>
        ))}
      </ol>
      <aside className="cv2-lesson-emphasis">
        클릭 자체가 State를 바꾸는 것이 아닙니다. Event를 받은 Event Handler가 setStatus를 실행하면서 State 변경이 시작됩니다.
      </aside>
    </>
  );
}

function HandlerStep() {
  const handlerNames = [
    ['handleClick', '클릭 처리'],
    ['handleChange', '값 변경 처리'],
    ['handleSubmit', '제출 처리'],
    ['handleDelete', '삭제 처리'],
    ['handleSave', '저장 처리'],
  ];

  return (
    <>
      <p className="cv2-lesson-lead">실제 React 프로젝트에서 <code>handleXXX</code>라는 이름이 반복해서 보이는 이유를 알아봅니다.</p>
      <div className="cv2-event-handler-grid">
        <section className="cv2-event-handler-code">
          <span>Event가 발생하면 실행</span>
          <pre><code>{`function handleComplete() {
  setStatus("배송 완료");
}`}</code></pre>
        </section>
        <Definition concept="Event Handler">
          Event가 발생했을 때 실행되는 함수
        </Definition>
      </div>
      <div className="cv2-event-handler-names">
        {handlerNames.map(([name, meaning]) => (
          <article key={name}><code>{name}</code><span>{meaning}</span></article>
        ))}
      </div>
      <aside className="cv2-lesson-emphasis">
        <code>handleXXX</code>를 발견하면 “사용자 행동에 반응하는 코드일 가능성이 높다”고 추측할 수 있습니다.
      </aside>
    </>
  );
}

function OnChangeStep() {
  const [memo, setMemo] = useState('문 앞에 놓아주세요');

  return (
    <>
      <p className="cv2-lesson-lead">글자를 입력하는 행동도 Event입니다. 아래 입력창을 직접 수정해보세요.</p>
      <div className="cv2-event-input-demo">
        <section>
          <label htmlFor="order-memo">주문 메모</label>
          <input
            id="order-memo"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
          <div><span>현재 memo State</span><strong>{memo || '(비어 있음)'}</strong></div>
        </section>
        <section>
          <span>React 코드</span>
          <pre><code>{`<input
  value={memo}
  onChange={handleMemoChange}
/>`}</code></pre>
          <p>입력값이 바뀔 때마다 <code>change Event</code>를 받아 Handler가 실행됩니다.</p>
        </section>
      </div>
      <Definition concept="onChange">
        입력값이나 선택값이 변경됐을 때 실행할 동작을 연결
      </Definition>
    </>
  );
}

function EventObjectStep() {
  const [value, setValue] = useState('');

  return (
    <>
      <p className="cv2-lesson-lead">Event가 발생하면 “무슨 일이 일어났는지”에 대한 정보도 Handler에 함께 전달됩니다.</p>
      <div className="cv2-event-object-demo">
        <section>
          <label htmlFor="event-object-input">아무 글자나 입력하세요</label>
          <input
            id="event-object-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="예: 문 앞에 놓아주세요"
          />
          <div className="cv2-event-object-card">
            <span>event</span>
            <div><code>target</code><Arrow /><code>value</code><Arrow /><strong>{value || '현재 입력값'}</strong></div>
          </div>
        </section>
        <section className="cv2-event-handler-code">
          <span>Event Object 사용</span>
          <pre><code>{`function handleMemoChange(event) {
  setMemo(event.target.value);
}`}</code></pre>
          <p><code>event.target.value</code>는 지금 입력창에 들어 있는 값을 가져오는 대표적인 코드입니다.</p>
        </section>
      </div>
      <Definition concept="Event Object">
        발생한 Event에 대한 정보를 담은 객체. 이 Chapter에서는 “사용자가 무엇을 했는지에 관한 정보가 들어 있다”까지만 기억합니다.
      </Definition>
    </>
  );
}

function SequenceMissionStep({ isSolved, onSolved }) {
  const [items, setItems] = useState(isSolved
    ? CORRECT_SEQUENCE.map((id) => SEQUENCE_CARDS.find((item) => item.id === id))
    : SEQUENCE_CARDS);
  const [submitted, setSubmitted] = useState(isSolved);
  const correct = isCorrectSequence(items, CORRECT_SEQUENCE);

  const moveItem = (index, offset) => {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    setItems(nextItems);
    setSubmitted(false);
  };

  const checkSequence = () => {
    setSubmitted(true);
    if (correct) onSolved();
  };

  return (
    <>
      <p className="cv2-lesson-lead">카드 오른쪽의 화살표로 순서를 바꾼 뒤 실행 흐름을 확인하세요.</p>
      <div className="cv2-event-mission-context">
        <EventOrderCard status="배송 준비중" />
        <section>
          <span>주어진 코드</span>
          <pre><code>{`function handleComplete() {
  setStatus("배송 완료");
}

<button onClick={handleComplete}>
  배송 완료 처리
</button>`}</code></pre>
        </section>
      </div>
      <ol className="cv2-event-sequence">
        {items.map((item, index) => (
          <li key={item.id}>
            <span className="cv2-event-sequence__position">{index + 1}</span>
            <span className="cv2-event-sequence__marker">{item.marker}</span>
            <strong>{item.text}</strong>
            <span className="cv2-event-sequence__actions">
              <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label={`${item.text} 위로 이동`}>↑</button>
              <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} aria-label={`${item.text} 아래로 이동`}>↓</button>
            </span>
          </li>
        ))}
      </ol>
      <div className="cv2-event-sequence__check">
        <button className="cv2-button cv2-button--primary" type="button" onClick={checkSequence}>실행 순서 확인</button>
      </div>
      {submitted && (
        <aside className={`cv2-state-feedback${correct ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{correct ? '정답입니다.' : '아직 실행 흐름이 맞지 않습니다.'}</strong>
          <p>{correct ? '② → ⑤ → ③ → ① → ④' : '사용자 행동 다음에 Event가 발생하고, Handler가 State를 바꾼다는 순서로 다시 정리해보세요.'}</p>
        </aside>
      )}
    </>
  );
}

function MemoryStep() {
  const relation = ['사용자 입력', 'Event', 'Event Handler', 'State 변경', 'Re-rendering', '화면 변경'];

  return (
    <>
      <p className="cv2-lesson-lead">이제 React 코드에서 사용자 행동이 시작되는 지점을 읽을 수 있습니다.</p>
      <dl className="cv2-event-memory-grid">
        {MEMORY_ITEMS.map(([concept, meaning], index) => (
          <div key={concept}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <dt>{concept}</dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
      <div className="cv2-event-core-flow" aria-label={relation.join(' 다음 ')}>
        {relation.map((item, index) => (
          <div key={item}><strong>{item}</strong>{index < relation.length - 1 && <Arrow />}</div>
        ))}
      </div>
    </>
  );
}

function ApiBridgeStep() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="cv2-event-api-bridge">
      <p className="cv2-eyebrow">Next · Chapter 05</p>
      <section className="cv2-event-order-form">
        <span>새 주문</span>
        <h2>아메리카노 2잔</h2>
        <p>메모 · 문 앞에 놓아주세요</p>
        <button type="button" onClick={() => setSubmitted(true)} disabled={submitted}>
          {submitted ? '주문 정보 전송 준비됨' : '주문하기'}
        </button>
        {submitted && <p className="cv2-event-order-form__feedback" role="status">화면 밖의 서버로 보낼 방법이 필요합니다.</p>}
      </section>
      <section>
        <span>화면 안의 State를 바꾸는 방법은 알았습니다.</span>
        <h2>그런데 사용자가 <strong>[주문하기]</strong>를 누르면 이 정보는 어떻게 서버까지 갈까요?</h2>
        <p>다음 Chapter에서는 fetch와 HTTP Request가 브라우저 밖의 서버까지 데이터를 전달하는 과정을 배웁니다.</p>
        <Link className="cv2-button cv2-button--primary" to="/chapters/frontend-api-call/learn">
          Chapter 05 · API 호출의 시작 살펴보기 →
        </Link>
      </section>
    </div>
  );
}

const STATIC_STEP_CONTENT = [
  BridgeFromStateStep,
  EventStep,
  OnClickStep,
  FullFlowStep,
  HandlerStep,
  OnChangeStep,
  EventObjectStep,
  null,
  null,
  MemoryStep,
  ApiBridgeStep,
];

function FrontendInputLesson({ chapter }) {
  const progress = useFrontendLessonProgress(chapter.id, LESSON_STEPS.length);
  const { completedMissionIds, stepIndex } = progress;
  const isMission = stepIndex === 7;
  const isProjectMission = stepIndex === 8;
  const missionSolved = completedMissionIds.includes('input-sequence');
  const projectMissionSolved = completedMissionIds.includes('input-otc-code');
  const canContinue = (!isMission || missionSolved) && (!isProjectMission || projectMissionSolved);
  const phaseIndex = stepIndex <= 6 ? 0 : stepIndex <= 8 ? 1 : 2;
  const StepContent = STATIC_STEP_CONTENT[stepIndex];

  return (
    <div className="cv2-input-lesson">
      <FrontendLessonShell
        canContinue={canContinue}
        chapter={chapter}
        lessonLabel="04 · User Input"
        nextBlockedLabel="실행 순서를 맞춰주세요"
        onAdvance={progress.advance}
        onComplete={progress.complete}
        onOpenStep={progress.openStep}
        onPrevious={progress.previous}
        phases={['입력과 코드 연결', '실행 순서 미션', '정리와 API 연결']}
        phaseIndex={phaseIndex}
        recall={{
          choices: [
            { id: 'flow', label: 'Event → Handler → State 변경 → 재렌더링' },
            { id: 'style', label: 'CSS → Event → Database → 재렌더링' },
            { id: 'server', label: 'Server → JSX → Event → CSS' },
          ],
          correctChoiceId: 'flow',
          isSolved: completedMissionIds.includes('input-recall'),
          onSolved: () => progress.markMissionComplete('input-recall'),
          prompt: '사용자가 버튼을 누른 뒤 화면이 바뀌는 기본 순서는 무엇일까요?',
        }}
        stepIndex={stepIndex}
        steps={LESSON_STEPS}
        titleId="input-lesson-title"
        unlockedThrough={progress.unlockedThrough}
      >
        {isMission ? (
          <SequenceMissionStep
            isSolved={missionSolved}
            onSolved={() => progress.markMissionComplete('input-sequence')}
          />
        ) : isProjectMission ? (
          <OtcCodeQuiz
            file="src/components/landing/LandingScreen.jsx"
            code={'<button onClick={() => setIsModalOpen(true)}>\n  Over the Code가 필요한 이유\n</button>'}
            prompt="이 버튼을 누르면 모달이 열리는 이유를 가장 정확하게 설명한 것은 무엇일까요?"
            choices={[
              { id: 'handler', label: 'click Event가 onClick의 함수를 실행해 isModalOpen State를 바꾸기 때문' },
              { id: 'text', label: '버튼 문구에 Modal이라는 단어가 포함되어 있기 때문' },
              { id: 'css', label: '파란색 버튼 CSS가 모달을 표시하기 때문' },
            ]}
            correctChoiceId="handler"
            explanation="onClick에 연결된 함수가 Event Handler 역할을 하고, State 변경 결과로 모달이 조건부 렌더링됩니다."
            isSolved={projectMissionSolved}
            onSolved={() => progress.markMissionComplete('input-otc-code')}
          />
        ) : <StepContent />}
      </FrontendLessonShell>
    </div>
  );
}

export {
  CORRECT_SEQUENCE,
  EVENT_TYPES,
  INPUT_FLOW,
  LESSON_STEPS,
  MEMORY_ITEMS,
  SEQUENCE_CARDS,
};
export default FrontendInputLesson;
