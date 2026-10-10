import assert from 'node:assert/strict';
import test from 'node:test';

import {
  loadContentDocuments,
  validateDocuments,
} from './validate-v2-content.mjs';

const loaded = await loadContentDocuments();

function freshDocuments() {
  assert.deepEqual(loaded.parseProblems, []);
  return structuredClone(loaded.documents);
}

test('현재 V2 콘텐츠는 검증을 통과한다', () => {
  assert.deepEqual(validateDocuments(freshDocuments()), []);
});

test('Part 0부터 Part 8까지 정확히 존재한다', () => {
  const documents = freshDocuments();
  assert.deepEqual(
    documents.partsDocument.parts.map((part) => part.order),
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
  );
});

test('47개 Chapter가 Part별 원본 개수대로 존재한다', () => {
  const documents = freshDocuments();
  const chapters = documents.chapters.map((chapter) => chapter.document);
  const chapterCounts = documents.partsDocument.parts.map((part) => (
    chapters.filter((chapter) => chapter.partId === part.id).length
  ));

  assert.equal(chapters.length, 47);
  assert.deepEqual(chapterCounts, [5, 5, 5, 5, 5, 5, 5, 6, 6]);
});

test('존재하지 않는 시스템 맵 노드를 잡는다', () => {
  const documents = freshDocuments();
  documents.chapters[0].document.map.primaryNodeIds.push('missing-node');
  const problems = validateDocuments(documents);
  assert.ok(problems.some((problem) => (
    problem.includes("존재하지 않는 시스템 맵 노드 'missing-node'")
  )));
});

test('중복 Part id를 잡는다', () => {
  const documents = freshDocuments();
  documents.partsDocument.parts[1].id = documents.partsDocument.parts[0].id;
  const problems = validateDocuments(documents);
  assert.ok(problems.some((problem) => problem.includes("id 'workspace' 중복")));
});

test('공개 Chapter에 학습 단계가 없으면 잡는다', () => {
  const documents = freshDocuments();
  documents.chapters[0].document.status = 'available';
  const problems = validateDocuments(documents);
  assert.ok(problems.some((problem) => (
    problem.includes('status가 available인데 steps가 비어 있음')
  )));
});

test('선택지에 없는 정답을 잡는다', () => {
  const documents = freshDocuments();
  documents.chapters[0].document.steps = [
    {
      id: 'broken-question',
      stage: 'orientation',
      label: '잘못된 문제',
      activity: {
        type: 'single-choice',
        question: '정답은 무엇인가요?',
        choices: [
          { id: 'a', text: 'A', feedback: 'A 피드백' },
          { id: 'b', text: 'B', feedback: 'B 피드백' },
        ],
        correctChoiceId: 'missing-choice',
      },
    },
    {
      id: 'finish',
      stage: 'explain',
      label: '정리',
      activity: {
        type: 'free-response',
        prompt: '설명하세요.',
        rubric: ['근거를 포함한다.'],
      },
    },
  ];
  const problems = validateDocuments(documents);
  assert.ok(problems.some((problem) => (
    problem.includes("정답 'missing-choice'가 choices에 없음")
  )));
});
