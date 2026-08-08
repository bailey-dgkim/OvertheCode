import Badge, { BadgeList } from '../common/Badge';

function KeywordMapping({ step, onNext }) {
  return (
    <div className="oc-stack oc-stack--lg">
      <div>
        <h2 className="oc-step__title">{step.title}</h2>
        <p className="oc-muted">{step.description}</p>
      </div>

      <div className="oc-mapping-list">
        {step.mappings.map((mapping) => (
          <article key={mapping.action} className={`oc-mapping oc-mapping--${mapping.layer}`}>
            <div className="oc-mapping__head">
              <h3 className="oc-mapping__action">{mapping.action}</h3>
              <Badge variant="layer" layer={mapping.layer}>
                {mapping.layerLabel}
              </Badge>
            </div>

            <BadgeList items={mapping.keywords} label="기술 키워드" />

            <dl className="oc-mapping__row">
              <dt>해결하는 문제</dt>
              <dd>{mapping.solves}</dd>
            </dl>

            <dl className="oc-mapping__row">
              <dt>왜 필요한가</dt>
              <dd>{mapping.why}</dd>
            </dl>
          </article>
        ))}
      </div>

      <div className="oc-btn-row oc-btn-row--stack">
        <button type="button" className="oc-btn oc-btn--primary" onClick={onNext}>
          다음 단계
        </button>
      </div>
    </div>
  );
}

export default KeywordMapping;
