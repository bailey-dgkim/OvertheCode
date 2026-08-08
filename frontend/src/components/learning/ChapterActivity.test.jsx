import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ChapterActivity from './ChapterActivity';
import {
  getMapCandidateIds,
  isSequenceCorrect,
  sameIdSet,
} from './chapterActivityUtils';

const systemMap = {
  nodes: [
    { id: 'source-code', label: 'Source Code' },
    { id: 'runtime', label: 'Runtime' },
    { id: 'process', label: 'Process' },
  ],
};

const chapterMap = {
  primaryNodeIds: ['source-code', 'runtime'],
  relatedNodeIds: ['process'],
};

function renderActivity(type, activity) {
  return renderToStaticMarkup(
    <ChapterActivity
      chapterMap={chapterMap}
      isLastStep={false}
      onComplete={() => {}}
      step={{
        id: `step-${type}`,
        stage: 'observe',
        label: type,
        activity: { type, ...activity },
      }}
      systemMap={systemMap}
    />,
  );
}

describe('V2 Chapter 활동 렌더러', () => {
  it.each([
    ['content', { title: '실행 조건', body: '코드만으로는 실행되지 않습니다.' }, '실행 조건'],
    ['evidence', { title: '프로세스 목록', evidenceType: 'terminal', content: 'node server.js' }, 'node server.js'],
    ['single-choice', {
      question: '무엇을 확인할까요?',
      choices: [
        { id: 'a', text: '프로세스', feedback: '실행 여부를 알 수 있습니다.' },
        { id: 'b', text: '글자색', feedback: '관련이 없습니다.' },
      ],
      correctChoiceId: 'a',
    }, '무엇을 확인할까요?'],
    ['multi-choice', {
      question: '필요한 조건을 고르세요.',
      choices: [
        { id: 'a', text: 'Runtime', feedback: '필요합니다.' },
        { id: 'b', text: 'Port', feedback: '필요합니다.' },
      ],
      correctChoiceIds: ['a', 'b'],
    }, '필요한 조건을 고르세요.'],
    ['map-select', { question: '문제 위치를 고르세요.', correctNodeIds: ['runtime'] }, 'Source Code'],
    ['sequence', {
      prompt: '실행 순서를 맞추세요.',
      items: [
        { id: 'source', text: '소스 코드' },
        { id: 'build', text: '빌드' },
      ],
      correctOrder: ['source', 'build'],
    }, '실행 순서를 맞추세요.'],
    ['diff-review', { question: '변경을 검토하세요.', before: 'PORT=3000', after: 'PORT=8080' }, 'PORT=8080'],
    ['checklist', {
      prompt: '검증 항목을 확인하세요.',
      items: [{ id: 'log', text: '시작 로그 확인' }],
    }, '시작 로그 확인'],
    ['free-response', { prompt: '원인을 설명하세요.', rubric: ['원인과 근거가 연결되는가?'] }, '나의 설명'],
    ['completion', { title: '학습 완료', summary: '실행 조건을 설명할 수 있습니다.' }, '학습 완료'],
  ])('%s 활동을 공통 화면으로 렌더링한다', (type, activity, expectedText) => {
    expect(renderActivity(type, activity)).toContain(expectedText);
  });

  it('복수 선택 정답은 순서와 관계없이 비교한다', () => {
    expect(sameIdSet(['runtime', 'process'], ['process', 'runtime'])).toBe(true);
    expect(sameIdSet(['runtime'], ['runtime', 'process'])).toBe(false);
  });

  it('순서 활동은 현재 배열의 순서를 정확히 비교한다', () => {
    const items = [{ id: 'source' }, { id: 'build' }];

    expect(isSequenceCorrect(items, ['source', 'build'])).toBe(true);
    expect(isSequenceCorrect(items, ['build', 'source'])).toBe(false);
  });

  it('지도 선택 후보는 Chapter 영역과 정답 노드를 중복 없이 합친다', () => {
    expect(getMapCandidateIds(
      { correctNodeIds: ['runtime', 'process'] },
      chapterMap,
    )).toEqual(['source-code', 'runtime', 'process']);
  });
});
