import { useState } from 'react';

/**
 * 코드 파일을 보여주고, 줄 사이의 빈틈(gap)에서 정답 위치를 클릭하는 스텝.
 *
 * 저장 방식은 퀴즈와 같다: 정답 gap의 id가 selectedAnswers에 남는다.
 * gap.afterLine = "이 줄(1-based) 다음의 빈틈". afterLine 0 은 첫 줄 앞.
 */
function LocateCodeStep({ step, savedAnswer, onAnswer, onNext }) {
  const [selected, setSelected] = useState(savedAnswer ?? null);

  const selectedGap = step.gaps.find((g) => g.id === selected) ?? null;
  const isCorrect = Boolean(selectedGap?.correct);

  const handlePick = (gap) => {
    if (isCorrect) return; // 정답 뒤에는 잠근다
    setSelected(gap.id);
    onAnswer(step.id, gap.id, gap.correct);
  };

  const gapFor = (lineNumber) => step.gaps.find((g) => g.afterLine === lineNumber);

  const renderGap = (gap) => {
    if (!gap) return null;
    const state = selected === gap.id ? (gap.correct ? 'correct' : 'incorrect') : '';

    return (
      <button
        key={gap.id}
        type="button"
        className={`oc-gap${state ? ` oc-gap--${state}` : ''}`}
        onClick={() => handlePick(gap)}
        aria-label="이 자리에 추가"
      >
        <span className="oc-gap__hint">
          {state === 'correct' ? '✓ 여기' : state === 'incorrect' ? '✗ 여기' : '+ 여기에 추가'}
        </span>
      </button>
    );
  };

  return (
    <div className="oc-stack oc-stack--lg">
      <p className="oc-question">{step.question}</p>

      <div className="oc-code">
        <div className="oc-code__bar">{step.fileName}</div>

        <div className="oc-code__body">
          {renderGap(gapFor(0))}
          {step.lines.map((line, idx) => {
            const lineNumber = idx + 1;
            return (
              <div key={lineNumber}>
                <div className="oc-code__line">
                  <span className="oc-code__ln" aria-hidden="true">
                    {lineNumber}
                  </span>
                  <code className="oc-code__text">{line || ' '}</code>
                </div>
                {renderGap(gapFor(lineNumber))}
              </div>
            );
          })}
        </div>
      </div>

      {selectedGap && (
        <div
          className={`oc-locate-feedback oc-locate-feedback--${isCorrect ? 'correct' : 'incorrect'}`}
          role="status"
          aria-live="polite"
        >
          <p>{selectedGap.feedback}</p>
        </div>
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
            코드에서 맞는 자리를 클릭하세요.
          </span>
        )}
      </div>
    </div>
  );
}

export default LocateCodeStep;
