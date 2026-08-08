import { BadgeList } from '../common/Badge';

/**
 * 퀴즈 선택 직후 노출되는 피드백.
 * 색상만으로 정/오답을 구분하지 않도록 아이콘과 텍스트를 함께 사용하고,
 * aria-live로 스크린리더에 즉시 전달한다.
 */
function FeedbackPanel({ feedback, isCorrect }) {
  if (!feedback) return null;

  const tone = isCorrect ? 'correct' : 'incorrect';

  return (
    <section
      className={`oc-feedback oc-feedback--${tone}`}
      role="status"
      aria-live="polite"
    >
      <h3 className="oc-feedback__head">
        <span className="oc-feedback__icon" aria-hidden="true">
          {isCorrect ? '✓' : '✗'}
        </span>
        <span className="oc-sr-only">{isCorrect ? '정답입니다.' : '오답입니다.'}</span>
        {feedback.title}
      </h3>

      <p className="oc-feedback__body">{feedback.description}</p>

      {feedback.keywords?.length > 0 && (
        <BadgeList items={feedback.keywords} label="연결 키워드" />
      )}

      {feedback.detail && (
        <div className="oc-feedback__detail">
          <p className="oc-feedback__detail-title">{feedback.detail.title}</p>
          <p className="oc-feedback__body">{feedback.detail.body}</p>
          {feedback.detail.example && (
            <p className="oc-feedback__detail-example">예시 — {feedback.detail.example}</p>
          )}
        </div>
      )}

      {feedback.note && <p className="oc-feedback__note">{feedback.note}</p>}
    </section>
  );
}

export default FeedbackPanel;
