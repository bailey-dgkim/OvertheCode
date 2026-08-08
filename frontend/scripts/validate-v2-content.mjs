#!/usr/bin/env node
/**
 * V2 커리큘럼 콘텐츠 검증기.
 *
 * JSON 문법뿐 아니라 Part, Chapter, 시스템 맵, 개념 사이의 참조가
 * 실제로 이어지는지 검사한다.
 *
 *   npm run validate:content
 */

import { readFile, readdir } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ACTIVITY_TYPES,
  CURRICULUM_SCHEMA_VERSION,
  LEARNING_STAGES,
} from '../src/content/v2/contentContract.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CONTENT_DIR = join(HERE, '..', 'src', 'content', 'v2');
const CHAPTER_STATUS = ['draft', 'available'];
const PART_KINDS = ['orientation', 'curriculum'];
const EXPECTED_CHAPTER_COUNTS = [5, 4, 5, 5, 5, 5, 5, 6, 6];
const REQUIRED_AVAILABLE_STAGES = [
  'orientation',
  'incident',
  'observe',
  'locate',
  'hypothesize',
  'experiment',
  'fix',
  'verify',
  'explain',
];

function isEmpty(value) {
  return value === undefined
    || value === null
    || (typeof value === 'string' && value.trim() === '')
    || (Array.isArray(value) && value.length === 0);
}

function requireFields(value, fields, where, fail) {
  fields.forEach((field) => {
    if (isEmpty(value?.[field])) {
      fail(where, "'" + field + "' 누락 또는 비어 있음");
    }
  });
}

function requireArray(value, field, where, fail, { allowEmpty = false } = {}) {
  if (!Array.isArray(value?.[field])) {
    fail(where, "'" + field + "'는 배열이어야 함");
    return;
  }

  if (!allowEmpty && value[field].length === 0) {
    fail(where, "'" + field + "'가 비어 있음");
  }
}

function validateUniqueIds(items, where, fail) {
  const seen = new Set();
  items.forEach((item, index) => {
    const itemWhere = where + '[' + index + ']';
    requireFields(item, ['id'], itemWhere, fail);
    if (!item?.id) return;
    if (seen.has(item.id)) fail(itemWhere, "id '" + item.id + "' 중복");
    seen.add(item.id);
  });
}

function validateUniqueValues(values, where, fail) {
  const seen = new Set();
  values.forEach((value) => {
    if (seen.has(value)) fail(where, "값 '" + value + "' 중복");
    seen.add(value);
  });
}

function validateSchemaVersion(document, where, fail) {
  if (document?.schemaVersion !== CURRICULUM_SCHEMA_VERSION) {
    fail(
      where,
      'schemaVersion은 ' + CURRICULUM_SCHEMA_VERSION + '이어야 함 (현재 '
        + (document?.schemaVersion ?? '없음') + ')',
    );
  }
}

function validateItemList(items, where, fail) {
  if (!Array.isArray(items) || items.length === 0) return;
  validateUniqueIds(items, where, fail);
  items.forEach((item, index) => {
    requireFields(item, ['id', 'text'], where + '[' + index + ']', fail);
  });
}

function validateChoiceActivity(activity, where, fail, multiple) {
  requireFields(
    activity,
    multiple
      ? ['question', 'choices', 'correctChoiceIds']
      : ['question', 'choices', 'correctChoiceId'],
    where,
    fail,
  );

  const choices = activity.choices ?? [];
  if (choices.length > 0 && choices.length < 2) {
    fail(where, '선택지가 ' + choices.length + '개 — 최소 2개 필요');
  }

  validateUniqueIds(choices, where + '.choices', fail);
  choices.forEach((choice, index) => {
    requireFields(choice, ['id', 'text', 'feedback'], where + '.choices[' + index + ']', fail);
  });

  const choiceIds = new Set(choices.map((choice) => choice.id));
  const correctIds = multiple ? activity.correctChoiceIds ?? [] : [activity.correctChoiceId];
  validateUniqueValues(correctIds.filter(Boolean), where + '.correctChoiceIds', fail);

  correctIds.filter(Boolean).forEach((correctId) => {
    if (!choiceIds.has(correctId)) {
      fail(where, "정답 '" + correctId + "'가 choices에 없음");
    }
  });
}

function validateActivity(activity, where, fail, mapNodeIds) {
  requireFields(activity, ['type'], where, fail);
  if (!activity?.type) return;

  if (!ACTIVITY_TYPES.includes(activity.type)) {
    fail(where, "알 수 없는 activity.type '" + activity.type + "'");
    return;
  }

  switch (activity.type) {
    case 'content':
      requireFields(activity, ['title', 'body'], where, fail);
      break;
    case 'evidence':
      requireFields(activity, ['title', 'evidenceType', 'content'], where, fail);
      break;
    case 'single-choice':
      validateChoiceActivity(activity, where, fail, false);
      break;
    case 'multi-choice':
      validateChoiceActivity(activity, where, fail, true);
      break;
    case 'map-select':
      requireFields(activity, ['question', 'correctNodeIds'], where, fail);
      validateUniqueValues(activity.correctNodeIds ?? [], where + '.correctNodeIds', fail);
      (activity.correctNodeIds ?? []).forEach((nodeId) => {
        if (!mapNodeIds.has(nodeId)) {
          fail(where, "존재하지 않는 시스템 맵 노드 '" + nodeId + "'가 정답에 있음");
        }
      });
      break;
    case 'sequence': {
      requireFields(activity, ['prompt', 'items', 'correctOrder'], where, fail);
      validateItemList(activity.items, where + '.items', fail);
      const itemIds = (activity.items ?? []).map((item) => item.id);
      const correctOrder = activity.correctOrder ?? [];
      validateUniqueValues(correctOrder, where + '.correctOrder', fail);
      if (
        itemIds.length !== correctOrder.length
        || itemIds.some((itemId) => !correctOrder.includes(itemId))
      ) {
        fail(where, 'correctOrder는 items의 모든 id를 한 번씩 포함해야 함');
      }
      break;
    }
    case 'diff-review':
      requireFields(activity, ['question', 'before', 'after'], where, fail);
      break;
    case 'checklist':
      requireFields(activity, ['prompt', 'items'], where, fail);
      validateItemList(activity.items, where + '.items', fail);
      break;
    case 'free-response':
      requireFields(activity, ['prompt', 'rubric'], where, fail);
      break;
    case 'completion':
      requireFields(activity, ['title', 'summary'], where, fail);
      break;
    default:
      break;
  }
}

function validateSteps(chapter, where, fail, mapNodeIds) {
  const steps = chapter.steps ?? [];
  if (!Array.isArray(steps)) {
    fail(where, "'steps'는 배열이어야 함");
    return;
  }

  if (chapter.status === 'available' && steps.length === 0) {
    fail(where, 'status가 available인데 steps가 비어 있음');
    return;
  }

  validateUniqueIds(steps, where + '.steps', fail);
  let lastStageIndex = -1;

  steps.forEach((step, index) => {
    const stepWhere = where + '.steps[' + index + ']';
    requireFields(step, ['id', 'stage', 'label', 'activity'], stepWhere, fail);

    if (step.stage && !LEARNING_STAGES.includes(step.stage)) {
      fail(stepWhere, "알 수 없는 stage '" + step.stage + "'");
    }

    const stageIndex = LEARNING_STAGES.indexOf(step.stage);
    if (stageIndex !== -1 && stageIndex < lastStageIndex) {
      fail(stepWhere, '학습 단계 순서가 앞으로 되돌아감');
    }
    if (stageIndex !== -1) lastStageIndex = stageIndex;

    validateActivity(step.activity, stepWhere + '.activity', fail, mapNodeIds);
  });

  if (steps.length > 0 && steps[0].stage !== 'orientation') {
    fail(where, '첫 단계는 orientation이어야 함');
  }

  const lastStage = steps.at(-1)?.stage;
  if (steps.length > 0 && !['explain', 'complete'].includes(lastStage)) {
    fail(where, '마지막 단계는 explain 또는 complete여야 함');
  }

  if (chapter.status === 'available') {
    const stages = new Set(steps.map((step) => step.stage));
    REQUIRED_AVAILABLE_STAGES.forEach((stage) => {
      if (!stages.has(stage)) fail(where, "available Chapter에 '" + stage + "' 단계가 없음");
    });
  }
}

/**
 * 파싱된 V2 문서의 구조와 참조 관계를 검사한다.
 * 테스트에서 일부 문서를 일부러 망가뜨려 검증기 자체도 확인할 수 있게 export한다.
 */
export function validateDocuments({
  partsDocument,
  systemMapDocument,
  conceptsDocument,
  chapters,
}) {
  const problems = [];
  const fail = (where, message) => problems.push(where + ' — ' + message);

  validateSchemaVersion(partsDocument, 'parts.json', fail);
  validateSchemaVersion(systemMapDocument, 'system-map.json', fail);
  validateSchemaVersion(conceptsDocument, 'concepts.json', fail);

  const parts = partsDocument?.parts ?? [];
  const groups = systemMapDocument?.groups ?? [];
  const nodes = systemMapDocument?.nodes ?? [];
  const edges = systemMapDocument?.edges ?? [];
  const concepts = conceptsDocument?.concepts ?? [];

  requireFields(partsDocument, ['parts'], 'parts.json', fail);
  if (parts.length !== 9) {
    fail('parts.json', 'Part가 ' + parts.length + '개 — 새 커리큘럼 기준 9개 필요');
  }
  validateUniqueIds(parts, 'parts.json.parts', fail);
  validateUniqueValues(parts.map((part) => part.order), 'parts.json.parts.order', fail);
  parts.forEach((part, index) => {
    const partWhere = 'parts.json.parts[' + index + ']';
    requireFields(
      part,
      [
        'id',
        'order',
        'kind',
        'title',
        'goal',
        'question',
        'realization',
        'scope',
        'representativeNodeIds',
        'existingCompetency',
        'outcome',
        'unitLabel',
      ],
      partWhere,
      fail,
    );
    if (part.kind && !PART_KINDS.includes(part.kind)) {
      fail(partWhere, 'kind는 ' + PART_KINDS.join(' 또는 ') + '만 가능');
    }
    requireArray(part, 'scope', partWhere, fail);
    requireArray(part, 'representativeNodeIds', partWhere, fail);

    if (part.memory !== undefined) {
      requireFields(part.memory, ['kind', 'title', 'copy', 'rule', 'items'], partWhere + '.memory', fail);
      requireArray(part.memory, 'items', partWhere + '.memory', fail);
    }
  });

  const expectedPartOrders = Array.from({ length: 9 }, (_, index) => index);
  expectedPartOrders.forEach((order) => {
    if (!parts.some((part) => part.order === order)) {
      fail('parts.json.parts.order', 'Part ' + order + '이 없음');
    }
  });
  const orientationParts = parts.filter((part) => part.kind === 'orientation');
  if (orientationParts.length !== 1 || orientationParts[0]?.order !== 0) {
    fail('parts.json.parts', 'Part 0 하나만 orientation이어야 함');
  }

  requireFields(systemMapDocument, ['groups', 'nodes', 'edges'], 'system-map.json', fail);
  validateUniqueIds(groups, 'system-map.json.groups', fail);
  validateUniqueValues(groups.map((group) => group.order), 'system-map.json.groups.order', fail);
  groups.forEach((group, index) => {
    requireFields(group, ['id', 'label', 'order'], 'system-map.json.groups[' + index + ']', fail);
  });

  const groupIds = new Set(groups.map((group) => group.id));
  validateUniqueIds(nodes, 'system-map.json.nodes', fail);
  nodes.forEach((node, index) => {
    const nodeWhere = 'system-map.json.nodes[' + index + ']';
    requireFields(node, ['id', 'groupId', 'label'], nodeWhere, fail);
    if (node.groupId && !groupIds.has(node.groupId)) {
      fail(nodeWhere, "존재하지 않는 groupId '" + node.groupId + "'");
    }
  });

  const mapNodeIds = new Set(nodes.map((node) => node.id));
  parts.forEach((part, index) => {
    (part.representativeNodeIds ?? []).forEach((nodeId) => {
      if (!mapNodeIds.has(nodeId)) {
        fail('parts.json.parts[' + index + ']', "존재하지 않는 대표 노드 '" + nodeId + "'");
      }
    });
  });

  validateUniqueIds(edges, 'system-map.json.edges', fail);
  edges.forEach((edge, index) => {
    const edgeWhere = 'system-map.json.edges[' + index + ']';
    requireFields(edge, ['id', 'from', 'to'], edgeWhere, fail);
    if (edge.from && !mapNodeIds.has(edge.from)) {
      fail(edgeWhere, "from이 존재하지 않는 노드 '" + edge.from + "'");
    }
    if (edge.to && !mapNodeIds.has(edge.to)) {
      fail(edgeWhere, "to가 존재하지 않는 노드 '" + edge.to + "'");
    }
    if (edge.from && edge.from === edge.to) {
      fail(edgeWhere, "연결선의 시작과 끝이 같음 '" + edge.from + "'");
    }
  });
  const mapEdgeIds = new Set(edges.map((edge) => edge.id));

  requireFields(conceptsDocument, ['concepts'], 'concepts.json', fail);
  validateUniqueIds(concepts, 'concepts.json.concepts', fail);
  concepts.forEach((concept, index) => {
    requireFields(
      concept,
      ['id', 'name', 'definition'],
      'concepts.json.concepts[' + index + ']',
      fail,
    );
  });

  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const partIds = new Set(parts.map((part) => part.id));
  const chapterDocuments = chapters.map((chapter) => chapter.document);
  if (chapterDocuments.length !== 46) {
    fail('chapters', 'Chapter가 ' + chapterDocuments.length + '개 — 새 커리큘럼 기준 46개 필요');
  }
  parts.forEach((part, index) => {
    const expectedCount = EXPECTED_CHAPTER_COUNTS[part.order];
    const actualCount = chapterDocuments.filter((chapter) => chapter?.partId === part.id).length;
    if (expectedCount !== undefined && actualCount !== expectedCount) {
      fail(
        'chapters',
        'Part ' + part.order + ' Chapter가 ' + actualCount + '개 — ' + expectedCount + '개 필요',
      );
    }
  });
  validateUniqueIds(chapterDocuments, 'chapters', fail);

  const chapterOrderKeys = [];
  chapters.forEach(({ fileName, document: chapter }) => {
    const where = 'chapters/' + fileName;
    validateSchemaVersion(chapter, where, fail);
    requireFields(
      chapter,
      [
        'id',
        'partId',
        'order',
        'status',
        'title',
        'description',
        'coreQuestion',
        'mission',
        'map',
        'outlineConcepts',
      ],
      where,
      fail,
    );
    if (!Object.hasOwn(chapter, 'steps')) {
      fail(where, "'steps' 누락");
    }

    requireArray(chapter, 'outlineConcepts', where, fail);
    requireArray(chapter, 'learningObjectives', where, fail, { allowEmpty: true });
    requireArray(chapter, 'conceptRefs', where, fail, { allowEmpty: true });

    if (chapter.status === 'available') {
      requireFields(
        chapter,
        ['estimatedMinutes', 'incident', 'learningObjectives', 'conceptRefs', 'completionPrompt'],
        where,
        fail,
      );
      requireArray(chapter, 'learningObjectives', where, fail);
      requireArray(chapter, 'conceptRefs', where, fail);
    }

    const expectedId = basename(fileName, '.json');
    if (chapter.id && chapter.id !== expectedId) {
      fail(where, "id '" + chapter.id + "'가 파일명 '" + expectedId + "'와 다름");
    }
    if (chapter.partId && !partIds.has(chapter.partId)) {
      fail(where, "존재하지 않는 partId '" + chapter.partId + "'");
    }
    if (chapter.status && !CHAPTER_STATUS.includes(chapter.status)) {
      fail(where, 'status는 ' + CHAPTER_STATUS.join(' 또는 ') + '만 가능');
    }
    if (
      typeof chapter.estimatedMinutes === 'number'
      && (chapter.estimatedMinutes < 30 || chapter.estimatedMinutes > 45)
    ) {
      fail(where, 'estimatedMinutes는 30~45분이어야 함');
    }
    if (chapter.partId && chapter.order !== undefined) {
      chapterOrderKeys.push(chapter.partId + ':' + chapter.order);
    }

    const map = chapter.map ?? {};
    requireArray(map, 'primaryNodeIds', where + '.map', fail);
    requireArray(map, 'relatedNodeIds', where + '.map', fail, { allowEmpty: true });
    requireArray(map, 'activeEdgeIds', where + '.map', fail, { allowEmpty: true });
    const chapterNodeIds = [...(map.primaryNodeIds ?? []), ...(map.relatedNodeIds ?? [])];
    validateUniqueValues(chapterNodeIds, where + '.map node ids', fail);
    chapterNodeIds.forEach((nodeId) => {
      if (!mapNodeIds.has(nodeId)) {
        fail(where + '.map', "존재하지 않는 시스템 맵 노드 '" + nodeId + "'");
      }
    });
    validateUniqueValues(map.activeEdgeIds ?? [], where + '.map.activeEdgeIds', fail);
    (map.activeEdgeIds ?? []).forEach((edgeId) => {
      if (!mapEdgeIds.has(edgeId)) {
        fail(where + '.map', "존재하지 않는 시스템 맵 연결선 '" + edgeId + "'");
      }
    });

    validateUniqueValues(chapter.conceptRefs ?? [], where + '.conceptRefs', fail);
    (chapter.conceptRefs ?? []).forEach((conceptId) => {
      if (!conceptIds.has(conceptId)) {
        fail(where, "존재하지 않는 개념 '" + conceptId + "'");
      }
    });

    validateSteps(chapter, where, fail, mapNodeIds);
  });

  validateUniqueValues(chapterOrderKeys, 'chapters partId/order', fail);
  return problems;
}

async function readJson(filePath, label, problems) {
  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch (error) {
    problems.push(label + ' — JSON 파싱 실패: ' + error.message);
    return null;
  }
}

/** V2 폴더의 모든 JSON을 읽는다. */
export async function loadContentDocuments(contentDir = DEFAULT_CONTENT_DIR) {
  const parseProblems = [];
  const chapterDir = join(contentDir, 'chapters');
  let chapterFiles = [];

  try {
    chapterFiles = (await readdir(chapterDir)).filter((file) => file.endsWith('.json')).sort();
  } catch (error) {
    parseProblems.push('chapters — 폴더를 읽을 수 없음: ' + error.message);
  }

  const results = await Promise.all([
    readJson(join(contentDir, 'parts.json'), 'parts.json', parseProblems),
    readJson(join(contentDir, 'system-map.json'), 'system-map.json', parseProblems),
    readJson(join(contentDir, 'concepts.json'), 'concepts.json', parseProblems),
    ...chapterFiles.map((fileName) => (
      readJson(join(chapterDir, fileName), 'chapters/' + fileName, parseProblems)
    )),
  ]);
  const [partsDocument, systemMapDocument, conceptsDocument, ...chapterDocuments] = results;

  return {
    parseProblems,
    documents: {
      partsDocument,
      systemMapDocument,
      conceptsDocument,
      chapters: chapterFiles.map((fileName, index) => ({
        fileName,
        document: chapterDocuments[index],
      })),
    },
  };
}

async function main() {
  const { parseProblems, documents } = await loadContentDocuments();
  const canValidate = !parseProblems.length
    && documents.partsDocument
    && documents.systemMapDocument
    && documents.conceptsDocument
    && documents.chapters.every((chapter) => chapter.document);
  const problems = canValidate
    ? [...parseProblems, ...validateDocuments(documents)]
    : parseProblems;

  const partCount = documents.partsDocument?.parts?.length ?? 0;
  const chapterCount = documents.chapters.filter((chapter) => chapter.document).length;
  const nodeCount = documents.systemMapDocument?.nodes?.length ?? 0;
  const conceptCount = documents.conceptsDocument?.concepts?.length ?? 0;

  console.log('V2 콘텐츠 검사');
  console.log('  Part ' + partCount + '개');
  console.log('  Chapter ' + chapterCount + '개');
  console.log('  시스템 맵 노드 ' + nodeCount + '개');
  console.log('  개념 ' + conceptCount + '개');

  if (problems.length) {
    console.error('\n문제 ' + problems.length + '건');
    problems.forEach((problem) => console.error('  ✗ ' + problem));
    process.exitCode = 1;
    return;
  }

  console.log('\n모두 통과');
}

const isDirectRun = process.argv[1]
  && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) main();
