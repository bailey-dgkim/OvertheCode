import Badge, { BadgeList } from '../common/Badge';

const LAYER_COLOR_VAR = {
  frontend: 'var(--layer-frontend)',
  backend: 'var(--layer-backend)',
  database: 'var(--layer-database)',
  operation: 'var(--layer-operation)',
};

function SolutionFlow({ step, onNext }) {
  return (
    <div className="oc-stack oc-stack--lg">
      <div>
        <h2 className="oc-step__title">{step.title}</h2>
        <p className="oc-muted">{step.description}</p>
      </div>

      <ol className="oc-flow">
        {step.flow.map((item, index) => {
          const isLast = index === step.flow.length - 1;

          return (
            <li key={item.layerLabel} className="oc-flow__item">
              <div className="oc-flow__rail" aria-hidden="true">
                <span
                  className="oc-flow__dot"
                  style={{ background: LAYER_COLOR_VAR[item.layer] }}
                >
                  {index + 1}
                </span>
                {!isLast && <span className="oc-flow__line" />}
              </div>

              <div className="oc-flow__body">
                <Badge variant="layer" layer={item.layer}>
                  {item.layerLabel}
                </Badge>
                <p className="oc-flow__action">{item.action}</p>
                <p className="oc-flow__solves">
                  <strong>해결하는 문제 —</strong> {item.solves}
                </p>
                <BadgeList items={item.keywords} />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="oc-summary">
        {step.summary.map((line) => (
          <p key={line}>{line}</p>
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

export default SolutionFlow;
