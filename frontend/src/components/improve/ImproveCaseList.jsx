import OperationCaseCard from '../operation/OperationCaseCard';
import { improveCases, IMPROVE_CASE_COMING_SOON_MESSAGE } from '../../data/improveCases';
import { findCaseContent } from '../../data/caseContents';

/**
 * 개선 트랙 케이스 목록.
 * 카드 UI는 운영 트랙과 동일하므로 OperationCaseCard를 그대로 재사용한다.
 */
function ImproveCaseList({ onOpenCase, onComingSoon, onBack, getCaseProgress, completedCount }) {
  const handleSelect = (caseItem) => {
    if (caseItem.status !== 'available') {
      onComingSoon(IMPROVE_CASE_COMING_SOON_MESSAGE);
      return;
    }
    onOpenCase(caseItem.id);
  };

  return (
    <main className="oc-screen">
      <div className="oc-container oc-container--wide">
        <div className="oc-list-head">
          <button type="button" className="oc-btn oc-btn--ghost" onClick={onBack}>
            ← 트랙 선택으로
          </button>

          <p className="oc-eyebrow" style={{ marginTop: 12 }}>
            개선 트랙
          </p>
          <h1>개선 미션</h1>
          <p className="oc-muted" style={{ marginTop: 8 }}>
            이미 있는 코드를 읽고, 어디를 어떻게 바꿔야 하는지 직접 찾아갑니다. 전체{' '}
            {improveCases.length}개 중 {completedCount}개 완료.
          </p>
        </div>

        <div className="oc-case-grid">
          {improveCases.map((caseItem) => {
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

export default ImproveCaseList;
