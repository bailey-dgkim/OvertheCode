/**
 * V2 콘텐츠가 공통으로 사용하는 값.
 *
 * 새 활동 유형을 추가할 때 여러 파일에 문자열을 흩뿌리지 않고
 * 이 목록을 기준으로 로더, 검증기, 렌더러가 같은 이름을 쓰게 한다.
 */
export const CURRICULUM_SCHEMA_VERSION = 1;

export const LEARNING_STAGES = Object.freeze([
  'orientation',
  'incident',
  'observe',
  'locate',
  'hypothesize',
  'experiment',
  'fix',
  'verify',
  'explain',
  'complete',
]);

export const ACTIVITY_TYPES = Object.freeze([
  'content',
  'evidence',
  'single-choice',
  'multi-choice',
  'map-select',
  'sequence',
  'diff-review',
  'checklist',
  'free-response',
  'completion',
]);

export const MAP_NODE_STATES = Object.freeze([
  'unseen',
  'current',
  'completed',
  'review',
  'reference',
]);
