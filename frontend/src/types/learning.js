/**
 * 학습 콘텐츠/진행 상태에 대한 타입 정의.
 * 런타임 코드는 없고 에디터 자동완성용 JSDoc typedef만 둔다.
 * 나중에 TypeScript로 전환하면 그대로 .ts로 승격할 수 있다.
 */

/** @typedef {'frontend' | 'backend' | 'database' | 'operation'} Layer */
/** @typedef {'available' | 'comingSoon'} ContentStatus */
/** @typedef {'mission' | 'quiz' | 'solution' | 'mapping' | 'concepts' | 'complete'} StepType */

/**
 * @typedef {Object} Track
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string[]} examples
 * @property {ContentStatus} status
 * @property {string} statusLabel
 */

/**
 * @typedef {Object} CaseSummary
 * @property {string} id
 * @property {string} track
 * @property {string} number
 * @property {string} title
 * @property {string} description
 * @property {string} difficulty
 * @property {number} estimatedMinutes
 * @property {string[]} keywords
 * @property {ContentStatus} status
 */

/**
 * @typedef {Object} Choice
 * @property {string} id
 * @property {string} text
 */

/**
 * @typedef {Object} Feedback
 * @property {string} title
 * @property {string} description
 * @property {string[]} [keywords]
 * @property {string} [note]
 * @property {{ title: string, body: string, example?: string }} [detail]
 */

/**
 * @typedef {Object} Step
 * @property {string} id
 * @property {StepType} type
 * @property {string} label            헤더에 노출할 단계 이름
 * @property {string} [situation]      퀴즈 앞에 붙는 "추가 상황"
 * @property {string} [question]
 * @property {Choice[]} [choices]
 * @property {string} [correctAnswer]
 * @property {Feedback} [correctFeedback]
 * @property {Feedback} [incorrectFeedback]
 */

/**
 * @typedef {Object} CaseProgress
 * @property {number} currentStep
 * @property {boolean} completed
 * @property {string[]} completedSteps
 * @property {Record<string, string>} selectedAnswers
 * @property {Record<string, number>} retryCount
 */

/**
 * @typedef {Object} LearningState
 * @property {number} version
 * @property {string | null} selectedTrack
 * @property {string | null} selectedCaseId
 * @property {string[]} completedCases
 * @property {Record<string, CaseProgress>} caseProgress
 */

export {};
