import { useState } from 'react';
import DevToolsLab from './DevToolsLab';
import FrontendLessonShell from './FrontendLessonShell';
import { useFrontendLessonProgress } from './frontendLessonProgress';

const LESSON_STEPS = [
  { short: 'HTML에서 화면', title: 'HTML을 화면으로 만드는 과정' },
  { short: 'DOM', title: 'DOM이란 무엇인가?' },
  { short: 'React의 위치', title: 'React는 어디에 있는가?' },
  { short: 'Component', title: 'Component란 무엇인가?' },
  { short: 'JSX · .jsx', title: 'JSX와 .jsx란 무엇인가?' },
  { short: '렌더링', title: 'Component가 DOM에 반영되는 과정' },
  { short: '화면에서 찾기', title: '실제 화면에서 Component 찾기' },
  { short: 'OTC 코드 추적', title: '실제 OTC에서 버튼을 만드는 파일을 찾아보자' },
  { short: '필수 암기', title: '02 필수 암기' },
];

const ORDER_HTML = `<body>
  <h1>주문 관리</h1>
  <button>주문하기</button>
</body>`;

const ORDER_COMPONENT = `function OrderCard() {
  return (
    <div>
      <h2>주문 #1024</h2>
      <button>상세보기</button>
    </div>
  );
}`;

const MEMORY_ITEMS = [
  ['Browser', '웹 코드를 해석·실행하고 화면을 제공하는 프로그램'],
  ['HTML', '웹페이지의 구조'],
  ['CSS', '웹페이지의 모양'],
  ['JavaScript', '웹페이지의 동작을 구현하는 프로그래밍 언어'],
  ['DOM', '브라우저가 웹페이지를 구조화해서 표현한 것'],
  ['React', 'JavaScript로 UI를 만들기 위한 라이브러리'],
  ['Component', 'React에서 UI를 구성하는 단위'],
  ['JSX', 'JavaScript 안에서 UI 구조를 표현하는 문법'],
  ['.jsx', 'JSX를 포함한 JavaScript 파일에 흔히 사용하는 확장자'],
];

function Arrow({ direction = 'right' }) {
  return <span className={`cv2-lesson-arrow cv2-lesson-arrow--${direction}`} aria-hidden="true">→</span>;
}

function BrowserDefinition() {
  return (
    <aside className="cv2-lesson-definition">
      <strong>Browser</strong>
      <p>웹 코드를 해석하고 실행해 사용자가 볼 화면을 만드는 프로그램</p>
    </aside>
  );
}

function BrowserScreen({ card = false }) {
  return (
    <div className={`cv2-lesson-browser-screen${card ? ' cv2-lesson-browser-screen--card' : ''}`}>
      <div className="cv2-lesson-browser-screen__bar" aria-hidden="true">
        <span /><span /><span />
        <i>웹페이지</i>
      </div>
      <div className="cv2-lesson-browser-screen__body">
        {card ? (
          <article>
            <small>OrderCard</small>
            <h2>주문 #1024</h2>
            <p>배송 준비중</p>
            <button type="button" tabIndex="-1">상세보기</button>
          </article>
        ) : (
          <>
            <h2>주문 관리</h2>
            <button type="button" tabIndex="-1">주문하기</button>
          </>
        )}
      </div>
    </div>
  );
}

function HtmlToScreenStep() {
  return (
    <>
      <p className="cv2-lesson-lead">브라우저는 받은 HTML을 해석해서 화면을 만듭니다.</p>
      <div className="cv2-transform-diagram">
        <section>
          <span>HTML</span>
          <pre><code>{ORDER_HTML}</code></pre>
        </section>
        <Arrow />
        <section className="cv2-transform-diagram__browser">
          <span>Browser</span>
          <strong>해석하고 실행</strong>
        </section>
        <Arrow />
        <section>
          <span>화면</span>
          <BrowserScreen />
        </section>
      </div>
    </>
  );
}

function DomStep() {
  return (
    <>
      <p className="cv2-lesson-lead">브라우저는 HTML을 텍스트 덩어리로 두지 않고 구조화해서 다룹니다.</p>
      <div className="cv2-dom-explanation">
        <section>
          <span>받은 HTML</span>
          <pre><code>{ORDER_HTML}</code></pre>
        </section>
        <Arrow />
        <section>
          <span>브라우저가 표현한 구조</span>
          <pre className="cv2-dom-tree"><code>{`document
└── body
    ├── h1
    │   └── "주문 관리"
    │
    └── button
        └── "주문하기"`}</code></pre>
        </section>
      </div>
      <div className="cv2-browser-dom-definitions">
        <BrowserDefinition />
        <aside className="cv2-lesson-definition">
          <strong>DOM</strong>
          <p>브라우저가 웹페이지를 구조화해서 표현한 것</p>
        </aside>
      </div>
      <DevToolsLab
        tool="Elements"
        title="주문 카드의 실제 DOM을 찾아보자"
        steps={[
          '화면의 주문 카드에서 우클릭한 뒤 검사를 선택합니다.',
          'Elements에서 주문 번호를 가진 h2 요소를 찾습니다.',
          '배송 준비중 텍스트를 배송 완료로 직접 수정합니다.',
          '화면이 바뀐 것을 확인한 뒤 페이지를 새로고침합니다.',
          '텍스트가 원래 값으로 돌아오는지 확인합니다.',
        ]}
        answer="Elements에서 바꾼 것은 현재 브라우저가 가진 DOM입니다. React 소스코드나 서버 데이터는 수정하지 않았기 때문에 새로고침하면 원래 코드와 데이터로 DOM이 다시 만들어집니다."
      >
        <BrowserScreen card />
      </DevToolsLab>
    </>
  );
}

function ReactPositionStep() {
  return (
    <>
      <p className="cv2-lesson-lead">React도 결국 JavaScript 쪽에 있는 기술입니다.</p>
      <div className="cv2-react-position-map">
        <div className="cv2-react-position-map__web">
          <strong>HTML</strong>
          <strong>CSS</strong>
          <div>
            <strong>JavaScript</strong>
            <span>└── React</span>
            <span>└── Component / JSX</span>
          </div>
        </div>
        <Arrow direction="down" />
        <strong className="cv2-react-position-map__browser">Browser</strong>
        <Arrow direction="down" />
        <strong className="cv2-react-position-map__screen">화면</strong>
      </div>
      <aside className="cv2-lesson-emphasis">
        React라는 별도의 프로그램이 화면을 띄우는 것이 아니라,
        브라우저에서 실행되는 JavaScript를 이용합니다.
      </aside>
    </>
  );
}

function ComponentStep() {
  return (
    <>
      <p className="cv2-lesson-lead">React에서는 UI를 구성하는 단위인 Component를 작성합니다.</p>
      <div className="cv2-component-explanation">
        <section>
          <span>OrderCard Component</span>
          <pre><code>{ORDER_COMPONENT}</code></pre>
        </section>
        <Arrow />
        <section>
          <span>화면에서 보이는 UI 단위</span>
          <BrowserScreen card />
        </section>
      </div>
      <aside className="cv2-lesson-definition">
        <strong>Component</strong>
        <p>React에서 UI를 구성하는 단위</p>
      </aside>
    </>
  );
}

function JsxStep() {
  return (
    <>
      <p className="cv2-lesson-lead">Component 안에서 UI 구조는 JSX 문법으로 표현합니다.</p>
      <div className="cv2-jsx-file">
        <div className="cv2-jsx-file__tab"><span>OrderCard</span><strong>.jsx</strong></div>
        <pre><code>{ORDER_COMPONENT}</code></pre>
        <div className="cv2-jsx-file__labels" aria-hidden="true">
          <span>JavaScript</span>
          <span>JSX로 표현한 UI 구조</span>
        </div>
      </div>
      <div className="cv2-browser-dom-definitions">
        <aside className="cv2-lesson-definition">
          <strong>JSX</strong>
          <p>JavaScript 안에서 UI 구조를 표현하는 문법</p>
        </aside>
        <aside className="cv2-lesson-definition">
          <strong>.jsx</strong>
          <p>JSX를 포함한 JavaScript 파일에 흔히 사용하는 확장자</p>
        </aside>
      </div>
    </>
  );
}

function RenderingStep() {
  return (
    <>
      <p className="cv2-lesson-lead">직접 작성한 HTML과 React Component는 모두 브라우저의 DOM을 거쳐 화면에 도착합니다.</p>
      <div className="cv2-rendering-routes">
        <div>
          <strong>직접 HTML 작성</strong>
          <Arrow />
          <strong>DOM</strong>
          <Arrow />
          <strong>화면</strong>
        </div>
        <div>
          <strong>React Component</strong>
          <Arrow />
          <strong>JSX</strong>
          <Arrow />
          <strong>React 렌더링</strong>
          <Arrow />
          <strong>DOM</strong>
          <Arrow />
          <strong>화면</strong>
        </div>
      </div>
      <aside className="cv2-lesson-emphasis">DOM은 React의 개념이 아니라 브라우저의 개념입니다.</aside>
    </>
  );
}

function FindComponentStep() {
  return (
    <>
      <p className="cv2-lesson-lead">화면의 주문 카드와 그것을 구성하는 Component를 연결해서 봅니다.</p>
      <div className="cv2-find-component">
        <section>
          <span>실제 화면</span>
          <BrowserScreen card />
        </section>
        <div className="cv2-find-component__link" aria-hidden="true">
          <strong>OrderCard</strong>
          <Arrow />
        </div>
        <section>
          <span>OrderCard.jsx</span>
          <pre><code>{ORDER_COMPONENT}</code></pre>
        </section>
      </div>
    </>
  );
}

function OtcTraceMission({ isSolved, onSolved }) {
  const [answer, setAnswer] = useState(isSolved ? 'CurriculumHome.jsx' : '');
  const [submitted, setSubmitted] = useState(isSolved);
  const normalized = answer.toLowerCase().replaceAll(' ', '');
  const correct = normalized.includes('curriculumhome');

  const check = () => {
    setSubmitted(true);
    if (correct) onSolved();
  };

  return (
    <div className="cv2-project-checkpoint">
      <p className="cv2-lesson-lead">지금 보고 있는 OTC 프로젝트의 실제 코드를 따라가 봅니다.</p>
      <ol>
        <li><span>1</span><p><code>App.jsx</code>에서 <code>/curriculum</code> 주소가 어떤 화면을 여는지 확인합니다.</p></li>
        <li><span>2</span><p>연결된 화면에서 <code>진단테스트 바로가기</code> 문구를 검색합니다.</p></li>
        <li><span>3</span><p>찾은 <code>Link</code>의 <code>className</code>으로 CSS 위치까지 추적합니다.</p></li>
      </ol>
      <pre><code>{`<Link className="cv2-diagnosis-card" to="/diagnosis">
  진단테스트 바로가기 →
</Link>`}</code></pre>
      <label htmlFor="otc-component-answer">이 버튼 자체를 없애려면 먼저 수정할 파일 이름을 직접 적어보세요.</label>
      <div className="cv2-project-checkpoint__answer">
        <input
          id="otc-component-answer"
          value={answer}
          placeholder="예: Example.jsx"
          onChange={(event) => {
            setAnswer(event.target.value);
            setSubmitted(false);
          }}
        />
        <button type="button" className="cv2-button cv2-button--primary" onClick={check}>확인</button>
      </div>
      {submitted && (
        <aside className={`cv2-state-feedback${correct ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{correct ? '맞습니다. CurriculumHome.jsx입니다.' : 'App.jsx에서 /curriculum이 연결하는 화면 이름을 다시 확인해보세요.'}</strong>
          {correct && <p>문구와 Link 구조는 JSX, 모양은 className을 따라 CSS에서 수정합니다.</p>}
        </aside>
      )}
    </div>
  );
}

function MemoryStep() {
  return (
    <>
      <p className="cv2-lesson-lead">02에서 반드시 기억할 개념과 의미입니다.</p>
      <dl className="cv2-lesson-memory-table">
        {MEMORY_ITEMS.map(([concept, meaning]) => (
          <div key={concept}>
            <dt>{concept}</dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

const STEP_CONTENT = [
  HtmlToScreenStep,
  DomStep,
  ReactPositionStep,
  ComponentStep,
  JsxStep,
  RenderingStep,
  FindComponentStep,
  null,
  MemoryStep,
];

function FrontendBrowserLesson({ chapter }) {
  const progress = useFrontendLessonProgress(chapter.id, LESSON_STEPS.length);
  const { completedMissionIds, stepIndex } = progress;
  const StepContent = STEP_CONTENT[stepIndex];
  const isProjectMission = stepIndex === 7;
  const missionSolved = completedMissionIds.includes('otc-component-trace');

  return (
    <FrontendLessonShell
      canContinue={!isProjectMission || missionSolved}
      chapter={chapter}
      lessonLabel="02 · Project Anatomy"
      nextBlockedLabel="파일 이름을 확인해주세요"
      onAdvance={progress.advance}
      onComplete={progress.complete}
      onOpenStep={progress.openStep}
      onPrevious={progress.previous}
      phases={['화면이 만들어지는 과정', 'React 구조', '실제 코드 추적']}
      phaseIndex={stepIndex <= 1 ? 0 : stepIndex <= 5 ? 1 : 2}
      recall={{
        choices: [
          { id: 'jsx', label: 'Component가 반환한 JSX를 따라간다.' },
          { id: 'json', label: 'JSON 데이터만 수정한다.' },
          { id: 'database', label: 'Database 테이블부터 찾는다.' },
        ],
        correctChoiceId: 'jsx',
        isSolved: completedMissionIds.includes('browser-recall'),
        onSolved: () => progress.markMissionComplete('browser-recall'),
        prompt: '화면의 버튼 하나를 없애려면 가장 먼저 무엇을 찾아야 할까요?',
      }}
      stepIndex={stepIndex}
      steps={LESSON_STEPS}
      titleId="browser-lesson-title"
      unlockedThrough={progress.unlockedThrough}
    >
      {isProjectMission ? (
        <OtcTraceMission
          isSolved={missionSolved}
          onSolved={() => progress.markMissionComplete('otc-component-trace')}
        />
      ) : <StepContent />}
    </FrontendLessonShell>
  );
}

export { LESSON_STEPS, MEMORY_ITEMS };
export default FrontendBrowserLesson;
