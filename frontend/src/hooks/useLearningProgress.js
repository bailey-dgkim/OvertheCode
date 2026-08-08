import { useCallback, useEffect, useMemo, useState } from 'react';

/** @typedef {import('../types/learning.js').LearningState} LearningState */
/** @typedef {import('../types/learning.js').CaseProgress} CaseProgress */

export const STORAGE_KEY = 'enterprise-learning-progress';

/** 콘텐츠 구조가 바뀌어 기존 저장값을 못 쓰게 되면 올린다. */
const STATE_VERSION = 1;

/** @type {LearningState} */
const INITIAL_STATE = {
  version: STATE_VERSION,
  selectedTrack: null,
  selectedCaseId: null,
  dictionaryOpen: false,
  completedCases: [],
  caseProgress: {},
};

/** @type {CaseProgress} */
const INITIAL_CASE_PROGRESS = {
  currentStep: 0,
  completed: false,
  completedSteps: [],
  selectedAnswers: {},
  retryCount: {},
};

function readStoredState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;

    const parsed = JSON.parse(raw);
    // 버전이 다르면 예전 구조를 신뢰할 수 없으므로 새로 시작한다.
    if (!parsed || parsed.version !== STATE_VERSION) return INITIAL_STATE;

    const restored = { ...INITIAL_STATE, ...parsed };

    // 랜딩은 방문할 때마다 다시 보여주므로 저장하지 않는다.
    // 예전 버전이 저장해 둔 값이 남아 있으면 버린다.
    delete restored.landingSeen;

    return restored;
  } catch {
    // 손상된 값이나 localStorage 접근 불가(프라이빗 모드 등)는 초기 상태로 처리한다.
    return INITIAL_STATE;
  }
}

function getCaseSlice(state, caseId) {
  return state.caseProgress[caseId] ?? INITIAL_CASE_PROGRESS;
}

function withCaseProgress(state, caseId, updater) {
  const current = getCaseSlice(state, caseId);
  return {
    ...state,
    caseProgress: {
      ...state.caseProgress,
      [caseId]: { ...current, ...updater(current) },
    },
  };
}

function addOnce(list, value) {
  return list.includes(value) ? list : [...list, value];
}

/**
 * 학습 진행 상태의 단일 소스.
 * App에서 한 번만 호출하고 하위 컴포넌트로 내려보낸다.
 */
export function useLearningProgress() {
  const [state, setState] = useState(readStoredState);

  // 랜딩은 의도적으로 저장하지 않는다.
  // 이 서비스가 말하려는 바를 방문할 때마다 다시 마주하게 하려는 것이라,
  // 학습을 이미 시작한 사람에게도 브라우저를 열 때마다 첫 화면으로 보여준다.
  // 진행 상태는 그대로 남아 있어서 '시작하기'를 누르면 원래 위치로 복귀한다.
  const [landingSeen, setLandingSeen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 저장 실패해도 학습 흐름 자체는 계속 진행되어야 한다.
    }
  }, [state]);

  const completeLanding = useCallback(() => setLandingSeen(true), []);

  const selectTrack = useCallback((trackId) => {
    setState((prev) => ({ ...prev, selectedTrack: trackId }));
  }, []);

  const leaveTrack = useCallback(() => {
    setState((prev) => ({ ...prev, selectedTrack: null, selectedCaseId: null }));
  }, []);

  const backToLanding = useCallback(() =>
    setLandingSeen(false),[]);

  const openCase = useCallback((caseId) => {
    setState((prev) => ({
      ...prev,
      selectedCaseId: caseId,
      caseProgress: {
        ...prev.caseProgress,
        [caseId]: prev.caseProgress[caseId] ?? INITIAL_CASE_PROGRESS,
      },
    }));
  }, []);

  const exitCase = useCallback(() => {
    setState((prev) => ({ ...prev, selectedCaseId: null }));
  }, []);

  const openDictionary = useCallback(() => {
    setState((prev) => ({ ...prev, dictionaryOpen: true }));
  }, []);

  const closeDictionary = useCallback(() => {
    setState((prev) => ({ ...prev, dictionaryOpen: false }));
  }, []);

  /** 현재 단계를 완료 처리하고 다음 단계로 이동한다. */
  const advanceStep = useCallback((caseId, stepId, totalSteps) => {
    setState((prev) =>
      withCaseProgress(prev, caseId, (slice) => ({
        completedSteps: addOnce(slice.completedSteps, stepId),
        currentStep: Math.min(slice.currentStep + 1, totalSteps - 1),
      })),
    );
  }, []);

  const goToStep = useCallback((caseId, stepIndex) => {
    setState((prev) =>
      withCaseProgress(prev, caseId, () => ({
        currentStep: Math.max(0, stepIndex),
      })),
    );
  }, []);

  /**
   * 퀴즈 응답 기록.
   * 정답만 저장해 두었다가 되돌아왔을 때 선택과 피드백을 복원한다.
   * 오답은 재시도 횟수만 누적한다.
   */
  const answerQuestion = useCallback((caseId, stepId, choiceId, isCorrect) => {
    setState((prev) =>
      withCaseProgress(prev, caseId, (slice) => {
        if (!isCorrect) {
          return {
            retryCount: {
              ...slice.retryCount,
              [stepId]: (slice.retryCount[stepId] ?? 0) + 1,
            },
          };
        }
        return {
          selectedAnswers: { ...slice.selectedAnswers, [stepId]: choiceId },
          completedSteps: addOnce(slice.completedSteps, stepId),
        };
      }),
    );
  }, []);

  const completeCase = useCallback((caseId, stepId) => {
    setState((prev) => {
      const next = withCaseProgress(prev, caseId, (slice) => ({
        completed: true,
        completedSteps: addOnce(slice.completedSteps, stepId),
      }));
      return { ...next, completedCases: addOnce(next.completedCases, caseId) };
    });
  }, []);

  /** 해당 케이스 진행 상태만 초기화한다. 전체 localStorage는 건드리지 않는다. */
  const resetCase = useCallback((caseId) => {
    setState((prev) => ({
      ...prev,
      completedCases: prev.completedCases.filter((id) => id !== caseId),
      caseProgress: { ...prev.caseProgress, [caseId]: INITIAL_CASE_PROGRESS },
    }));
  }, []);

  const getCaseProgress = useCallback(
    (caseId, totalSteps) => {
      const slice = getCaseSlice(state, caseId);
      const percent = totalSteps
        ? Math.round((slice.completedSteps.length / totalSteps) * 100)
        : 0;

      return {
        ...slice,
        // 완료한 케이스는 단계 계산과 무관하게 100%로 보여준다.
        percent: slice.completed ? 100 : Math.min(percent, 100),
        started: slice.completedSteps.length > 0 || slice.currentStep > 0,
      };
    },
    [state],
  );

  /** 저장된 상태에서 현재 보여줄 화면을 파생시킨다. 새로고침 복원이 자동으로 된다. */
  const view = useMemo(() => {
    if (!landingSeen) return 'landing';
    if (state.dictionaryOpen) return 'dictionary';
    if (!state.selectedTrack) return 'trackSelect';
    if (state.selectedCaseId) return 'casePlayer';
    if (state.selectedTrack === 'improve') return 'improveList';
    if (state.selectedTrack === 'basic') return 'basicList';
    return 'caseList';
  }, [
    landingSeen,
    state.dictionaryOpen,
    state.selectedTrack,
    state.selectedCaseId,
  ]);

  return {
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
  };
}
