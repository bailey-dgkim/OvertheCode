import { useCallback, useState } from 'react';
import './App.css';
import './styles/tokens.css';
import './styles/learning.css';
import './styles/landing.css';

import Toast from './components/common/Toast';
import LandingScreen from './components/landing/LandingScreen';
import TrackSelectScreen from './components/onboarding/TrackSelectScreen';
import OperationCaseList from './components/operation/OperationCaseList';
import ImproveCaseList from './components/improve/ImproveCaseList';
import BasicCaseList from './components/basic/BasicCaseList';
import CasePlayer from './components/operation/CasePlayer';
import ConceptDictionary from './components/concepts/ConceptDictionary';
import { useLearningProgress } from './hooks/useLearningProgress';
import { findCaseContent } from './data/caseContents';

/**
 * 화면 전환 셸.
 * 어떤 화면을 보여줄지는 useLearningProgress가 저장된 상태에서 파생시키므로
 * 새로고침해도 마지막 위치가 그대로 복원된다.
 *
 * 기존 챕터 목록 화면(api/chapterApi.js, components/ChapterCard.jsx)은
 * 백엔드 GET /chapters와 함께 그대로 남아 있고, 미션 API 작업 때 다시 연결한다.
 */
function App() {
  const {
    state,
    view,
    completeLanding,
    selectTrack,
    leaveTrack,
    backToLanding,
    openCase,
    exitCase,
    openDictionary,
    closeDictionary,
    advanceStep,
    goToStep,
    answerQuestion,
    completeCase,
    resetCase,
    getCaseProgress,
  } = useLearningProgress();

  const [toast, setToast] = useState('');
  const dismissToast = useCallback(() => setToast(''), []);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingScreen onStart={completeLanding} />;

      case 'trackSelect':
        return <TrackSelectScreen onSelectTrack={selectTrack} onComingSoon={setToast} onBack={backToLanding}/>;

      case 'caseList':
        return (
          <OperationCaseList
            onOpenCase={openCase}
            onComingSoon={setToast}
            onBack={leaveTrack}
            onOpenDictionary={openDictionary}
            getCaseProgress={getCaseProgress}
            completedCount={
              state.completedCases.filter((id) => id.startsWith('operation-')).length
            }
          />
        );

      case 'improveList':
        return (
          <ImproveCaseList
            onOpenCase={openCase}
            onComingSoon={setToast}
            onBack={leaveTrack}
            getCaseProgress={getCaseProgress}
            completedCount={
              state.completedCases.filter((id) => id.startsWith('improve-')).length
            }
          />
        );

      case 'basicList':
        return (
          <BasicCaseList
            onOpenCase={openCase}
            onComingSoon={setToast}
            onBack={leaveTrack}
            getCaseProgress={getCaseProgress}
            completedCount={
              state.completedCases.filter((id) => id.startsWith('basic-')).length
            }
          />
        );

      case 'dictionary':
        return (
          <ConceptDictionary
            completedCases={state.completedCases}
            onBack={closeDictionary}
          />
        );

      case 'casePlayer': {
        const caseId = state.selectedCaseId;
        const totalSteps = findCaseContent(caseId)?.steps.length ?? 0;

        return (
          <CasePlayer
            caseId={caseId}
            progress={getCaseProgress(caseId, totalSteps)}
            onExit={exitCase}
            onAnswer={answerQuestion}
            onAdvance={advanceStep}
            onGoToStep={goToStep}
            onCompleteCase={completeCase}
            onResetCase={resetCase}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="oc-app">
      {renderView()}
      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
