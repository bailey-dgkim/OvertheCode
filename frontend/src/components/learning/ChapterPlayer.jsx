import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { curriculumRepository } from '../../content/v2';
import NotFoundScreen from '../curriculum/NotFoundScreen';
import ChapterActivity from './ChapterActivity';

const STAGE_LABELS = {
  orientation: '위치 확인',
  incident: '문제 상황',
  observe: '증거 관찰',
  locate: '문제 위치',
  hypothesize: '원인 가설',
  experiment: '추가 실험',
  fix: '변경 검토',
  verify: '검증과 운영',
  explain: '내 언어로 설명',
  complete: '완료',
};

function ChapterPlayer() {
  const { chapterId } = useParams();

  return <ChapterPlayerContent key={chapterId} chapterId={chapterId} />;
}

function ChapterPlayerContent({ chapterId }) {
  const chapter = curriculumRepository.getChapter(chapterId);
  const systemMap = curriculumRepository.getSystemMap();
  const [stepIndex, setStepIndex] = useState(0);
  const [completedStepIds, setCompletedStepIds] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [stepIndex, finished]);

  if (!chapter) {
    return (
      <NotFoundScreen
        title="Chapter를 찾을 수 없습니다"
        description="커리큘럼에서 존재하는 Chapter를 다시 선택해 주세요."
      />
    );
  }

  if (chapter.steps.length === 0) {
    return (
      <div className="cv2-container cv2-player-page">
        <div className="cv2-player-empty">
          <p className="cv2-player-kicker">Chapter {String(chapter.order).padStart(2, '0')}</p>
          <h1>학습 콘텐츠 준비 중</h1>
          <p>공통 학습 화면은 준비되었습니다. 다음 단계에서 이 Chapter의 실제 미션을 채웁니다.</p>
          <Link className="cv2-player-button cv2-player-button--primary" to={`/chapters/${chapter.id}`}>
            Chapter 소개로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const step = chapter.steps[stepIndex];
  const isLastStep = stepIndex === chapter.steps.length - 1;
  const percent = finished
    ? 100
    : Math.round((completedStepIds.length / chapter.steps.length) * 100);

  const completeCurrentStep = () => {
    setCompletedStepIds((current) => (
      current.includes(step.id) ? current : [...current, step.id]
    ));

    if (isLastStep) {
      setFinished(true);
    } else {
      setStepIndex((current) => current + 1);
    }
  };

  if (finished) {
    return (
      <div className="cv2-container cv2-player-page">
        <section className="cv2-player-finished">
          <p className="cv2-player-kicker">Chapter complete</p>
          <h1>{chapter.title}</h1>
          <p>{chapter.completionPrompt}</p>
          <div>
            <Link className="cv2-player-button cv2-player-button--primary" to={`/parts/${chapter.partId}`}>
              Part로 돌아가기
            </Link>
            <button
              className="cv2-player-button cv2-player-button--secondary"
              type="button"
              onClick={() => {
                setStepIndex(0);
                setCompletedStepIds([]);
                setFinished(false);
              }}
            >
              다시 학습하기
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="cv2-player-page">
      <header className="cv2-player-header">
        <div className="cv2-container">
          <div className="cv2-player-header__top">
            <div>
              <Link to={`/chapters/${chapter.id}`}>← Chapter 나가기</Link>
              <strong>{chapter.title}</strong>
            </div>
            <span>{stepIndex + 1} / {chapter.steps.length}</span>
          </div>
          <div
            className="cv2-player-progress"
            role="progressbar"
            aria-label="Chapter 진행률"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={percent}
          >
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      </header>

      <main className="cv2-container cv2-player-main">
        <div className="cv2-player-step-heading">
          <div>
            <p className="cv2-player-kicker">{STAGE_LABELS[step.stage] ?? step.stage}</p>
            <h1>{step.label}</h1>
          </div>
          <span>Step {String(stepIndex + 1).padStart(2, '0')}</span>
        </div>

        <ChapterActivity
          key={step.id}
          chapterMap={chapter.map}
          isLastStep={isLastStep}
          onComplete={completeCurrentStep}
          step={step}
          systemMap={systemMap}
        />

        {stepIndex > 0 && (
          <div className="cv2-player-back-row">
            <button
              className="cv2-player-button cv2-player-button--secondary"
              type="button"
              onClick={() => setStepIndex((current) => current - 1)}
            >
              ← 이전 단계
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ChapterPlayer;
