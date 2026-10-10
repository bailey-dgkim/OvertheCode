import Badge from '../common/Badge';

function MissionComplete({ step, onExit, onRestart }) {
  return (
    <div className="oc-card oc-complete">
      <span className="oc-complete__check" aria-hidden="true">
        ✓
      </span>

      <div>
        <h2>{step.title}</h2>
        {step.message && (
          <p className="oc-muted" style={{ marginTop: 8 }}>
            {step.message}
          </p>
        )}
      </div>

      <div className="oc-complete__badge">
        <p className="oc-complete__badge-label">획득 배지</p>
        <p className="oc-complete__badge-name">{step.badge}</p>
      </div>

      <div className="oc-complete__section">
        <p className="oc-complete__section-label">학습한 개념</p>
        <div className="oc-badge-list">
          {step.learnedConcepts.map((concept) => (
            <Badge key={concept} variant="keyword">
              {concept}
            </Badge>
          ))}
        </div>
      </div>

      <div className="oc-btn-row oc-btn-row--stack" style={{ width: '100%' }}>
        <button type="button" className="oc-btn oc-btn--primary" onClick={onExit}>
          케이스 목록으로
        </button>
        <button type="button" className="oc-btn oc-btn--secondary" onClick={onRestart}>
          처음부터 다시 학습
        </button>
      </div>
    </div>
  );
}

export default MissionComplete;
