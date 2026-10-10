import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FRONTEND_CERTIFICATION_CATEGORIES,
  FRONTEND_CERTIFICATION_CHEAT_SHEET,
  FRONTEND_CERTIFICATION_PASSING_SCORE,
  FRONTEND_CERTIFICATION_PROJECT_TREE,
  FRONTEND_CERTIFICATION_QUESTIONS,
  FRONTEND_CERTIFICATION_STORAGE_KEY,
} from '../../content/v2/frontend-certification';
import {
  evaluateFrontendCertification,
  getCertificationAnswerText,
  getCertificationCorrectAnswerText,
} from './frontendCertificationUtils';

const EMPTY_SESSION = {
  phase: 'intro',
  questionIndex: 0,
  answers: {},
};

function loadSession() {
  if (typeof window === 'undefined') return EMPTY_SESSION;

  try {
    const saved = JSON.parse(window.localStorage.getItem(FRONTEND_CERTIFICATION_STORAGE_KEY));
    if (!saved || !['intro', 'quiz', 'results'].includes(saved.phase)) return EMPTY_SESSION;
    return {
      phase: saved.phase,
      questionIndex: Math.min(
        Math.max(Number(saved.questionIndex) || 0, 0),
        FRONTEND_CERTIFICATION_QUESTIONS.length - 1,
      ),
      answers: saved.answers && typeof saved.answers === 'object' ? saved.answers : {},
    };
  } catch {
    return EMPTY_SESSION;
  }
}

function ProjectPreview({ screenFirst = false }) {
  const projectTree = (
    <section className="cv2-cert-project__tree" aria-labelledby="cert-project-tree-title">
      <div className="cv2-cert-panel-heading">
        <span>Project</span>
        <strong id="cert-project-tree-title">주문 관리 프로젝트</strong>
      </div>
      <pre><code>{FRONTEND_CERTIFICATION_PROJECT_TREE}</code></pre>
    </section>
  );
  const projectScreen = (
    <section className="cv2-cert-project__screen" aria-labelledby="cert-project-screen-title">
      <div className="cv2-cert-panel-heading">
        <span>Screen</span>
        <strong id="cert-project-screen-title">현재 화면</strong>
      </div>
      <div
        className="cv2-order-mockup"
        role="img"
        aria-label="macOS 주문 관리 앱. 회색 주문 카드 안에 주문 A, 배송 준비중 상태, 배송 완료 처리 버튼이 있습니다."
      >
        <div className="cv2-order-mockup__titlebar" aria-hidden="true">
          <div><i /><i /><i /></div>
          <strong>주문 관리</strong>
          <span>•••</span>
        </div>

        <div className="cv2-order-mockup__content">
          <header>
            <div>
              <span className="cv2-order-mockup__icon" aria-hidden="true">O</span>
              <div>
                <span>ORDER DESK</span>
                <h3>주문 관리</h3>
              </div>
            </div>
            <span className="cv2-order-mockup__sync">동기화됨</span>
          </header>

          <article className="cv2-order-card">
            <div className="cv2-order-card__topline">
              <span>ORDER #A</span>
              <span aria-hidden="true">•••</span>
            </div>
            <strong>주문 A</strong>
            <p><span>상태</span><mark>배송 준비중</mark></p>
            <button type="button" tabIndex="-1">배송 완료 처리</button>
          </article>

          <label>
            <span>주문 메모</span>
            <input
              type="text"
              tabIndex="-1"
              readOnly
              placeholder="메모를 입력하세요"
              aria-label="주문 메모 예시"
            />
          </label>
        </div>
      </div>
    </section>
  );

  return (
    <div className="cv2-cert-project">
      {screenFirst ? (
        <>
          {projectScreen}
          {projectTree}
        </>
      ) : (
        <>
          {projectTree}
          {projectScreen}
        </>
      )}
    </div>
  );
}

function QuizIntro({ onStart }) {
  return (
    <main className="cv2-container cv2-page cv2-cert-page">
      <nav className="cv2-breadcrumb" aria-label="현재 위치">
        <Link to="/curriculum">커리큘럼</Link>
        <span aria-hidden="true">/</span>
        <Link to="/parts/frontend">Part 1</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">인증 퀴즈</span>
      </nav>

      <section className="cv2-cert-hero" aria-labelledby="certification-title">
        <p className="cv2-eyebrow">Frontend Certification</p>
        <h1 id="certification-title">화면을 보고<br />수정 위치를 찾아라</h1>
        <p>
          용어를 외웠는지가 아니라, 화면에서 문제가 생겼을 때
          CSS·Component·State·Event·API 중 어디부터 확인할지 평가합니다.
        </p>
      </section>

      <div className="cv2-cert-intro-grid">
        <ProjectPreview />

        <aside className="cv2-cert-guide" aria-labelledby="cert-guide-title">
          <p className="cv2-eyebrow">Assessment Guide</p>
          <h2 id="cert-guide-title">하나의 프로젝트를 끝까지 추적합니다</h2>
          <dl>
            <div><dt>문항</dt><dd>{FRONTEND_CERTIFICATION_QUESTIONS.length}개</dd></div>
            <div><dt>예상 시간</dt><dd>약 15분</dd></div>
            <div><dt>통과 기준</dt><dd>{FRONTEND_CERTIFICATION_PASSING_SCORE}문항 이상</dd></div>
            <div><dt>필수 판단</dt><dd>State·서버 구분, 종합 추적</dd></div>
          </dl>
          <div className="cv2-cert-guide__note">
            <strong>답은 제출 후 공개됩니다</strong>
            <p>시간제한은 없습니다. 파일을 직접 고치기보다 어디를 확인할지 판단해 보세요.</p>
          </div>
          <button className="cv2-button cv2-button--primary" type="button" onClick={onStart}>
            인증 퀴즈 시작 →
          </button>
        </aside>
      </div>
    </main>
  );
}

function ChoiceQuestion({ answer, onAnswer, question }) {
  return (
    <div className="cv2-cert-answers" role="radiogroup" aria-label="선택지">
      {question.choices.map((choice, index) => (
        <button
          className="cv2-cert-answer"
          type="button"
          role="radio"
          aria-checked={answer === choice.id}
          key={choice.id}
          onClick={() => onAnswer(choice.id)}
        >
          <span>{String.fromCharCode(65 + index)}</span>
          <strong>{choice.text}</strong>
          <span aria-hidden="true">{answer === choice.id ? '●' : '○'}</span>
        </button>
      ))}
    </div>
  );
}

function SequenceQuestion({ answer, onAnswer, question }) {
  const orderedIds = Array.isArray(answer) ? answer : question.items.map((item) => item.id);
  const itemById = new Map(question.items.map((item) => [item.id, item]));

  const move = (index, offset) => {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onAnswer(next);
  };

  return (
    <ol className="cv2-cert-sequence">
      {orderedIds.map((itemId, index) => (
        <li key={itemId}>
          <span><strong>{index + 1}</strong>{itemById.get(itemId)?.text}</span>
          <span>
            <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label="위로 이동">↑</button>
            <button type="button" disabled={index === orderedIds.length - 1} onClick={() => move(index, 1)} aria-label="아래로 이동">↓</button>
          </span>
        </li>
      ))}
    </ol>
  );
}

function QuizQuestion({
  answer,
  onAnswer,
  onBack,
  onExit,
  onNext,
  question,
  questionIndex,
}) {
  const total = FRONTEND_CERTIFICATION_QUESTIONS.length;
  const percent = Math.round(((questionIndex + 1) / total) * 100);
  const answerReady = question.type === 'sequence'
    ? Array.isArray(answer) && answer.length === question.items.length
    : Boolean(answer);

  useEffect(() => {
    if (question.type === 'sequence' && !Array.isArray(answer)) {
      onAnswer(question.items.map((item) => item.id));
    }
  }, [answer, onAnswer, question]);

  return (
    <div className="cv2-cert-player">
      <header className="cv2-cert-player__header">
        <div className="cv2-container">
          <div>
            <button type="button" onClick={onExit}>← 퀴즈 나가기</button>
            <strong>프론트엔드 인증 퀴즈</strong>
            <span>{questionIndex + 1} / {total}</span>
          </div>
          <div
            className="cv2-cert-progress"
            role="progressbar"
            aria-label="퀴즈 진행률"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={percent}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      </header>

      <main className="cv2-container cv2-cert-question-layout">
        <aside className="cv2-cert-question-context">
          <ProjectPreview screenFirst />
        </aside>

        <section className="cv2-cert-question" aria-labelledby="cert-question-title">
          <div className="cv2-cert-question__meta">
            <span>{FRONTEND_CERTIFICATION_CATEGORIES[question.category]}</span>
            {question.required && <strong>필수 판단</strong>}
          </div>
          <p className="cv2-eyebrow">Question {String(questionIndex + 1).padStart(2, '0')}</p>
          <h1 id="cert-question-title">{question.title}</h1>
          <p className="cv2-cert-question__prompt">{question.prompt}</p>
          {question.screenHint && <div className="cv2-cert-screen-hint">{question.screenHint}</div>}
          {question.code && <pre className="cv2-cert-code"><code>{question.code}</code></pre>}

          {question.type === 'sequence' ? (
            <SequenceQuestion answer={answer} onAnswer={onAnswer} question={question} />
          ) : (
            <ChoiceQuestion answer={answer} onAnswer={onAnswer} question={question} />
          )}

          <div className="cv2-cert-question__actions">
            <button className="cv2-button cv2-button--secondary" type="button" onClick={onBack} disabled={questionIndex === 0}>
              ← 이전 문제
            </button>
            <button className="cv2-button cv2-button--primary" type="button" onClick={onNext} disabled={!answerReady}>
              {questionIndex === total - 1 ? '제출하고 결과 보기' : '다음 문제 →'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function QuizResults({ answers, onRestart }) {
  const evaluation = useMemo(() => evaluateFrontendCertification(answers), [answers]);
  const wrongResults = evaluation.results.filter((result) => !result.correct);

  return (
    <main className="cv2-container cv2-page cv2-cert-results">
      <nav className="cv2-breadcrumb" aria-label="현재 위치">
        <Link to="/parts/frontend">Part 1</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">인증 결과</span>
      </nav>

      <section className={'cv2-cert-result-hero ' + (evaluation.passed ? 'is-passed' : 'is-retry')}>
        <p className="cv2-eyebrow">Frontend Certification Result</p>
        <div>
          <div>
            <span>{evaluation.passed ? '통과' : '다시 학습하기'}</span>
            <h1>{evaluation.correctCount} / {evaluation.total}</h1>
          </div>
          <p>
            {evaluation.passed
              ? '화면에서 출발해 수정 위치를 좁히는 기준을 갖췄습니다.'
              : `${FRONTEND_CERTIFICATION_PASSING_SCORE}문항 이상과 두 필수 판단을 통과하면 인증이 완료됩니다.`}
          </p>
        </div>
      </section>

      <section className="cv2-cert-capabilities" aria-labelledby="capability-result-title">
        <div className="cv2-section-heading">
          <div>
            <p className="cv2-eyebrow">Capability Map</p>
            <h2 id="capability-result-title">어디까지 구분할 수 있나요?</h2>
          </div>
          <p>점수가 낮은 영역은 해당 Chapter로 돌아가 다시 확인해 보세요.</p>
        </div>
        <div>
          {evaluation.categoryResults.map((category) => (
            <article key={category.id}>
              <span>{category.label}</span>
              <strong>{category.correct} / {category.total}</strong>
              <div><span style={{ width: `${Math.round((category.correct / category.total) * 100)}%` }} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className="cv2-cert-review" aria-labelledby="cert-review-title">
        <div className="cv2-section-heading">
          <div>
            <p className="cv2-eyebrow">Review</p>
            <h2 id="cert-review-title">오답 해설</h2>
          </div>
          <p>{wrongResults.length === 0 ? '모든 판단이 정확했습니다.' : `${wrongResults.length}개 판단을 다시 확인해 보세요.`}</p>
        </div>

        {wrongResults.length > 0 ? (
          <div className="cv2-cert-review__list">
            {wrongResults.map(({ question }) => (
              <article key={question.id}>
                <div><span>Q{question.id.slice(1)}</span><strong>{question.title}</strong></div>
                <dl>
                  <div><dt>내 답</dt><dd>{getCertificationAnswerText(question, answers[question.id])}</dd></div>
                  <div><dt>확인할 곳</dt><dd>{getCertificationCorrectAnswerText(question)}</dd></div>
                </dl>
                <p>{question.explanation}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="cv2-cert-perfect">화면 모양부터 서버 데이터까지 수정 위치를 정확히 추적했습니다.</div>
        )}
      </section>

      <section className="cv2-cert-cheat-sheet" aria-labelledby="cheat-sheet-title">
        <div>
          <p className="cv2-eyebrow">Keep this</p>
          <h2 id="cheat-sheet-title">수정 위치 판단표</h2>
          <p>화면에서 문제가 보일 때 프로젝트 전체를 뒤지기 전에 이 순서로 범위를 좁혀보세요.</p>
        </div>
        <div className="cv2-cert-cheat-sheet__table" role="table" aria-label="수정 위치 판단표">
          {FRONTEND_CERTIFICATION_CHEAT_SHEET.map(([target, location]) => (
            <div role="row" key={target}>
              <span role="cell">{target}</span>
              <strong role="cell">{location}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="cv2-cert-results__actions">
        <button className="cv2-button cv2-button--primary" type="button" onClick={onRestart}>다시 응시하기</button>
        <Link className="cv2-button cv2-button--secondary" to="/parts/frontend">Part 1로 돌아가기</Link>
      </div>
    </main>
  );
}

function FrontendCertificationQuiz() {
  const [session, setSession] = useState(loadSession);
  const question = FRONTEND_CERTIFICATION_QUESTIONS[session.questionIndex];
  const answer = session.answers[question?.id];

  useEffect(() => {
    window.localStorage.setItem(FRONTEND_CERTIFICATION_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [session.phase, session.questionIndex]);

  const updateAnswer = (value) => {
    setSession((current) => ({
      ...current,
      answers: { ...current.answers, [question.id]: value },
    }));
  };

  if (session.phase === 'intro') {
    return (
      <QuizIntro
        onStart={() => setSession({ phase: 'quiz', questionIndex: 0, answers: {} })}
      />
    );
  }

  if (session.phase === 'results') {
    return (
      <QuizResults
        answers={session.answers}
        onRestart={() => setSession({ phase: 'quiz', questionIndex: 0, answers: {} })}
      />
    );
  }

  return (
    <QuizQuestion
      answer={answer}
      onAnswer={updateAnswer}
      onBack={() => setSession((current) => ({
        ...current,
        questionIndex: Math.max(current.questionIndex - 1, 0),
      }))}
      onExit={() => setSession((current) => ({ ...current, phase: 'intro' }))}
      onNext={() => setSession((current) => (
        current.questionIndex === FRONTEND_CERTIFICATION_QUESTIONS.length - 1
          ? { ...current, phase: 'results' }
          : { ...current, questionIndex: current.questionIndex + 1 }
      ))}
      question={question}
      questionIndex={session.questionIndex}
    />
  );
}

export default FrontendCertificationQuiz;
