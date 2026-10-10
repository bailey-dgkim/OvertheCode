import { useState } from 'react';
import FeedbackPanel from './FeedbackPanel';

/**
 * 질문 1~3과 응용 문제가 모두 이 컴포넌트를 사용한다.
 * 정답을 맞혀야 다음 단계로 넘어갈 수 있고, 오답은 몇 번이든 다시 선택할 수 있다.
 *
 * CasePlayer가 step.id를 key로 넘겨 단계 이동 시 상태를 새로 시작하게 한다.
 * savedAnswer(정답만 저장됨)가 있으면 되돌아왔을 때 선택과 피드백이 복원된다.
 */
function QuizStep({ step, savedAnswer, onAnswer, onNext }) {
  const [selected, setSelected] = useState(savedAnswer ?? null);

  const isCorrect = selected === step.correctAnswer;
  const hasAnswered = selected !== null;

  const handleSelect = (choiceId) => {
    // 이미 정답을 맞힌 뒤에는 선택을 바꿀 수 없게 한다.
    if (isCorrect) return;

    setSelected(choiceId);
    onAnswer(step.id, choiceId, choiceId === step.correctAnswer);
  };

  const getChoiceState = (choiceId) => {
    if (selected !== choiceId) return '';
    return isCorrect ? 'correct' : 'incorrect';
  };

  return (
    <div className="oc-stack oc-stack--lg">
      {step.situation && (
        <div className="oc-situation">
          <span className="oc-situation__label">추가 상황</span>
          {step.situation}
        </div>
      )}

      <p className="oc-question">{step.question}</p>

      <div className="oc-choices" role="group" aria-label="선택지">
        {step.choices.map((choice) => {
          const state = getChoiceState(choice.id);

          return (
            <button
              key={choice.id}
              type="button"
              className={`oc-choice${state ? ` oc-choice--${state}` : ''}`}
              onClick={() => handleSelect(choice.id)}
              aria-pressed={selected === choice.id}
              disabled={isCorrect && selected !== choice.id}
            >
              <span className="oc-choice__key" aria-hidden="true">
                {choice.id}
              </span>
              <span className="oc-choice__text">{choice.text}</span>
              {state && (
                <span className="oc-choice__mark">
                  <span aria-hidden="true">{state === 'correct' ? '✓' : '✗'}</span>
                  {state === 'correct' ? '정답' : '다시 선택하세요'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <FeedbackPanel
          feedback={isCorrect ? step.correctFeedback : step.incorrectFeedback}
          isCorrect={isCorrect}
        />
      )}

      <div className="oc-btn-row oc-btn-row--stack">
        <button
          type="button"
          className="oc-btn oc-btn--primary"
          onClick={onNext}
          disabled={!isCorrect}
        >
          다음 단계
        </button>
        {!isCorrect && (
          <span className="oc-muted" style={{ fontSize: 14 }}>
            정답을 선택하면 다음 단계로 이동할 수 있습니다.
          </span>
        )}
      </div>
    </div>
  );
}

export default QuizStep;
