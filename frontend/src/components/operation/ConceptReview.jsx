import { resolveConceptRefs } from '../../data/concepts';

function ConceptReview({ step, onNext }) {
  const concepts = resolveConceptRefs(step.conceptRefs);

  return (
    <div className="oc-stack oc-stack--lg">
      <div>
        <h2 className="oc-step__title">{step.title}</h2>
        <p className="oc-muted">{step.description}</p>
      </div>

      <div className="oc-concept-grid">
        {concepts.map((concept) => (
          <article key={concept.id} className="oc-concept">
            <h3 className="oc-concept__name">{concept.name}</h3>
            <p className="oc-concept__definition">{concept.definition}</p>
            <p className="oc-concept__example">실무 예시 — {concept.example}</p>
            <p className="oc-concept__used">사용된 위치 · {concept.usedAt}</p>
          </article>
        ))}
      </div>

      <div className="oc-btn-row oc-btn-row--stack">
        <button type="button" className="oc-btn oc-btn--primary" onClick={onNext}>
          응용 문제 풀기
        </button>
      </div>
    </div>
  );
}

export default ConceptReview;
