import { useMemo, useState } from 'react';
import ConceptCard from './ConceptCard';
import LayerMapPanel from './LayerMapPanel';
import { concepts, DOMAINS, CONCEPT_GROUPS } from '../../data/concepts';

const ALL = 'all';

/** 개념이 '학습함' 상태인지 판단한다. 참고 개념은 항상 열려 있다. */
function isLearned(concept, completedCases) {
  if (concept.source.type !== 'mission') return false;
  return completedCases.includes(concept.source.caseId);
}

function ConceptDictionary({ completedCases, onBack }) {
  const [domain, setDomain] = useState(ALL);
  const [reviewMode, setReviewMode] = useState(false);

  const visible = useMemo(
    () => (domain === ALL ? concepts : concepts.filter((c) => c.domain === domain)),
    [domain],
  );

  // 그룹이 있는 개념은 묶어서, 없는 개념은 '개념' 묶음으로 보여준다.
  const grouped = useMemo(() => {
    const buckets = new Map();
    visible.forEach((concept) => {
      const key = concept.group ?? 'default';
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(concept);
    });
    return [...buckets.entries()];
  }, [visible]);

  const learnedCount = concepts.filter((c) => isLearned(c, completedCases)).length;
  const missionCount = concepts.filter((c) => c.source.type === 'mission').length;

  return (
    <main className="oc-screen">
      <div className="oc-container oc-container--wide">
        <button type="button" className="oc-btn oc-btn--ghost" onClick={onBack}>
          ← 케이스 목록으로
        </button>

        <div className="oc-list-head" style={{ marginTop: 12 }}>
          <p className="oc-eyebrow">Reference</p>
          <h1>개념 사전</h1>
          <p className="oc-muted" style={{ marginTop: 8 }}>
            미션에서 만난 개념과 참고 개념을 모아둡니다. 미션 개념 {missionCount}개 중{' '}
            {learnedCount}개 학습했습니다.
          </p>
        </div>

        <div className="oc-dict-controls">
          <div className="oc-dict-filters" role="group" aria-label="도메인 필터">
            <button
              type="button"
              className={`oc-chip${domain === ALL ? ' oc-chip--active' : ''}`}
              onClick={() => setDomain(ALL)}
              aria-pressed={domain === ALL}
            >
              전체
            </button>
            {DOMAINS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`oc-chip${domain === item.id ? ' oc-chip--active' : ''}`}
                onClick={() => setDomain(item.id)}
                aria-pressed={domain === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`oc-chip oc-chip--toggle${reviewMode ? ' oc-chip--active' : ''}`}
            onClick={() => setReviewMode((prev) => !prev)}
            aria-pressed={reviewMode}
          >
            {reviewMode ? '✓ 복습 모드' : '복습 모드'}
          </button>
        </div>

        {reviewMode && (
          <p className="oc-dict-hint" role="status">
            정의를 가렸습니다. 먼저 떠올려본 뒤 카드를 펼쳐 확인하세요.
          </p>
        )}

        {(domain === ALL || domain === 'architecture') && <LayerMapPanel />}

        {visible.length === 0 ? (
          <div className="oc-card oc-dict-empty">
            <h3>아직 이 도메인의 개념이 없습니다</h3>
            <p className="oc-muted" style={{ marginTop: 8 }}>
              관련 운영 케이스가 추가되면 여기에 쌓입니다.
            </p>
          </div>
        ) : (
          grouped.map(([groupKey, items]) => (
            <section key={groupKey} className="oc-dict-section">
              {groupKey !== 'default' && (
                <h2 className="oc-dict-section__title">{CONCEPT_GROUPS[groupKey]}</h2>
              )}
              <div className="oc-concept-grid">
                {items.map((concept) => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    reviewMode={reviewMode}
                    learned={isLearned(concept, completedCases)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}

export default ConceptDictionary;
