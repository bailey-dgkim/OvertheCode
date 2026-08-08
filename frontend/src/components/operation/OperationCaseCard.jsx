import Badge from '../common/Badge';

function OperationCaseCard({ caseItem, progress, onSelect }) {
  const available = caseItem.status === 'available';
  const { percent = 0, completed = false, started = false } = progress ?? {};

  return (
    <button
      type="button"
      className={`oc-card oc-case oc-case--${available ? 'available' : 'comingSoon'}`}
      onClick={() => onSelect(caseItem)}
      aria-disabled={!available}
      aria-label={`케이스 ${caseItem.number} ${caseItem.title} · ${
        available ? (completed ? '완료' : `진행률 ${percent}%`) : '준비 중'
      }`}
    >
      <div className="oc-case__head">
        <span className="oc-case__number">{caseItem.number}</span>
        {completed && <Badge variant="success">✓ 완료</Badge>}
        {!completed && started && available && <Badge variant="keyword">학습 중</Badge>}
        {!available && <Badge variant="neutral">준비 중</Badge>}
      </div>

      <span className="oc-case__title">{caseItem.title}</span>
      <span className="oc-case__desc">{caseItem.description}</span>

      <div className="oc-case__meta">
        <span>난이도 {caseItem.difficulty}</span>
        <span aria-hidden="true">·</span>
        <span>약 {caseItem.estimatedMinutes}분</span>
      </div>

      <div className="oc-badge-list">
        {caseItem.keywords.map((keyword) => (
          <Badge key={keyword} variant="neutral">
            {keyword}
          </Badge>
        ))}
      </div>

      <div className="oc-case__foot">
        <div className="oc-progress-meta">
          <span>진행률</span>
          <span>{available ? `${percent}%` : '—'}</span>
        </div>
        <div
          className="oc-progressbar"
          role="progressbar"
          aria-valuenow={available ? percent : 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`케이스 ${caseItem.number} 진행률`}
        >
          <div
            className={`oc-progressbar__fill${completed ? ' oc-progressbar__fill--done' : ''}`}
            style={{ width: `${available ? percent : 0}%` }}
          />
        </div>
      </div>
    </button>
  );
}

export default OperationCaseCard;
