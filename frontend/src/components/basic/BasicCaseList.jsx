import OperationCaseCard from '../operation/OperationCaseCard';
import { basicCases, BASIC_CASE_COMING_SOON_MESSAGE } from '../../data/basicCases';
import { findCaseContent } from '../../data/caseContents';

/**
 * 기초 트랙 케이스 목록.
 * 카드 UI는 다른 트랙과 동일하므로 OperationCaseCard를 재사용한다.
 */
function BasicCaseList({ onOpenCase, onComingSoon, onBack, getCaseProgress, completedCount }) {
  const handleSelect = (caseItem) => {
    if (caseItem.status !== 'available') {
      onComingSoon(BASIC_CASE_COMING_SOON_MESSAGE);
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
            기초 트랙
          </p>
          <h1>기초 다지기</h1>
          <p className="oc-muted" style={{ marginTop: 8 }}>
            실무가 익숙해졌다면, 이제 Java 문법·자료구조·알고리즘으로 한 단계 내려갑니다. 전체{' '}
            {basicCases.length}개 중 {completedCount}개 완료.
          </p>
        </div>

        <div className="oc-case-grid">
          {basicCases.map((caseItem) => {
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

export default BasicCaseList;
