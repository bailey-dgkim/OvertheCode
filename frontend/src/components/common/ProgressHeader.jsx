/**
 * 학습 플레이어 상단 고정 헤더.
 * 케이스 이름 · 현재 단계 · 진행률 · 목록 복귀 버튼을 담당한다.
 */
function ProgressHeader({ caseLabel, stepIndex, totalSteps, percent, onExit }) {
  return (
    <header className="oc-progress-header">
      <div className="oc-progress-header__inner">
        <div className="oc-progress-header__top">
          <span className="oc-progress-header__label">{caseLabel}</span>
          <div className="oc-btn-row">
            <span className="oc-progress-header__step">
              {stepIndex + 1} / {totalSteps} 단계
            </span>
            <button type="button" className="oc-btn oc-btn--ghost" onClick={onExit}>
              케이스 목록으로
            </button>
          </div>
        </div>

        <div
          className="oc-progressbar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="학습 진행률"
        >
          <div
            className={`oc-progressbar__fill${percent === 100 ? ' oc-progressbar__fill--done' : ''}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </header>
  );
}

export default ProgressHeader;
