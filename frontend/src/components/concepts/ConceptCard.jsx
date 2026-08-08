import { useState } from 'react';
import Badge from '../common/Badge';

/**
 * 개념 카드.
 * 복습 모드에서는 정의를 가리고 이름만 보여준다. 스스로 떠올려본 뒤 펼쳐서 확인한다.
 */
function ConceptCard({ concept, reviewMode, learned }) {
  const [revealed, setRevealed] = useState(false);
  const hidden = reviewMode && !revealed;

  return (
    <article className="oc-concept oc-dict-card">
      <div className="oc-dict-card__head">
        <h3 className="oc-concept__name">{concept.name}</h3>
        {concept.source.type === 'mission' ? (
          <Badge variant={learned ? 'success' : 'neutral'}>
            {learned ? '✓ 학습함' : '미학습'}
          </Badge>
        ) : (
          <Badge variant="neutral">참고</Badge>
        )}
      </div>

      {hidden ? (
        <button
          type="button"
          className="oc-dict-card__reveal"
          onClick={() => setRevealed(true)}
          aria-label={`${concept.name} 정의 보기`}
        >
          정의 보기
        </button>
      ) : (
        <>
          <p className="oc-concept__definition">{concept.definition}</p>

          {concept.forbidden && (
            <p className="oc-dict-card__forbidden">
              <span className="oc-dict-card__forbidden-label">여기 있으면 안 되는 것</span>
              {concept.forbidden}
            </p>
          )}

          {concept.example && (
            <p className="oc-concept__example">예시 — {concept.example}</p>
          )}

          <div className="oc-dict-card__foot">
            {concept.counterpart && (
              <span className="oc-dict-card__counterpart">
                짝 · <strong>{concept.counterpart}</strong>
              </span>
            )}
            <span className="oc-concept__used">{concept.source.label}</span>
          </div>
        </>
      )}
    </article>
  );
}

export default ConceptCard;
