import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConceptRecall from './ConceptRecall';

function FrontendLessonShell({
  canContinue = true,
  chapter,
  children,
  lessonLabel,
  nextBlockedLabel = '미션을 완료해주세요',
  onAdvance,
  onComplete,
  onOpenStep,
  onPrevious,
  phases = [],
  phaseIndex = 0,
  recall,
  stepIndex,
  steps,
  titleId,
  unlockedThrough,
}) {
  const [outlineOpen, setOutlineOpen] = useState(false);
  const navigate = useNavigate();
  const isLastStep = stepIndex === steps.length - 1;
  const actionEnabled = canContinue && (!isLastStep || !recall || recall.isSolved);
  const percent = Math.round(((stepIndex + 1) / steps.length) * 100);

  const finish = () => {
    onComplete();
    navigate(`/parts/${chapter.partId}`);
  };

  return (
    <div className="cv2-browser-lesson">
      <header className="cv2-browser-lesson__header">
        <div className="cv2-container">
          <Link to={`/parts/${chapter.partId}`}>← Part 1로 나가기</Link>
          <strong>{chapter.title}</strong>
          <span>{stepIndex + 1} / {steps.length}</span>
        </div>
      </header>

      <div className="cv2-container cv2-browser-lesson__main">
        {phases.length > 0 && (
          <ol className="cv2-lesson-phase-strip" aria-label={`${chapter.title} 학습 구성`}>
            {phases.map((phase, index) => (
              <li className={index < phaseIndex ? 'is-complete' : index === phaseIndex ? 'is-active' : ''} key={phase}>
                <span>{index < phaseIndex ? '✓' : String(index + 1).padStart(2, '0')}</span>
                <strong>{phase}</strong>
              </li>
            ))}
          </ol>
        )}

        <div className="cv2-browser-lesson__layout">
          <aside className={`cv2-browser-lesson__navigation${outlineOpen ? ' is-open' : ''}`}>
            <div>
              <p className="cv2-eyebrow">{lessonLabel}</p>
              <strong>{percent}%</strong>
            </div>
            <div
              className="cv2-browser-lesson__progress"
              role="progressbar"
              aria-label="교육 콘텐츠 진행률"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={percent}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <button
              type="button"
              className="cv2-lesson-outline-toggle"
              aria-expanded={outlineOpen}
              onClick={() => setOutlineOpen((current) => !current)}
            >
              <span>학습 목차</span>
              <strong>{outlineOpen ? '접기' : '펼치기'}</strong>
            </button>
            <ol className="cv2-lesson-outline">
              {steps.map((item, index) => {
                const locked = index > unlockedThrough;
                return (
                  <li key={item.short}>
                    <button
                      type="button"
                      className={index === stepIndex ? 'is-active' : index < stepIndex ? 'is-complete' : ''}
                      aria-current={index === stepIndex ? 'step' : undefined}
                      disabled={locked}
                      onClick={() => {
                        onOpenStep(index);
                        setOutlineOpen(false);
                      }}
                    >
                      <span>{index < stepIndex ? '✓' : String(index + 1).padStart(2, '0')}</span>
                      <strong>{item.short}</strong>
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          <section className="cv2-browser-lesson__content" aria-labelledby={titleId}>
            <header>
              <p className="cv2-eyebrow">Lesson {String(stepIndex + 1).padStart(2, '0')}</p>
              <h1 id={titleId}>{steps[stepIndex].title}</h1>
            </header>

            <div className="cv2-browser-lesson__stage" key={stepIndex}>{children}</div>

            {isLastStep && recall && <ConceptRecall {...recall} />}

            <div className="cv2-browser-lesson__actions">
              <button
                type="button"
                className="cv2-button cv2-button--secondary"
                disabled={stepIndex === 0}
                onClick={onPrevious}
              >
                ← 이전
              </button>
              <button
                type="button"
                className="cv2-button cv2-button--primary"
                disabled={!actionEnabled}
                onClick={isLastStep ? finish : onAdvance}
              >
                {!canContinue
                  ? nextBlockedLabel
                  : isLastStep && recall && !recall.isSolved
                    ? '암기 확인을 완료해주세요'
                    : isLastStep
                      ? 'Chapter 완료 →'
                      : '다음 학습 →'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default FrontendLessonShell;
