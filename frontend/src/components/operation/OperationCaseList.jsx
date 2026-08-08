import OperationCaseCard from './OperationCaseCard';
import { operationCases, CASE_COMING_SOON_MESSAGE } from '../../data/operationCases';
import { findCaseContent } from '../../data/caseContents';

function OperationCaseList({
  onOpenCase,
  onComingSoon,
  onBack,
  onOpenDictionary,
  getCaseProgress,
  completedCount,
}) {
  const handleSelect = (caseItem) => {
    if (caseItem.status !== 'available') {
      onComingSoon(CASE_COMING_SOON_MESSAGE);
      return;
    }
    onOpenCase(caseItem.id);
  };

  return (
    <main className="oc-screen">
      <div className="oc-container oc-container--wide">
        <div className="oc-list-head">
          <div className="oc-btn-row oc-btn-row--split">
            <button type="button" className="oc-btn oc-btn--ghost" onClick={onBack}>
              ← 트랙 선택으로
            </button>
            <button
              type="button"
              className="oc-btn oc-btn--secondary"
              onClick={onOpenDictionary}
            >
              📖 개념 사전
            </button>
          </div>

          <p className="oc-eyebrow" style={{ marginTop: 12 }}>
            운영 트랙
          </p>
          <h1>운영 케이스</h1>
          <p className="oc-muted" style={{ marginTop: 8 }}>
            실제 운영에서 발생한 문제를 하나씩 해결하며 개념을 익힙니다. 전체 {operationCases.length}개
            중 {completedCount}개 완료.
          </p>
        </div>

        <div className="oc-case-grid">
          {operationCases.map((caseItem) => {
            const content = findCaseContent(caseItem.id);
            const totalSteps = content?.steps.length ?? 0;

            return (
              <OperationCaseCard
                key={caseItem.id}
                caseItem={caseItem}
                progress={getCaseProgress(caseItem.id, totalSteps)}
                onSelect={handleSelect}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default OperationCaseList;
