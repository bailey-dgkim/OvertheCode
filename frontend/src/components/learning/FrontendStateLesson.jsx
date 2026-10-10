import { useState } from 'react';
import { Link } from 'react-router-dom';
import DevToolsLab from './DevToolsLab';
import FrontendLessonShell from './FrontendLessonShell';
import { useFrontendLessonProgress } from './frontendLessonProgress';
import OtcCodeQuiz from './OtcCodeQuiz';

const LESSON_STEPS = [
  { short: '같은 Component', title: '같은 Component인데 화면은 왜 달라질까?' },
  { short: '구조와 값', title: '화면에는 고정된 구조와 변하는 값이 있다' },
  { short: '변수의 함정', title: '값만 바꾸면 화면도 자동으로 바뀔까?' },
  { short: 'useState 해부', title: 'useState를 세 조각으로 나눠보기' },
  { short: '변경의 흐름', title: 'State가 화면을 바꾸는 과정' },
  { short: 'Variable vs State', title: '왜 그냥 변수 대신 State를 쓸까?' },
  { short: 'Component + State', title: 'Component는 현재 State로 화면을 결정한다' },
  { short: '미션 · status', title: 'setStatus가 바꾸는 화면을 찾아라' },
  { short: '미션 · itemCount', title: 'setItemCount가 바꾸는 화면을 찾아라' },
  { short: 'Props', title: '바깥에서 들어오는 값, Props' },
  { short: 'OTC 코드 적용', title: '진단 화면의 State를 실제 코드에서 찾아보자' },
  { short: '필수 암기', title: '03에서 기억할 여섯 개념' },
  { short: '다음 질문', title: '이제 사용자의 행동을 연결할 차례' },
];

const STATE_FLOW = [
  'State 변경',
  'React re-rendering',
  'DOM 반영',
  '화면 변경',
];

const MEMORY_ITEMS = [
  ['Variable', '값을 저장하기 위해 이름을 붙인 것'],
  ['State', 'Component가 기억하는 값. 변경되면 React가 다시 렌더링함'],
  ['useState()', 'Component에 State를 만드는 React Hook'],
  ['setState 계열 함수', 'State를 변경하는 함수'],
  ['Props', '부모 Component가 자식 Component에 전달하는 값'],
  ['Re-rendering', '값의 변화에 따라 React가 Component를 다시 실행해 화면을 갱신하는 과정'],
];

const PRACTICE_MISSIONS = [
  {
    id: 'status',
    command: 'setStatus("배송 완료");',
    question: '이 코드가 실행되면 화면의 어느 영역이 바뀔까요?',
    correctArea: 'status',
    answer: '배송 준비중 → 배송 완료',
  },
  {
    id: 'itemCount',
    command: 'setItemCount(4);',
    question: '이번에는 화면의 어느 영역이 바뀔까요?',
    correctArea: 'itemCount',
    answer: '상품 3개 → 상품 4개',
  },
];

const ORDER_COMPONENT = `function OrderCard() {
  const [status, setStatus] = useState("배송 준비중");

  return (
    <div>
      <h2>주문 #1024</h2>
      <p>상태: {status}</p>
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

function StateDefinition({ concept, children }) {
  return (
    <aside className="cv2-lesson-definition">
      <strong>{concept}</strong>
      <p>{children}</p>
    </aside>
  );
}

function OrderCardPreview({
  correctArea,
  detailLabel = '상세보기',
  highlightValues = false,
  itemCount = 3,
  onSelect,
  selectedArea,
  showItemCount = false,
  solved = false,
  status = '배송 준비중',
}) {
  const selectable = typeof onSelect === 'function';
  const areaClassName = (area) => [
    'cv2-state-order-card__area',
    highlightValues ? 'is-value' : '',
    selectedArea === area ? 'is-selected' : '',
    solved && correctArea === area ? 'is-correct' : '',
  ].filter(Boolean).join(' ');
  const areaProps = (area, label) => ({
    className: areaClassName(area),
    'data-area': area,
    ...(selectable ? {
      type: 'button',
      onClick: () => onSelect(area),
      'aria-pressed': selectedArea === area,
      'aria-label': `${label} 영역 선택`,
    } : {}),
  });

  return (
    <article className={`cv2-state-order-card${selectable ? ' is-selectable' : ''}`}>
      <div className="cv2-state-order-card__component">
        <span>OrderCard</span>
        <i>같은 구조</i>
      </div>
      {selectable ? (
        <>
          <button {...areaProps('orderId', '주문 번호')}>주문 #1024</button>
          <button {...areaProps('customer', '고객 이름')}>김철수</button>
          <button {...areaProps('status', '배송 상태')}>
            <span>상태</span>
            <strong>{status}</strong>
          </button>
          {showItemCount && (
            <button {...areaProps('itemCount', '상품 개수')}>
              상품 <strong>{itemCount}</strong>개
            </button>
          )}
        </>
      ) : (
        <>
          <h2 {...areaProps('orderId', '주문 번호')}>주문 #1024</h2>
          <p {...areaProps('customer', '고객 이름')}>김철수</p>
          <p {...areaProps('status', '배송 상태')}>
            <span>상태</span>
            <strong>{status}</strong>
          </p>
          {showItemCount && (
            <p {...areaProps('itemCount', '상품 개수')}>
              상품 <strong>{itemCount}</strong>개
            </p>
          )}
        </>
      )}
      {!showItemCount && (
        <div className={`cv2-state-order-card__detail${highlightValues ? ' is-structure' : ''}`}>
          {detailLabel}
        </div>
      )}
      {highlightValues && (
        <div className="cv2-state-order-card__legend" aria-label="표시 구분">
          <span><i /> 변하는 값</span>
          <span><i /> 고정 UI 구조</span>
        </div>
      )}
    </article>
  );
}

function SameComponentStep() {
  return (
    <>
      <p className="cv2-lesson-lead">
        02에서 만든 주문 카드가 잠시 뒤 다른 상태로 보입니다. Component 자체가 바뀐 걸까요?
      </p>
      <div className="cv2-state-card-comparison">
        <section>
          <span>지금</span>
          <OrderCardPreview status="배송 준비중" />
        </section>
        <div>
          <Arrow />
          <strong>시간이 지난 뒤</strong>
        </div>
        <section>
          <span>잠시 뒤</span>
          <OrderCardPreview status="배송 완료" />
        </section>
      </div>
      <aside className="cv2-lesson-emphasis">
        같은 화면 구조 안에 들어가는 값이 달라진 것입니다. 이처럼 Component가 기억하며 화면에 보여주는 값을 State라고 합니다.
      </aside>
    </>
  );
}

function StructureAndValueStep() {
  return (
    <>
      <p className="cv2-lesson-lead">
        화면은 <code>&lt;div&gt;</code>, <code>&lt;button&gt;</code> 같은 UI 구조와 그 안에 보여줄 현재 값을 함께 가집니다.
      </p>
      <div className="cv2-state-structure-grid">
        <OrderCardPreview highlightValues />
        <section className="cv2-state-code-panel">
          <span>OrderCard.jsx</span>
          <pre><code>{`function OrderCard() {
  const status = "배송 준비중";

  return (
    <div>
      <h2>주문 #1024</h2>
      <p>{status}</p>
    </div>
  );
}`}</code></pre>
        </section>
      </div>
      <div className="cv2-browser-dom-definitions">
        <StateDefinition concept="Variable">
          값을 저장하기 위해 이름을 붙인 것 — <code>const status = &quot;배송 준비중&quot;;</code>
        </StateDefinition>
        <StateDefinition concept="{ } in JSX">
          JSX 안에서 JavaScript 값을 사용할 때 쓰는 표현 — <code>&lt;p&gt;{'{status}'}&lt;/p&gt;</code>
        </StateDefinition>
      </div>
    </>
  );
}

function VariableTrapStep() {
  const [answer, setAnswer] = useState(null);
  const isCorrect = answer === 'stays';

  return (
    <>
      <p className="cv2-lesson-lead">일반 JavaScript 변수의 값을 직접 바꿔보겠습니다.</p>
      <div className="cv2-state-trap">
        <section className="cv2-state-code-panel">
          <span>일반 변수 변경</span>
          <pre><code>{`let status = "배송 준비중";

status = "배송 완료";`}</code></pre>
        </section>
        <section>
          <p>질문</p>
          <h2>status가 바뀌면 React 화면도 자동으로 다시 그려질까요?</h2>
          <div className="cv2-state-trap__answers">
            <button type="button" onClick={() => setAnswer('changes')} aria-pressed={answer === 'changes'}>
              네, 화면도 바뀝니다
            </button>
            <button type="button" onClick={() => setAnswer('stays')} aria-pressed={answer === 'stays'}>
              아니요, 화면은 그대로입니다
            </button>
          </div>
        </section>
      </div>
      {answer && (
        <aside className={`cv2-state-feedback${isCorrect ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{isCorrect ? '정답입니다.' : '아직 한 단계가 빠졌습니다.'}</strong>
          <p>
            React는 아무 JavaScript 변수나 감시하지 않습니다. 일반 변수만 바꾸면 React는 변경 사실을 모르므로 화면을 다시 렌더링하지 않습니다.
          </p>
        </aside>
      )}
    </>
  );
}

function UseStateStep() {
  const pieces = [
    { token: 'status', label: '현재 값', description: '지금 화면에 보여줄 값' },
    { token: '"배송 준비중"', label: '처음 값', description: 'Component가 처음 시작할 때의 값' },
    { token: 'setStatus', label: '변경 함수', description: 'status를 바꾸고 React에 알리는 함수' },
  ];

  return (
    <>
      <p className="cv2-lesson-lead">처음 보면 낯선 한 줄을 통째로 외우지 않고, 역할이 다른 세 조각으로 나눠봅니다.</p>
      <pre className="cv2-state-main-code"><code>{'const [status, setStatus] = useState("배송 준비중");'}</code></pre>
      <div className="cv2-state-hook-pieces">
        {pieces.map((piece, index) => (
          <article key={piece.token}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <code>{piece.token}</code>
            <strong>{piece.label}</strong>
            <p>{piece.description}</p>
          </article>
        ))}
      </div>
      <aside className="cv2-lesson-definition">
        <strong>setStatus(&quot;배송 완료&quot;)</strong>
        <p>현재 State를 배송 완료로 바꾸고, React가 필요한 화면을 다시 렌더링하게 합니다.</p>
      </aside>
    </>
  );
}

function StateFlowStep() {
  const [labStatus, setLabStatus] = useState('배송 준비중');

  return (
    <>
      <p className="cv2-lesson-lead">setStatus를 실행하면 값 하나가 바뀌는 데서 끝나지 않고 화면까지 다음 흐름이 이어집니다.</p>
      <ol className="cv2-state-flow" aria-label={STATE_FLOW.join(' 다음 ')}>
        {STATE_FLOW.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{item}</strong>
            {index < STATE_FLOW.length - 1 && <Arrow direction="down" />}
          </li>
        ))}
      </ol>
      <div className="cv2-state-value-change">
        <code>배송 준비중</code>
        <Arrow />
        <code>배송 완료</code>
      </div>
      <StateDefinition concept="Re-rendering">
        값의 변화에 따라 React가 Component를 다시 실행해 화면을 갱신하는 과정
      </StateDefinition>
      <DevToolsLab
        tool="Elements"
        title="State가 바뀔 때 DOM도 바뀌는지 관찰하자"
        steps={[
          'Elements를 열고 주문 카드의 배송 준비중 텍스트를 찾습니다.',
          'Elements를 열어둔 상태에서 화면의 배송 완료 처리 버튼을 누릅니다.',
          'p 요소의 텍스트가 배송 완료로 바뀌는 순간을 확인합니다.',
          'State 변경 → React re-rendering → DOM 반영 순서를 다시 읽습니다.',
        ]}
        answer="이번에는 Elements에서 DOM을 직접 고친 것이 아닙니다. State가 변경되자 React가 Component를 다시 렌더링했고, 그 결과가 DOM에 반영된 것입니다."
      >
        <div className="cv2-devtools-lab__demo">
          <p>현재 DOM의 배송 상태: <strong>{labStatus}</strong></p>
          <button type="button" onClick={() => setLabStatus('배송 완료')} disabled={labStatus === '배송 완료'}>
            배송 완료 처리
          </button>
        </div>
      </DevToolsLab>
    </>
  );
}

function VariableVsStateStep() {
  const comparisons = [
    {
      title: '일반 변수 변경',
      code: 'status = "배송 완료";',
      steps: ['status 변경', '끝', '화면은 변경 사실을 모름'],
      type: 'variable',
    },
    {
      title: 'State 변경',
      code: 'setStatus("배송 완료");',
      steps: ['status 변경', 'React가 변경을 인지', '다시 렌더링', '화면 변경'],
      type: 'state',
    },
  ];

  return (
    <>
      <p className="cv2-lesson-lead">둘 다 JavaScript 값은 바뀌지만, React 화면과 연결되는지는 다릅니다.</p>
      <div className="cv2-state-comparison-grid">
        {comparisons.map((comparison) => (
          <article className={`is-${comparison.type}`} key={comparison.title}>
            <span>{comparison.title}</span>
            <code>{comparison.code}</code>
            <ol>
              {comparison.steps.map((step, index) => (
                <li key={step}>
                  <strong>{step}</strong>
                  {index < comparison.steps.length - 1 && <Arrow direction="down" />}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
      <aside className="cv2-lesson-emphasis">
        State를 쓰는 이유는 단순히 값을 저장하기 위해서가 아니라, 값의 변경을 React 화면 갱신과 연결하기 위해서입니다.
      </aside>
    </>
  );
}

function ComponentStateStep() {
  return (
    <>
      <p className="cv2-lesson-lead">02에서 배운 Component의 의미를 한 단계 확장해봅니다.</p>
      <blockquote className="cv2-state-component-rule">
        <span>02에서</span>
        <p>Component = UI를 구성하는 단위</p>
        <Arrow direction="down" />
        <span>03에서</span>
        <p>Component는 현재 State를 기준으로 어떤 화면을 보여줄지 결정한다.</p>
      </blockquote>
      <div className="cv2-state-component-demo">
        <section className="cv2-state-code-panel">
          <span>같은 OrderCard Component</span>
          <pre><code>{ORDER_COMPONENT}</code></pre>
        </section>
        <div className="cv2-state-component-demo__screens">
          <div><code>status = &quot;배송 준비중&quot;</code><OrderCardPreview /></div>
          <div><code>status = &quot;배송 완료&quot;</code><OrderCardPreview status="배송 완료" /></div>
        </div>
      </div>
      <aside className="cv2-lesson-emphasis">Component가 바뀐 것이 아니라, Component가 가지고 있는 State가 바뀐 것입니다.</aside>
    </>
  );
}

function PracticeStep({ isSolved, mission, onSolved }) {
  const [selectedArea, setSelectedArea] = useState(isSolved ? mission.correctArea : null);
  const solved = isSolved || selectedArea === mission.correctArea;
  const status = solved && mission.id === 'status' ? '배송 완료' : '배송 준비중';
  const itemCount = solved && mission.id === 'itemCount' ? 4 : 3;

  const selectArea = (area) => {
    setSelectedArea(area);
    if (area === mission.correctArea) onSolved();
  };

  return (
    <>
      <p className="cv2-lesson-lead">코드와 화면을 연결해보세요. 정답이라고 생각하는 화면 영역을 직접 선택합니다.</p>
      <div className="cv2-state-practice">
        <section>
          <span>실행할 코드</span>
          <pre><code>{mission.command}</code></pre>
          <h2>{mission.question}</h2>
          <p>주문 번호, 고객 이름, 배송 상태, 상품 개수 중 하나를 클릭하세요.</p>
        </section>
        <OrderCardPreview
          correctArea={mission.correctArea}
          itemCount={itemCount}
          onSelect={selectArea}
          selectedArea={selectedArea}
          showItemCount
          solved={solved}
          status={status}
        />
      </div>
      {selectedArea && (
        <aside className={`cv2-state-feedback${solved ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{solved ? '정답입니다.' : '이 영역은 그대로입니다.'}</strong>
          <p>{solved ? mission.answer : '함수 이름과 JSX에서 사용한 변수 이름을 다시 연결해보세요.'}</p>
        </aside>
      )}
    </>
  );
}

function PropsStep() {
  const rows = [
    ['값은 어디서 오나', '부모 Component', '자기 Component'],
    ['누가 관리하나', '부모', '자기 자신'],
    ['주요 용도', '값을 전달', '현재 상태를 기억'],
    ['변경되면', '다시 렌더링될 수 있음', '다시 렌더링됨'],
  ];

  return (
    <>
      <p className="cv2-lesson-lead">화면의 값이 언제나 자기 Component 안에서 만들어지는 것은 아닙니다.</p>
      <div className="cv2-state-props-code">
        <section className="cv2-state-code-panel">
          <span>부모 Component</span>
          <pre><code>{`<OrderCard
  orderId="1024"
  customer="김철수"
/>`}</code></pre>
        </section>
        <Arrow />
        <section className="cv2-state-code-panel">
          <span>자식 Component</span>
          <pre><code>{`function OrderCard({
  orderId,
  customer
}) { ... }`}</code></pre>
        </section>
      </div>
      <StateDefinition concept="Props">
        부모 Component가 자식 Component에게 전달하는 값
      </StateDefinition>
      <div className="cv2-state-table-wrap">
        <table className="cv2-state-props-table">
          <thead><tr><th>비교</th><th>Props</th><th>State</th></tr></thead>
          <tbody>
            {rows.map(([label, props, state]) => (
              <tr key={label}><th>{label}</th><td>{props}</td><td>{state}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MemoryStep() {
  return (
    <>
      <p className="cv2-lesson-lead">03에서 반드시 기억할 개념은 여섯 개입니다.</p>
      <dl className="cv2-state-memory-grid">
        {MEMORY_ITEMS.map(([concept, meaning], index) => (
          <div key={concept}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <dt>{concept}</dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
      <div className="cv2-state-final-flow">
        {['State / Props 변경', 'Component 다시 렌더링', 'DOM 반영', '화면 변경'].map((item, index, items) => (
          <div key={item}>
            <strong>{item}</strong>
            {index < items.length - 1 && <Arrow />}
          </div>
        ))}
      </div>
    </>
  );
}

function BridgeStep() {
  return (
    <div className="cv2-state-bridge">
      <p className="cv2-eyebrow">Next · Chapter 04</p>
      <OrderCardPreview detailLabel="배송 완료 처리" status="배송 준비중" />
      <div>
        <span>화면과 State의 연결은 알았습니다.</span>
        <h2>그런데 사용자가 <strong>[배송 완료 처리]</strong> 버튼을 눌렀다는 걸 React는 어떻게 알까요?</h2>
        <p>다음 Chapter에서는 사용자 입력이 Event와 onClick을 거쳐 State 변경으로 이어지는 과정을 배웁니다.</p>
        <Link className="cv2-button cv2-button--primary" to="/chapters/frontend-review/learn">
          Chapter 04 · 사용자 입력 살펴보기 →
        </Link>
      </div>
    </div>
  );
}

const STATIC_STEP_CONTENT = [
  SameComponentStep,
  StructureAndValueStep,
  VariableTrapStep,
  UseStateStep,
  StateFlowStep,
  VariableVsStateStep,
  ComponentStateStep,
  null,
  null,
  PropsStep,
  null,
  MemoryStep,
  BridgeStep,
];

function FrontendStateLesson({ chapter }) {
  const progress = useFrontendLessonProgress(chapter.id, LESSON_STEPS.length);
  const { completedMissionIds, stepIndex } = progress;
  const mission = stepIndex === 7 ? PRACTICE_MISSIONS[0] : stepIndex === 8 ? PRACTICE_MISSIONS[1] : null;
  const isProjectMission = stepIndex === 10;
  const missionId = mission ? `state-${mission.id}` : null;
  const missionSolved = !missionId || completedMissionIds.includes(missionId);
  const projectMissionSolved = completedMissionIds.includes('state-otc-code');
  const canContinue = (!mission || missionSolved) && (!isProjectMission || projectMissionSolved);
  const phaseIndex = stepIndex <= 6 ? 0 : stepIndex <= 8 ? 1 : 2;
  const StepContent = STATIC_STEP_CONTENT[stepIndex];

  return (
    <div className="cv2-state-lesson">
      <FrontendLessonShell
        canContinue={canContinue}
        chapter={chapter}
        lessonLabel="03 · Screen & State"
        nextBlockedLabel="정답 영역을 선택하세요"
        onAdvance={progress.advance}
        onComplete={progress.complete}
        onOpenStep={progress.openStep}
        onPrevious={progress.previous}
        phases={['개념 이해', '실습 미션', '정리와 연결']}
        phaseIndex={phaseIndex}
        recall={{
          choices: [
            { id: 'setter', label: 'State 변경 함수를 호출한다.' },
            { id: 'variable', label: '일반 변수에 새 값을 대입한다.' },
            { id: 'css', label: 'CSS class 이름을 바꾼다.' },
          ],
          correctChoiceId: 'setter',
          isSolved: completedMissionIds.includes('state-recall'),
          onSolved: () => progress.markMissionComplete('state-recall'),
          prompt: 'React가 값의 변경을 알고 화면을 다시 그리게 하려면 무엇을 해야 할까요?',
        }}
        stepIndex={stepIndex}
        steps={LESSON_STEPS}
        titleId="state-lesson-title"
        unlockedThrough={progress.unlockedThrough}
      >
        {mission ? (
          <PracticeStep
            isSolved={missionSolved}
            mission={mission}
            onSolved={() => progress.markMissionComplete(missionId)}
          />
        ) : isProjectMission ? (
          <OtcCodeQuiz
            file="src/components/landing/DiagnosisScreen.jsx"
            code={'const [answers, setAnswers] = useState([]);\nconst questionIndex = answers.length;'}
            prompt="답변 버튼을 누른 뒤 다음 질문이 나타나는 직접적인 이유는 무엇일까요?"
            choices={[
              { id: 'state', label: 'setAnswers가 State를 바꾸고 Component가 다시 렌더링되기 때문' },
              { id: 'css', label: 'CSS가 다음 질문을 자동으로 표시하기 때문' },
              { id: 'route', label: 'URL이 매번 다른 페이지로 이동하기 때문' },
            ]}
            correctChoiceId="state"
            explanation="answers 배열이 바뀌면 questionIndex도 달라지고, DiagnosisScreen이 현재 질문을 다시 계산해 렌더링합니다."
            isSolved={projectMissionSolved}
            onSolved={() => progress.markMissionComplete('state-otc-code')}
          />
        ) : <StepContent />}
      </FrontendLessonShell>
    </div>
  );
}

export { LESSON_STEPS, MEMORY_ITEMS, PRACTICE_MISSIONS, STATE_FLOW };
export default FrontendStateLesson;
