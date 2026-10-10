import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { landingDiagnosis } from '../../data/landing';

function Brand() {
  return (
    <Link className="ld-brand" to="/" aria-label="Over the Code 랜딩으로 돌아가기">
      <span className="ld-brand__mark" aria-hidden="true">O</span>
      <strong>Over the Code</strong>
    </Link>
  );
}

function DiagnosisResult({ answers, onReset }) {
  const score = answers.reduce((sum, answer) => sum + answer, 0);
  const result = landingDiagnosis.results.find((item) => score <= item.max)
    ?? landingDiagnosis.results[landingDiagnosis.results.length - 1];

  return (
    <section className="dg-result" aria-live="polite">
      <p className="dg-kicker">진단 결과 · {score}/10</p>
      <h1>{result.title}</h1>
      <p className="dg-result__description">{result.description}</p>

      <div className="dg-result__scores" aria-label="영역별 진단 점수">
        {landingDiagnosis.dimensions.map((dimension, index) => (
          <div key={dimension}>
            <span>{dimension}</span>
            <div aria-hidden="true"><i style={{ width: `${(answers[index] / 2) * 100}%` }} /></div>
            <strong>{answers[index]}/2</strong>
          </div>
        ))}
      </div>

      <p className="dg-result__recommendation">{result.recommendation}</p>
      <div className="dg-result__actions">
        <Link className="ld-btn ld-btn--primary" to="/curriculum">커리큘럼 살펴보기<span aria-hidden="true">→</span></Link>
        <button type="button" className="dg-text-button" onClick={onReset}>다시 진단하기</button>
      </div>
    </section>
  );
}

function DiagnosisScreen() {
  const [answers, setAnswers] = useState([]);
  const questionIndex = answers.length;
  const isComplete = questionIndex === landingDiagnosis.questions.length;
  const question = landingDiagnosis.questions[questionIndex];
  const progress = (questionIndex / landingDiagnosis.questions.length) * 100;

  const scoreLabel = useMemo(
    () => `${questionIndex}/${landingDiagnosis.questions.length}`,
    [questionIndex],
  );

  const answerQuestion = (value) => setAnswers((current) => [...current, value]);

  return (
    <main className="dg">
      <header className="dg-header">
        <Brand />
        <Link to="/curriculum">진단 건너뛰기</Link>
      </header>

      <div className="dg-progress" aria-hidden="true">
        <span style={{ width: `${isComplete ? 100 : progress}%` }} />
      </div>

      <div className="dg-layout">
        <aside className="dg-intro">
          <div>
            <p className="dg-kicker">{landingDiagnosis.eyebrow}</p>
            <h2>{landingDiagnosis.title}</h2>
            <p>{landingDiagnosis.description}</p>
          </div>
          <ol className="dg-dimensions">
            {landingDiagnosis.dimensions.map((dimension, index) => {
              const state = index < questionIndex ? 'is-done' : index === questionIndex && !isComplete ? 'is-current' : '';
              return (
                <li className={state} key={dimension}>
                  <span>{index < questionIndex ? '✓' : String(index + 1).padStart(2, '0')}</span>
                  {dimension}
                </li>
              );
            })}
          </ol>
        </aside>

        {isComplete ? (
          <DiagnosisResult answers={answers} onReset={() => setAnswers([])} />
        ) : (
          <section className="dg-question" aria-live="polite">
            <p className="dg-question__step">{question.dimension}<span>{scoreLabel}</span></p>
            <h1>{question.question}</h1>
            <div className="dg-options">
              {question.options.map(([label, value], index) => (
                <button type="button" key={label} onClick={() => answerQuestion(value)}>
                  <span>{String.fromCharCode(65 + index)}</span>
                  {label}
                  <i aria-hidden="true">→</i>
                </button>
              ))}
            </div>
            <p className="dg-question__note">가장 가까운 답을 선택하세요. 결과는 저장되지 않습니다.</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default DiagnosisScreen;
