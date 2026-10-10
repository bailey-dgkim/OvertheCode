import { useState } from 'react';
import { Link } from 'react-router-dom';
import { areLessonMatchesCorrect } from './frontendFoundationLessonUtils';
import DevToolsLab from './DevToolsLab';
import FrontendLessonShell from './FrontendLessonShell';
import { useFrontendLessonProgress } from './frontendLessonProgress';

const LESSON_STEPS = [
  { short: '그림일까, 프로그램일까?', title: 'AI가 만든 주문 화면은 그냥 그림일까?' },
  { short: 'User', title: 'User는 서비스를 사용하는 사람이다' },
  { short: 'Client', title: 'Client는 사용자를 대신해 서비스를 요청한다' },
  { short: '미션 · 역할 찾기', title: '누가 User고 무엇이 Client일까?' },
  { short: 'Frontend의 위치', title: 'Frontend 코드는 어디에서 실행될까?' },
  { short: '디자인과 실행 화면', title: '똑같이 생긴 버튼도 완전히 다른 존재다' },
  { short: '미션 · 화면 구분', title: '디자인과 실행되는 화면을 구분하라' },
  { short: 'HTML · CSS · JS', title: 'Frontend 화면은 무엇으로 만들까?' },
  { short: '미션 · 수정 위치', title: '화면 요구사항은 어디에서 담당할까?' },
  { short: '필수 암기', title: '앞으로 배울 개념을 꽂을 첫 번째 지도' },
  { short: '다음 질문', title: '이 화면은 코드의 어디에서 만들어질까?' },
];

const MEMORY_ITEMS = [
  ['User', '서비스를 사용하는 사람'],
  ['Client', '서비스를 요청하고 사용하는 쪽의 프로그램이나 환경'],
  ['Browser', '웹 Frontend를 실행하고 화면을 보여주는 프로그램'],
  ['Frontend', '사용자가 직접 보고 조작하는 영역을 만드는 코드'],
  ['HTML · CSS · JavaScript', '화면의 구조 · 모양 · 동작을 담당'],
  ['React', 'JavaScript로 사용자 인터페이스를 만들기 위한 라이브러리'],
];

const TECHNOLOGY_ROLES = [
  ['HTML', '무엇이 있는가', '화면의 구조'],
  ['CSS', '어떻게 보이는가', '화면의 모양'],
  ['JavaScript', '어떻게 움직이는가', '화면의 동작'],
];

const ROLE_MISSION_ITEMS = [
  { id: 'person', subject: '김철수', description: '회사 노트북으로 주문 시스템을 사용하는 사람' },
  { id: 'chrome', subject: 'Chrome', description: '김철수가 주문 시스템을 여는 프로그램' },
  { id: 'react-code', subject: 'React 코드', description: '주문 화면을 구성하고 동작하게 만드는 코드' },
];

const ROLE_OPTIONS = [
  ['user', 'User'],
  ['client', 'Client'],
  ['frontend', 'Frontend'],
];

const ROLE_ANSWERS = {
  person: 'user',
  chrome: 'client',
  'react-code': 'frontend',
};

const DESIGN_MISSION_ITEMS = [
  { id: 'figma', label: 'A', context: 'Figma에서 버튼처럼 그려놓은 [주문하기]', hint: '클릭해도 실제 주문 동작은 없음' },
  { id: 'chrome', label: 'B', context: 'Chrome에서 실제로 클릭할 수 있는 [주문하기]', hint: '클릭 Event에 반응할 수 있음' },
];

const DESIGN_ANSWERS = {
  figma: 'design',
  chrome: 'running',
};

const TECHNOLOGY_MISSION_ITEMS = [
  { id: 'structure', requirement: '“주문하기” 버튼을 하나 만든다' },
  { id: 'style', requirement: '버튼을 파란색으로 만든다' },
  { id: 'behavior', requirement: '버튼을 눌렀을 때 동작하게 만든다' },
];

const TECHNOLOGY_ANSWERS = {
  structure: 'html',
  style: 'css',
  behavior: 'javascript',
};

const FOUNDATION_FLOW = [
  '사용자 User',
  '클라이언트 Client',
  '브라우저 Browser',
  'Frontend 코드 실행',
  '사용자가 보는 화면',
];

function Arrow({ direction = 'right' }) {
  return (
    <span className={`cv2-lesson-arrow cv2-lesson-arrow--${direction}`} aria-hidden="true">→</span>
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

function OrderProgram({ interactive = false }) {
  const [opened, setOpened] = useState(false);

  return (
    <article className="cv2-foundation-order-program">
      <div className="cv2-foundation-order-program__bar">
        <span>Chrome</span><i>order.local</i>
      </div>
      <header><span>주문 관리</span><small>실행 중</small></header>
      <section>
        <span>주문 #1024</span>
        <h2>김철수</h2>
        <p>배송 준비중</p>
        <button type="button" disabled={!interactive} onClick={() => setOpened((current) => !current)}>
          {opened ? '상세 닫기' : '상세보기'}
        </button>
        {opened && <aside role="status">아메리카노 2잔 · 문 앞에 놓아주세요</aside>}
      </section>
    </article>
  );
}

function OpeningStep() {
  return (
    <>
      <p className="cv2-lesson-lead">AI에게 “주문 관리 시스템 만들어줘”라고 요청한 뒤 나타난 화면입니다. 상세보기 버튼을 직접 눌러보세요.</p>
      <div className="cv2-foundation-opening">
        <OrderProgram interactive />
        <section>
          <span>첫 번째 질문</span>
          <h2>지금 보고 있는 건 AI가 그려준 그림일까요?</h2>
          <p>웹페이지로 실행되고 있다면 아닙니다. 버튼을 누르고 값을 바꾸며 서버와 통신할 수도 있는 <strong>프로그램의 실행 결과</strong>입니다.</p>
        </section>
      </div>
      <aside className="cv2-lesson-emphasis">내가 보는 화면은 그냥 이미지가 아니라, 내 컴퓨터의 Client에서 Frontend 코드가 실행된 결과입니다.</aside>
      <DevToolsLab
        tool="Introduction"
        title="브라우저 내부를 볼 수 있는 도구가 있다"
        steps={[
          '이 페이지에서 F12를 누르거나 우클릭한 뒤 검사를 선택합니다.',
          'Elements, Console, Sources, Network, Application 탭이 있는지만 확인합니다.',
          '지금은 각 탭의 의미를 외우지 않고 개발자 도구를 닫습니다.',
        ]}
        answer="DevTools는 별도의 개발 기술이 아니라, 현재 브라우저 안에서 무슨 일이 일어나는지 확인하는 도구입니다. 이후 Chapter에서 필요한 탭을 하나씩 사용합니다."
      />
    </>
  );
}

function UserStep() {
  return (
    <>
      <p className="cv2-lesson-lead">가장 먼저 자주 혼동하는 단어부터 분리합니다.</p>
      <div className="cv2-foundation-person-flow">
        <article><span>B</span><strong>Bailey</strong><small>사람</small></article>
        <Arrow />
        <article><span>C</span><strong>Chrome</strong><small>프로그램</small></article>
        <Arrow />
        <article><span>W</span><strong>웹서비스</strong><small>사용 대상</small></article>
      </div>
      <Definition concept="User">웹사이트를 보고, 버튼을 누르고, 값을 입력하며 서비스를 사용하는 사람</Definition>
      <aside className="cv2-lesson-emphasis">이 흐름에서 User는 Bailey입니다. Chrome이나 웹서비스를 User라고 부르지 않습니다.</aside>
    </>
  );
}

function ClientStep() {
  return (
    <>
      <p className="cv2-lesson-lead">서버 입장에서는 사람이 직접 찾아오는 것이 아니라 Chrome 같은 프로그램이 요청을 보냅니다.</p>
      <div className="cv2-foundation-client-stack">
        <article><span>01</span><strong>User</strong><p>김철수 · 사람</p></article>
        <Arrow direction="down" />
        <article className="is-key"><span>02</span><strong>Client</strong><p>Chrome · 사용하는 프로그램</p></article>
        <Arrow direction="down" />
        <article><span>03</span><strong>Server</strong><p>나중에 데이터를 요청하고 저장하기 위해 만날 상대</p></article>
      </div>
      <Definition concept="Client">서비스를 요청하고 사용하는 쪽의 프로그램이나 환경. 웹서비스에서는 보통 Browser가 Client 역할을 합니다.</Definition>
      <div className="cv2-foundation-not-equal"><code>User = 사람</code><strong>≠</strong><code>Client = 사용하는 프로그램/환경</code></div>
    </>
  );
}

function FrontendLocationStep() {
  return (
    <>
      <p className="cv2-lesson-lead">웹서비스 기준으로 대부분의 Frontend 코드는 사용자의 컴퓨터에 있는 Browser에서 실행됩니다.</p>
      <div className="cv2-foundation-computer">
        <header><span>내 컴퓨터</span><small>Client</small></header>
        <section>
          <div className="cv2-foundation-browser-box">
            <span>Browser</span>
            <article>
              <strong>Frontend</strong>
              <code>HTML / CSS / JavaScript</code>
            </article>
            <Arrow direction="down" />
            <div>사용자가 보는 화면</div>
          </div>
        </section>
      </div>
      <Definition concept="Frontend">사용자가 직접 보고 조작하는 영역을 만드는 코드. 웹에서는 주로 Browser에서 실행됩니다.</Definition>
    </>
  );
}

function DesignVsExecutionStep() {
  const rows = [
    ['역할', '화면이 어떻게 보일지 표현', '실제로 실행되는 코드'],
    ['버튼', '버튼처럼 보임', '실제로 클릭 가능'],
    ['정체', '이미지 · 설계', '프로그램'],
    ['행동', '동작하지 않아도 됨', '사용자 행동에 반응함'],
  ];

  return (
    <>
      <p className="cv2-lesson-lead">모양은 같아도 “설계된 이미지”와 “실행 중인 프로그램”은 완전히 다릅니다.</p>
      <div className="cv2-foundation-button-compare">
        <article><span>Figma · Design</span><div>주문하기</div><small>버튼처럼 생긴 그림</small></article>
        <Arrow />
        <article className="is-running"><span>Chrome · Frontend</span><button type="button">주문하기</button><small>실제로 반응할 수 있는 요소</small></article>
      </div>
      <div className="cv2-foundation-compare-table" role="table" aria-label="디자인과 실제 Frontend 비교">
        <div className="is-heading" role="row"><strong role="columnheader">구분</strong><strong role="columnheader">디자인</strong><strong role="columnheader">실제 Frontend</strong></div>
        {rows.map(([label, design, frontend]) => (
          <div role="row" key={label}><strong role="rowheader">{label}</strong><span role="cell">{design}</span><span role="cell">{frontend}</span></div>
        ))}
      </div>
      <aside className="cv2-lesson-emphasis">디자인은 화면의 설계이고, Frontend는 그 화면을 실제로 동작하게 만드는 코드입니다.</aside>
    </>
  );
}

function WebIngredientsStep() {
  const snippets = {
    HTML: `<h1>주문 관리</h1>\n<button>주문하기</button>`,
    CSS: `button {\n  background-color: blue;\n}`,
    JavaScript: `console.log("주문 버튼 클릭");`,
  };

  return (
    <>
      <p className="cv2-lesson-lead">지금은 문법보다 세 기술의 담당 영역만 얕게 기억합니다.</p>
      <div className="cv2-foundation-tech-grid">
        {TECHNOLOGY_ROLES.map(([technology, question, role], index) => (
          <article key={technology}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{technology}</strong>
            <h2>{role}</h2>
            <p>{question}</p>
            <pre><code>{snippets[technology]}</code></pre>
          </article>
        ))}
      </div>
      <aside className="cv2-lesson-emphasis"><code>HTML = 구조 · CSS = 모양 · JavaScript = 동작</code></aside>
    </>
  );
}

function MatchingMission({ answers, expectedAnswers, items, onAnswer, onSolved, options, title }) {
  const [submitted, setSubmitted] = useState(false);
  const correct = areLessonMatchesCorrect(answers, expectedAnswers);
  const complete = Object.keys(answers).length === items.length;

  const check = () => {
    setSubmitted(true);
    if (correct) onSolved();
  };

  return (
    <>
      <p className="cv2-lesson-lead">각 상황에 맞는 답을 선택한 뒤 확인하세요.</p>
      <div className="cv2-foundation-matching-list">
        {items.map((item) => (
          <article key={item.id}>
            <div><span>{item.label ?? item.subject ?? '요구사항'}</span><strong>{item.context ?? item.requirement ?? item.description}</strong>{item.hint && <small>{item.hint}</small>}</div>
            <div className="cv2-foundation-matching-list__options" role="group" aria-label={`${item.label ?? item.subject ?? '요구사항'} 답 선택`}>
              {options.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={answers[item.id] === value ? 'is-selected' : ''}
                  aria-pressed={answers[item.id] === value}
                  onClick={() => {
                    onAnswer(item.id, value);
                    setSubmitted(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="cv2-foundation-mission-check"><button className="cv2-button cv2-button--primary" type="button" disabled={!complete} onClick={check}>{title}</button></div>
      {submitted && (
        <aside className={`cv2-state-feedback${correct ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{correct ? '모두 정확하게 연결했습니다.' : '아직 맞지 않는 연결이 있습니다.'}</strong>
          <p>{correct ? '역할과 위치를 기준으로 화면을 읽을 수 있습니다.' : '사람, 사용하는 프로그램, 화면을 만드는 코드를 다시 구분해보세요.'}</p>
        </aside>
      )}
    </>
  );
}

function RoleMissionStep({ answers, onAnswer, onSolved }) {
  return <MatchingMission answers={answers} expectedAnswers={ROLE_ANSWERS} items={ROLE_MISSION_ITEMS} onAnswer={onAnswer} onSolved={onSolved} options={ROLE_OPTIONS} title="역할 확인" />;
}

function DesignMissionStep({ answers, onAnswer, onSolved }) {
  return <MatchingMission answers={answers} expectedAnswers={DESIGN_ANSWERS} items={DESIGN_MISSION_ITEMS} onAnswer={onAnswer} onSolved={onSolved} options={[["design", '디자인'], ["running", '실행되는 화면']]} title="화면 구분 확인" />;
}

function TechnologyMissionStep({ answers, onAnswer, onSolved }) {
  return <MatchingMission answers={answers} expectedAnswers={TECHNOLOGY_ANSWERS} items={TECHNOLOGY_MISSION_ITEMS} onAnswer={onAnswer} onSolved={onSolved} options={[["html", 'HTML'], ["css", 'CSS'], ["javascript", 'JavaScript']]} title="담당 영역 확인" />;
}

function MemoryStep() {
  return (
    <>
      <p className="cv2-lesson-lead">앞으로 만날 개념은 모두 이 위치 관계 위에 하나씩 추가됩니다.</p>
      <dl className="cv2-foundation-memory-grid">
        {MEMORY_ITEMS.map(([concept, meaning], index) => (
          <div key={concept}><span>{String(index + 1).padStart(2, '0')}</span><dt>{concept}</dt><dd>{meaning}</dd></div>
        ))}
      </dl>
      <div className="cv2-foundation-final-flow" aria-label={FOUNDATION_FLOW.join(' 다음 ')}>
        {FOUNDATION_FLOW.map((item, index) => <div key={item}><strong>{item}</strong>{index < FOUNDATION_FLOW.length - 1 && <Arrow />}</div>)}
      </div>
      <aside className="cv2-lesson-emphasis">서버를 배우면 이 지도는 <code>User → Client / Browser → Frontend ↕ Server</code>로 확장됩니다.</aside>
    </>
  );
}

function BrowserBridgeStep() {
  return (
    <div className="cv2-foundation-bridge">
      <p className="cv2-eyebrow">Next · Chapter 02</p>
      <div><OrderProgram /></div>
      <section>
        <span>이 화면이 Browser에서 Frontend 코드가 실행된 결과라는 건 알았습니다.</span>
        <h2>그런데 이 화면은 코드의 <strong>어디에서 만들어지고 있을까요?</strong></h2>
        <p>다음 Chapter에서는 Browser가 무엇인지부터 Component, JSX, DOM까지 화면이 만들어지는 위치를 따라갑니다.</p>
        <Link className="cv2-button cv2-button--primary" to="/chapters/frontend-state-events/learn">Chapter 02 · Browser / Component / JSX / DOM →</Link>
      </section>
    </div>
  );
}

const STATIC_STEP_CONTENT = [
  OpeningStep,
  UserStep,
  ClientStep,
  null,
  FrontendLocationStep,
  DesignVsExecutionStep,
  null,
  WebIngredientsStep,
  null,
  MemoryStep,
  BrowserBridgeStep,
];

function FrontendFoundationLesson({ chapter }) {
  const progress = useFrontendLessonProgress(chapter.id, LESSON_STEPS.length);
  const { completedMissionIds, stepIndex } = progress;
  const [roleAnswers, setRoleAnswers] = useState({});
  const [designAnswers, setDesignAnswers] = useState({});
  const [technologyAnswers, setTechnologyAnswers] = useState({});
  const missionType = stepIndex === 3 ? 'role' : stepIndex === 6 ? 'design' : stepIndex === 8 ? 'technology' : null;
  const missionId = missionType ? `foundation-${missionType}` : null;
  const missionSolved = !missionId || completedMissionIds.includes(missionId);
  const phaseIndex = stepIndex <= 3 ? 0 : stepIndex <= 6 ? 1 : stepIndex <= 8 ? 2 : 3;
  const StepContent = STATIC_STEP_CONTENT[stepIndex];

  const updateAnswer = (setter) => (questionId, answer) => {
    setter((current) => ({ ...current, [questionId]: answer }));
  };

  const missionProps = missionType === 'role'
    ? { answers: roleAnswers, onAnswer: updateAnswer(setRoleAnswers), onSolved: () => progress.markMissionComplete(missionId) }
    : missionType === 'design'
      ? { answers: designAnswers, onAnswer: updateAnswer(setDesignAnswers), onSolved: () => progress.markMissionComplete(missionId) }
      : { answers: technologyAnswers, onAnswer: updateAnswer(setTechnologyAnswers), onSolved: () => progress.markMissionComplete(missionId) };
  const MissionComponent = missionType === 'role' ? RoleMissionStep : missionType === 'design' ? DesignMissionStep : TechnologyMissionStep;

  return (
    <div className="cv2-foundation-lesson">
      <FrontendLessonShell
        canContinue={missionSolved}
        chapter={chapter}
        lessonLabel="01 · Foundation"
        onAdvance={progress.advance}
        onComplete={progress.complete}
        onOpenStep={progress.openStep}
        onPrevious={progress.previous}
        phases={['사람과 실행 환경', '화면과 코드', '역할 구분', '첫 번째 지도']}
        phaseIndex={phaseIndex}
        recall={{
          choices: [
            { id: 'browser', label: '사용자의 Browser' },
            { id: 'design', label: '디자인 시안 파일' },
            { id: 'database', label: 'Database 안' },
          ],
          correctChoiceId: 'browser',
          isSolved: completedMissionIds.includes('foundation-recall'),
          onSolved: () => progress.markMissionComplete('foundation-recall'),
          prompt: 'Frontend 코드는 실제로 어디에서 실행될까요?',
        }}
        stepIndex={stepIndex}
        steps={LESSON_STEPS}
        titleId="foundation-lesson-title"
        unlockedThrough={progress.unlockedThrough}
      >
        {missionType ? <MissionComponent {...missionProps} /> : <StepContent />}
      </FrontendLessonShell>
    </div>
  );
}

export {
  DESIGN_ANSWERS,
  DESIGN_MISSION_ITEMS,
  FOUNDATION_FLOW,
  LESSON_STEPS,
  MEMORY_ITEMS,
  ROLE_ANSWERS,
  ROLE_MISSION_ITEMS,
  TECHNOLOGY_ANSWERS,
  TECHNOLOGY_MISSION_ITEMS,
  TECHNOLOGY_ROLES,
};
export default FrontendFoundationLesson;
