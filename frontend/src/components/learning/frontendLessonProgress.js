import { useEffect, useState } from 'react';

const STORAGE_PREFIX = 'otc:frontend-lesson:v2:';

function initialProgress() {
  return {
    stepIndex: 0,
    unlockedThrough: 0,
    completedMissionIds: [],
    completed: false,
  };
}

export function readFrontendLessonProgress(chapterId) {
  if (typeof window === 'undefined') return initialProgress();

  try {
    const stored = JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}${chapterId}`));
    if (!stored || typeof stored !== 'object') return initialProgress();

    return {
      ...initialProgress(),
      ...stored,
      completedMissionIds: Array.isArray(stored.completedMissionIds)
        ? stored.completedMissionIds
        : [],
    };
  } catch {
    return initialProgress();
  }
}

export function useFrontendLessonProgress(chapterId, totalSteps) {
  const [progress, setProgress] = useState(() => {
    const stored = readFrontendLessonProgress(chapterId);
    const lastIndex = Math.max(0, totalSteps - 1);
    return {
      ...stored,
      stepIndex: Math.min(stored.stepIndex, lastIndex),
      unlockedThrough: Math.min(Math.max(stored.unlockedThrough, stored.stepIndex), lastIndex),
    };
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${chapterId}`, JSON.stringify(progress));
    } catch {
      // 저장에 실패해도 현재 학습은 계속 진행한다.
    }
  }, [chapterId, progress]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [progress.stepIndex]);

  const openStep = (index) => {
    if (index < 0 || index > progress.unlockedThrough || index >= totalSteps) return;
    setProgress((current) => ({ ...current, stepIndex: index }));
  };

  const previous = () => {
    setProgress((current) => ({ ...current, stepIndex: Math.max(0, current.stepIndex - 1) }));
  };

  const advance = () => {
    setProgress((current) => {
      const nextIndex = Math.min(totalSteps - 1, current.stepIndex + 1);
      return {
        ...current,
        stepIndex: nextIndex,
        unlockedThrough: Math.max(current.unlockedThrough, nextIndex),
      };
    });
  };

  const markMissionComplete = (missionId) => {
    setProgress((current) => ({
      ...current,
      completedMissionIds: current.completedMissionIds.includes(missionId)
        ? current.completedMissionIds
        : [...current.completedMissionIds, missionId],
    }));
  };

  const complete = () => {
    setProgress((current) => {
      const next = { ...current, completed: true };
      try {
        window.localStorage.setItem(`${STORAGE_PREFIX}${chapterId}`, JSON.stringify(next));
      } catch {
        // 완료 이동 직전에 저장할 수 없어도 학습 화면은 정상적으로 종료한다.
      }
      return next;
    });
  };

  const reset = () => setProgress(initialProgress());

  return {
    ...progress,
    advance,
    complete,
    markMissionComplete,
    openStep,
    previous,
    reset,
  };
}

export { STORAGE_PREFIX as FRONTEND_LESSON_STORAGE_PREFIX };
