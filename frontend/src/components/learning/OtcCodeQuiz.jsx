import { useState } from 'react';

function OtcCodeQuiz({
  choices,
  code,
  correctChoiceId,
  explanation,
  file,
  isSolved,
  onSolved,
  prompt,
}) {
  const [answer, setAnswer] = useState(isSolved ? correctChoiceId : '');
  const [submitted, setSubmitted] = useState(isSolved);
  const correct = answer === correctChoiceId;

  const check = () => {
    setSubmitted(true);
    if (correct) onSolved();
  };

  return (
    <section className="cv2-project-checkpoint">
      <p className="cv2-eyebrow">Apply to Over the Code</p>
      <h2>가상 예제를 실제 프로젝트 코드에 연결해봅시다.</h2>
      <span className="cv2-project-checkpoint__file">{file}</span>
      <pre><code>{code}</code></pre>
      <p className="cv2-project-checkpoint__prompt">{prompt}</p>
      <div className="cv2-project-checkpoint__choices">
        {choices.map((choice) => (
          <button
            type="button"
            className={answer === choice.id ? 'is-selected' : ''}
            aria-pressed={answer === choice.id}
            key={choice.id}
            onClick={() => {
              setAnswer(choice.id);
              setSubmitted(false);
            }}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <button type="button" className="cv2-button cv2-button--primary" disabled={!answer} onClick={check}>실제 코드 해석 확인</button>
      {submitted && (
        <aside className={`cv2-state-feedback${correct ? ' is-correct' : ' is-wrong'}`} role="status">
          <strong>{correct ? '실제 코드의 흐름을 정확히 찾았습니다.' : '화면에서 바뀌는 값과 그 값을 변경하는 코드를 다시 연결해보세요.'}</strong>
          {correct && <p>{explanation}</p>}
        </aside>
      )}
    </section>
  );
}

export default OtcCodeQuiz;
