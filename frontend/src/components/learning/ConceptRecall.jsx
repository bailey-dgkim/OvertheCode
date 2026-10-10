import { useState } from 'react';

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function ConceptRecall({ choices, correctChoiceId, isSolved, onSolved, prompt }) {
  const [orderedChoices] = useState(() => shuffled(choices));
  const [answer, setAnswer] = useState('');
  const [streak, setStreak] = useState(isSolved ? 3 : 0);
  const [feedback, setFeedback] = useState(isSolved ? 'complete' : '');

  const check = () => {
    if (answer === correctChoiceId) {
      const nextStreak = Math.min(3, streak + 1);
      setStreak(nextStreak);
      setFeedback(nextStreak === 3 ? 'complete' : 'correct');
      setAnswer('');
      if (nextStreak === 3) onSolved();
      return;
    }

    setStreak(0);
    setFeedback('wrong');
    setAnswer('');
  };

  return (
    <section className="cv2-recall-drill" aria-labelledby="recall-title">
      <div className="cv2-recall-drill__heading">
        <div>
          <p className="cv2-eyebrow">Memory Check</p>
          <h2 id="recall-title">같은 개념을 3회 연속 확인하세요.</h2>
        </div>
        <strong>{streak} / 3</strong>
      </div>
      <p>{prompt}</p>
      <div className="cv2-recall-drill__choices">
        {orderedChoices.map((choice) => (
          <button
            type="button"
            className={answer === choice.id ? 'is-selected' : ''}
            disabled={streak === 3}
            aria-pressed={answer === choice.id}
            key={choice.id}
            onClick={() => {
              setAnswer(choice.id);
              setFeedback('');
            }}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="cv2-button cv2-button--secondary"
        disabled={!answer || streak === 3}
        onClick={check}
      >
        {streak === 3 ? '암기 확인 완료' : '정답 확인'}
      </button>
      {feedback && (
        <p className={`cv2-recall-drill__feedback is-${feedback}`} role="status">
          {feedback === 'complete'
            ? '3회 연속 정답입니다. Chapter를 완료할 수 있습니다.'
            : feedback === 'correct'
              ? '정답입니다. 같은 답을 다시 떠올려보세요.'
              : '연속 횟수가 0으로 돌아갔습니다. 개념을 확인하고 다시 시작하세요.'}
        </p>
      )}
    </section>
  );
}

export default ConceptRecall;
