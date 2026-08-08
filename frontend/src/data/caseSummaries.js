import { operationCases } from './operationCases';
import { improveCases } from './improveCases';
import { basicCases } from './basicCases';

/**
 * 모든 트랙의 케이스 카드 메타를 한데 모아 조회한다.
 * CasePlayer는 트랙과 무관하게 이 함수로 케이스 제목·번호를 찾는다.
 */
const allSummaries = [...operationCases, ...improveCases, ...basicCases];

export function findCaseSummary(caseId) {
  return allSummaries.find((item) => item.id === caseId) ?? null;
}

/** 트랙 id → 플레이어 헤더에 붙일 접두사 */
export const TRACK_CASE_LABEL = {
  operation: '운영 케이스',
  improve: '개선 미션',
  basic: '기초',
};
