#!/usr/bin/env node
/**
 * 케이스 콘텐츠 검증기.
 *
 * 콘텐츠가 화면을 깨뜨리는 대부분의 원인은 오타나 필드 누락이다.
 * 그런 건 브라우저를 띄워 9단계를 눌러보는 것보다 여기서 잡는 편이 훨씬 싸다.
 *
 *   npm run validate:cases
 */

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

import { concepts } from '../src/data/concepts.js';
import { operationCases } from '../src/data/operationCases.js';
import { improveCases } from '../src/data/improveCases.js';
import { basicCases } from '../src/data/basicCases.js';

/** 모든 트랙의 카드 메타. 콘텐츠 파일과 카드가 짝이 맞는지 검사하는 데 쓴다. */
const allCards = [...operationCases, ...improveCases, ...basicCases];

const HERE = dirname(fileURLToPath(import.meta.url));
const CASES_DIR = join(HERE, '..', 'src', 'data', 'cases');

/** CasePlayer의 렌더러 레지스트리와 일치해야 한다. */
const STEP_TYPES = [
  'mission',
  'quiz',
  'solution',
  'mapping',
  'concepts',
  'complete',
  'locate-file',
  'locate-code',
  'structure',
  'translate',
  'call-stack-viz',
];
const LAYERS = ['frontend', 'backend', 'database', 'operation'];

const conceptIds = new Set(concepts.map((c) => c.id));

const problems = [];

function fail(where, message) {
  problems.push(`${where} — ${message}`);
}

function requireFields(obj, fields, where) {
  fields.forEach((field) => {
    const value = obj?.[field];
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0);

    if (empty) fail(where, `'${field}' 누락 또는 비어 있음`);
  });
}

function validateQuiz(step, where) {
  requireFields(step, ['question', 'choices', 'correctAnswer'], where);
  requireFields(step.correctFeedback ?? {}, ['title', 'description'], `${where}.correctFeedback`);
  requireFields(
    step.incorrectFeedback ?? {},
    ['title', 'description'],
    `${where}.incorrectFeedback`,
  );

  const choices = step.choices ?? [];
  if (choices.length < 2) fail(where, `선택지가 ${choices.length}개 — 최소 2개 필요`);

  const ids = choices.map((c) => c.id);
  if (new Set(ids).size !== ids.length) fail(where, `선택지 id 중복: ${ids.join(', ')}`);

  choices.forEach((choice, i) => {
    requireFields(choice, ['id', 'text'], `${where}.choices[${i}]`);
  });

  // 가장 흔하고 가장 치명적인 실수: 정답이 선택지에 없으면 영원히 다음으로 못 넘어간다.
  if (step.correctAnswer && !ids.includes(step.correctAnswer)) {
    fail(where, `correctAnswer '${step.correctAnswer}'가 선택지에 없음 (있는 id: ${ids.join(', ')})`);
  }
}

function validateStep(step, index, where) {
  requireFields(step, ['id', 'type', 'label'], where);

  if (step.type && !STEP_TYPES.includes(step.type)) {
    fail(where, `알 수 없는 type '${step.type}' — 가능: ${STEP_TYPES.join(', ')}`);
  }

  switch (step.type) {
    case 'mission':
      requireFields(step, ['mission', 'problem', 'question', 'actionLabel'], where);
      if (index !== 0) fail(where, `mission 스텝은 첫 번째여야 함 (현재 ${index + 1}번째)`);
      break;

    case 'quiz':
      validateQuiz(step, where);
      break;

    case 'solution': {
      requireFields(step, ['title', 'flow', 'summary'], where);
      (step.flow ?? []).forEach((item, i) => {
        const at = `${where}.flow[${i}]`;
        requireFields(item, ['layer', 'layerLabel', 'action', 'solves', 'keywords'], at);
        if (item.layer && !LAYERS.includes(item.layer)) {
          fail(at, `알 수 없는 layer '${item.layer}' — 가능: ${LAYERS.join(', ')}`);
        }
      });
      break;
    }

    case 'mapping': {
      requireFields(step, ['title', 'mappings'], where);
      (step.mappings ?? []).forEach((item, i) => {
        const at = `${where}.mappings[${i}]`;
        requireFields(item, ['action', 'keywords', 'solves', 'layer', 'layerLabel', 'why'], at);
        if (item.layer && !LAYERS.includes(item.layer)) {
          fail(at, `알 수 없는 layer '${item.layer}' — 가능: ${LAYERS.join(', ')}`);
        }
      });
      break;
    }

    case 'concepts': {
      requireFields(step, ['title', 'conceptRefs'], where);
      (step.conceptRefs ?? []).forEach((ref, i) => {
        const at = `${where}.conceptRefs[${i}]`;
        requireFields(ref, ['id', 'usedAt'], at);
        // 사전에 없는 id를 참조하면 개념 복습 화면에서 조용히 사라진다.
        if (ref.id && !conceptIds.has(ref.id)) {
          fail(at, `concepts.js에 없는 개념 id '${ref.id}'`);
        }
      });
      break;
    }

    case 'complete':
      requireFields(step, ['title', 'learnedConcepts', 'badge'], where);
      break;

    case 'locate-file': {
      requireFields(step, ['question', 'correctPath', 'files'], where);
      const paths = (step.files ?? []).map((f) => f.path);

      (step.files ?? []).forEach((file, i) => {
        const at = `${where}.files[${i}]`;
        requireFields(file, ['path', 'layer', 'role'], at);
        if (file.layer && !LAYERS.includes(file.layer)) {
          fail(at, `알 수 없는 layer '${file.layer}' — 가능: ${LAYERS.join(', ')}`);
        }
        // 정답이 아닌 파일은 왜 아닌지 알려줄 피드백이 있어야 한다.
        if (file.path !== step.correctPath && !file.feedback) {
          fail(at, `오답 파일 '${file.path}'에 feedback이 없음`);
        }
      });

      // 클릭할 정답 파일이 목록에 실제로 있어야 한다.
      if (step.correctPath && !paths.includes(step.correctPath)) {
        fail(where, `correctPath '${step.correctPath}'가 files에 없음`);
      }
      break;
    }

    case 'structure': {
      requireFields(step, ['name', 'shape', 'whenToUse', 'complexity'], where);
      (step.complexity ?? []).forEach((item, i) => {
        requireFields(item, ['op', 'time'], `${where}.complexity[${i}]`);
      });
      break;
    }

    case 'translate': {
      requireFields(step, ['lines'], where);
      (step.lines ?? []).forEach((line, i) => {
        requireFields(line, ['code', 'ko'], `${where}.lines[${i}]`);
      });
      break;
    }

    case 'call-stack-viz': {
      requireFields(step, ['title', 'frames'], where);
      (step.frames ?? []).forEach((frame, i) => {
        requireFields(frame, ['label'], `${where}.frames[${i}]`);
      });
      break;
    }

    case 'locate-code': {
      requireFields(step, ['question', 'fileName', 'lines', 'gaps'], where);
      const lineCount = (step.lines ?? []).length;
      const correctGaps = (step.gaps ?? []).filter((g) => g.correct);

      // 정답 자리가 정확히 하나여야 판정이 성립한다.
      if (correctGaps.length !== 1) {
        fail(where, `correct:true 인 gap이 ${correctGaps.length}개 — 정확히 1개여야 함`);
      }

      (step.gaps ?? []).forEach((gap, i) => {
        const at = `${where}.gaps[${i}]`;
        requireFields(gap, ['id', 'feedback'], at);
        // afterLine 은 0(첫 줄 앞)부터 마지막 줄까지 유효하다.
        if (typeof gap.afterLine !== 'number' || gap.afterLine < 0 || gap.afterLine > lineCount) {
          fail(at, `afterLine ${gap.afterLine}이 범위를 벗어남 (0~${lineCount})`);
        }
      });
      break;
    }

    default:
      break;
  }
}

function validateCase(content, fileName) {
  const where = fileName;

  requireFields(content, ['id', 'steps'], where);

  const expectedId = basename(fileName, '.json');
  if (content.id && content.id !== expectedId) {
    fail(where, `id '${content.id}'가 파일명 '${expectedId}'와 다름`);
  }

  const steps = content.steps ?? [];
  const stepIds = steps.map((s) => s.id);
  if (new Set(stepIds).size !== stepIds.length) {
    fail(where, `스텝 id 중복: ${stepIds.join(', ')}`);
  }

  steps.forEach((step, i) => {
    validateStep(step, i, `${where} › ${step.id ?? `steps[${i}]`}`);
  });

  if (steps.length && steps.at(-1).type !== 'complete') {
    fail(where, `마지막 스텝은 type 'complete'여야 함 (현재 '${steps.at(-1).type}')`);
  }

  return { id: content.id, stepCount: steps.length };
}

async function main() {
  let files = [];
  try {
    files = (await readdir(CASES_DIR)).filter((f) => f.endsWith('.json')).sort();
  } catch {
    console.error(`케이스 디렉터리를 찾을 수 없습니다: ${CASES_DIR}`);
    process.exit(1);
  }

  const summaries = [];

  for (const file of files) {
    let content;
    try {
      content = JSON.parse(await readFile(join(CASES_DIR, file), 'utf8'));
    } catch (error) {
      fail(file, `JSON 파싱 실패 — ${error.message}`);
      continue;
    }
    summaries.push(validateCase(content, file));
  }

  // 카드 목록과 실제 콘텐츠가 어긋나면 눌렀을 때 빈 화면이 뜬다.
  const contentIds = new Set(summaries.map((s) => s.id));
  const cardIds = new Set(allCards.map((item) => item.id));

  summaries.forEach((s) => {
    if (s.id && !cardIds.has(s.id)) {
      fail(`${s.id}.json`, '카드 메타(operationCases/improveCases)에 없어 목록에 노출되지 않음');
    }
  });

  allCards.forEach((item) => {
    if (item.status === 'available' && !contentIds.has(item.id)) {
      fail('카드 메타', `'${item.id}'가 available인데 콘텐츠 파일이 없음`);
    }
    if (item.status === 'comingSoon' && contentIds.has(item.id)) {
      fail(
        '카드 메타',
        `'${item.id}' 콘텐츠는 있는데 status가 comingSoon — 열려면 available로 바꾸세요`,
      );
    }
  });

  console.log(`케이스 ${summaries.length}개 검사`);
  summaries.forEach((s) => console.log(`  ${s.id} · ${s.stepCount}단계`));

  if (problems.length) {
    console.error(`\n문제 ${problems.length}건`);
    problems.forEach((p) => console.error(`  ✗ ${p}`));
    process.exit(1);
  }

  console.log('\n모두 통과');
}

main();
