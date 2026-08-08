import operation01 from './cases/operation-01.json';
import operation02 from './cases/operation-02.json';
import operation03 from './cases/operation-03.json';
import operation04 from './cases/operation-04.json';
import operation05 from './cases/operation-05.json';
import operation06 from './cases/operation-06.json';
import operation07 from './cases/operation-07.json';
import operation08 from './cases/operation-08.json';
import operation09 from './cases/operation-09.json';
import operation10 from './cases/operation-10.json';
import improve01 from './cases/improve-01.json';
import basic01 from './cases/basic-01.json';
import basic02 from './cases/basic-02.json';
import basic03 from './cases/basic-03.json';
import basic04 from './cases/basic-04.json';
import basic05 from './cases/basic-05.json';
import basic06 from './cases/basic-06.json';
import basic07 from './cases/basic-07.json';
import basic08 from './cases/basic-08.json';
import basic09 from './cases/basic-09.json';

/**
 * 케이스 id → 상세 학습 콘텐츠.
 *
 * 콘텐츠는 JSON으로 관리한다. 나중에 백엔드 미션 API로 옮길 때
 * 같은 파일에서 seed를 생성해 콘텐츠를 두 번 쓰지 않기 위함이다.
 *
 * 카드에 보이는 메타데이터(제목·난이도·소요시간·키워드)는
 * operationCases.js가 단독으로 소유한다. 여기에는 steps만 둔다.
 *
 * 새 케이스를 열 때:
 *   1) cases/operation-NN.json 추가
 *   2) 아래 레지스트리에 등록
 *   3) operationCases.js의 status를 'available'로 변경
 */
export const caseContents = {
  'operation-01': operation01,
  'operation-02': operation02,
  'operation-03': operation03,
  'operation-04': operation04,
  'operation-05': operation05,
  'operation-06': operation06,
  'operation-07': operation07,
  'operation-08': operation08,
  'operation-09': operation09,
  'operation-10': operation10,
  'improve-01': improve01,
  'basic-01': basic01,
  'basic-02': basic02,
  'basic-03': basic03,
  'basic-04': basic04,
  'basic-05': basic05,
  'basic-06': basic06,
  'basic-07': basic07,
  'basic-08': basic08,
  'basic-09': basic09,
};

export function findCaseContent(caseId) {
  return caseContents[caseId] ?? null;
}
