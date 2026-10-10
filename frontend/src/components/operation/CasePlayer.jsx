import { useEffect } from 'react';
import ProgressHeader from '../common/ProgressHeader';
import MissionStep from './MissionStep';
import QuizStep from './QuizStep';
import SolutionFlow from './SolutionFlow';
import KeywordMapping from './KeywordMapping';
import ConceptReview from './ConceptReview';
import MissionComplete from './MissionComplete';
import LocateFileStep from '../improve/LocateFileStep';
import LocateCodeStep from '../improve/LocateCodeStep';
import StructureStep from '../basic/StructureStep';
import TranslateStep from '../basic/TranslateStep';
import CallStackViz from '../basic/CallStackViz';
import { findCaseContent } from '../../data/caseContents';
import { findCaseSummary, TRACK_CASE_LABEL } from '../../data/caseSummaries';

/**
 * 케이스 학습 플레이어.
 * step.type으로 렌더러를 고르기 때문에 새 스텝 유형은 여기에만 등록하면 된다.
 */
function CasePlayer({
  caseId,
  progress,
  onExit,
  onAnswer,
  onAdvance,
  onGoToStep,
  onCompleteCase,
  onResetCase,
}) {
  const content = findCaseContent(caseId);
  const summary = findCaseSummary(caseId);

  const steps = content?.steps ?? [];
  const totalSteps = steps.length;

  // 저장된 값이 콘텐츠 범위를 벗어나면(콘텐츠 수정 등) 안전하게 맞춘다.
  const stepIndex = Math.min(Math.max(progress.currentStep ?? 0, 0), Math.max(totalSteps - 1, 0));
  const step = steps[stepIndex];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stepIndex]);

  if (!content || !step) {
    return (
      <main className="oc-screen">
        <div className="oc-container">
          <div className="oc-card">
            <h2>학습 콘텐츠를 찾을 수 없습니다</h2>
            <p className="oc-muted" style={{ marginTop: 8 }}>
              이 케이스는 아직 준비 중입니다.
            </p>
            <div className="oc-btn-row" style={{ marginTop: 20 }}>
              <button type="button" className="oc-btn oc-btn--primary" onClick={onExit}>
                케이스 목록으로
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleNext = () => {
    onAdvance(caseId, step.id, totalSteps);

    // 완료 화면으로 진입하는 순간이 곧 케이스 완료 시점이다.
    const nextStep = steps[stepIndex + 1];
    if (nextStep?.type === 'complete') {
      onCompleteCase(caseId, nextStep.id);
    }
  };

  const handlePrev = () => onGoToStep(caseId, stepIndex - 1);

  const renderStep = () => {
    switch (step.type) {
      case 'mission':
        return <MissionStep step={step} onNext={handleNext} />;

      case 'quiz':
        return (
          <QuizStep
            key={step.id}
            step={step}
            savedAnswer={progress.selectedAnswers?.[step.id]}
            onAnswer={(stepId, choiceId, isCorrect) =>
              onAnswer(caseId, stepId, choiceId, isCorrect)
            }
            onNext={handleNext}
          />
        );

      case 'solution':
        return <SolutionFlow step={step} onNext={handleNext} />;

      case 'mapping':
        return <KeywordMapping step={step} onNext={handleNext} />;

      case 'concepts':
        return <ConceptReview step={step} onNext={handleNext} />;

      case 'structure':
        return <StructureStep step={step} onNext={handleNext} />;

      case 'translate':
        return <TranslateStep step={step} onNext={handleNext} />;

      case 'call-stack-viz':
        return <CallStackViz key={step.id} step={step} onNext={handleNext} />;

      case 'locate-file':
        return (
          <LocateFileStep
            key={step.id}
            step={step}
            savedAnswer={progress.selectedAnswers?.[step.id]}
            onAnswer={(stepId, choiceId, isCorrect) =>
              onAnswer(caseId, stepId, choiceId, isCorrect)
            }
            onNext={handleNext}
          />
        );

      case 'locate-code':
        return (
          <LocateCodeStep
            key={step.id}
            step={step}
            savedAnswer={progress.selectedAnswers?.[step.id]}
            onAnswer={(stepId, choiceId, isCorrect) =>
              onAnswer(caseId, stepId, choiceId, isCorrect)
            }
            onNext={handleNext}
          />
        );

      case 'complete':
        return (
          <MissionComplete
            step={step}
            onExit={onExit}
            onRestart={() => onResetCase(caseId)}
          />
        );

      default:
        return null;
    }
  };

  const percent = Math.min(
    Math.round((progress.completedSteps.length / totalSteps) * 100),
    100,
  );

  return (
    <>
      <ProgressHeader
        caseLabel={`${TRACK_CASE_LABEL[summary?.track] ?? '케이스'} ${summary?.number ?? ''}`.trim()}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        percent={progress.completed ? 100 : percent}
        onExit={onExit}
      />

      <main className="oc-step">
        <div className="oc-container">
          <p className="oc-eyebrow" style={{ marginBottom: 6 }}>
            {step.label}
          </p>
          <h1 className="oc-sr-only">
            {summary?.title} — {step.label}
          </h1>

          {renderStep()}

          {stepIndex > 0 && step.type !== 'complete' && (
            <div className="oc-step__nav">
              <button type="button" className="oc-btn oc-btn--ghost" onClick={handlePrev}>
                ← 이전 단계
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default CasePlayer;
