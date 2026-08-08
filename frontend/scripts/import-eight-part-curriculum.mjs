#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(HERE, '..', 'src', 'content', 'v2');
const SOURCE_DIR = join(CONTENT_DIR, 'source');
const CHAPTER_DIR = join(CONTENT_DIR, 'chapters');
const SCHEMA_VERSION = 2;

const PART_CONFIG = {
  0: {
    id: 'workspace',
    kind: 'orientation',
    representativeNodeIds: ['project-folder', 'source-code', 'terminal'],
  },
  1: {
    id: 'frontend',
    kind: 'curriculum',
    representativeNodeIds: ['browser', 'frontend'],
  },
  2: {
    id: 'data',
    kind: 'curriculum',
    representativeNodeIds: ['database-primary', 'database-replica', 'repository'],
  },
  3: {
    id: 'application',
    kind: 'curriculum',
    representativeNodeIds: ['controller', 'service', 'repository'],
  },
  4: {
    id: 'runtime',
    kind: 'curriculum',
    representativeNodeIds: ['runtime', 'process', 'port'],
  },
  5: {
    id: 'delivery',
    kind: 'curriculum',
    representativeNodeIds: ['source-code', 'build', 'deployment'],
  },
  6: {
    id: 'network',
    kind: 'curriculum',
    representativeNodeIds: ['browser', 'dns', 'load-balancer'],
  },
  7: {
    id: 'scale',
    kind: 'curriculum',
    representativeNodeIds: ['load-balancer', 'redis', 'database-replica'],
  },
  8: {
    id: 'operations',
    kind: 'curriculum',
    representativeNodeIds: ['logs', 'metrics', 'backup'],
  },
};

const PILOT_CHAPTER_CONFIG = {
  0: [
    {
      id: 'source-files',
      map: {
        primaryNodeIds: ['source-code'],
        relatedNodeIds: ['project-folder', 'editor'],
        activeEdgeIds: ['project-folder-to-source', 'editor-to-source'],
      },
    },
    {
      id: 'project-structure',
      map: {
        primaryNodeIds: ['project-folder'],
        relatedNodeIds: ['source-code', 'editor', 'current-path'],
        activeEdgeIds: ['project-folder-to-source'],
      },
    },
    {
      id: 'paths',
      map: {
        primaryNodeIds: ['current-path'],
        relatedNodeIds: ['project-folder', 'terminal'],
        activeEdgeIds: ['current-path-to-terminal'],
      },
    },
    {
      id: 'terminal-basics',
      map: {
        primaryNodeIds: ['terminal'],
        relatedNodeIds: ['current-path', 'project-folder'],
        activeEdgeIds: ['current-path-to-terminal'],
      },
    },
    {
      id: 'source-and-process',
      map: {
        primaryNodeIds: ['source-code', 'process'],
        relatedNodeIds: ['terminal', 'runtime'],
        activeEdgeIds: ['terminal-to-process', 'runtime-to-process'],
      },
    },
  ],
  4: [
    {
      id: 'runtime-basics',
      map: {
        primaryNodeIds: ['source-code', 'build', 'runtime', 'process'],
        relatedNodeIds: [
          'environment-variable',
          'memory',
          'port',
          'container',
          'health-check',
        ],
        activeEdgeIds: [
          'source-to-build',
          'build-to-container',
          'container-to-runtime',
          'environment-to-runtime',
          'runtime-to-process',
          'process-to-port',
          'health-check-to-process',
        ],
      },
    },
    {
      id: 'process-resources',
      map: {
        primaryNodeIds: ['process', 'thread', 'memory'],
        relatedNodeIds: ['runtime'],
        activeEdgeIds: ['runtime-to-process', 'process-to-thread', 'process-to-memory'],
      },
    },
    {
      id: 'localhost-and-port',
      map: {
        primaryNodeIds: ['process', 'port'],
        relatedNodeIds: ['ec2'],
        activeEdgeIds: ['process-to-port'],
      },
    },
    {
      id: 'ec2-runtime',
      map: {
        primaryNodeIds: ['ec2', 'runtime'],
        relatedNodeIds: ['environment-variable'],
        activeEdgeIds: ['ec2-to-runtime', 'environment-to-runtime'],
      },
    },
    {
      id: 'environment-configuration',
      map: {
        primaryNodeIds: ['environment-variable'],
        relatedNodeIds: ['runtime', 'health-check', 'process'],
        activeEdgeIds: ['environment-to-runtime', 'health-check-to-process'],
      },
    },
  ],
};

const CONCEPT_ID_BY_NAME = {
  'Source Code': 'source-code',
  Build: 'build',
  Runtime: 'runtime',
  Process: 'process',
  Memory: 'memory',
  Port: 'port',
  'Environment Variable': 'environment-variable',
  Container: 'container',
  'Health Check': 'health-check',
};

function getArgument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] ?? null;
}

function decodeHtml(value) {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&amp;', '&');
}

function extractParts(html) {
  const decoded = decodeHtml(html);
  const marker = 'const parts = [';
  const start = decoded.indexOf(marker);
  const end = decoded.indexOf('let activePart', start);

  if (start === -1 || end === -1) {
    throw new Error('첨부 HTML에서 parts 배열을 찾지 못했습니다.');
  }

  const expression = decoded
    .slice(start + 'const parts = '.length, end)
    .trim()
    .replace(/;$/, '');
  const parts = vm.runInNewContext(expression, Object.create(null), { timeout: 1000 });

  if (!Array.isArray(parts) || parts.length !== 9) {
    throw new Error('원본 Part는 9개여야 합니다. 현재 ' + (parts?.length ?? 0) + '개입니다.');
  }

  return JSON.parse(JSON.stringify(parts));
}

function splitConcepts(value) {
  return value
    .split('·')
    .map((concept) => concept.trim())
    .filter(Boolean);
}

function validateSource(parts, nodeAliases) {
  const chapterCount = parts.reduce((total, part) => total + part.chapters.length, 0);
  if (chapterCount !== 46) {
    throw new Error('원본 Chapter는 46개여야 합니다. 현재 ' + chapterCount + '개입니다.');
  }

  const unmappedNodes = [];
  parts.forEach((part, partOrder) => {
    part.nodes.forEach((label) => {
      const mapped = nodeAliases.contextAliases?.[partOrder]?.[label]
        ?? nodeAliases.aliases?.[label];
      if (!mapped) unmappedNodes.push('Part ' + partOrder + ': ' + label);
    });
  });

  if (unmappedNodes.length > 0) {
    throw new Error('시스템 요소 별칭이 없습니다: ' + unmappedNodes.join(', '));
  }
}

function buildPart(sourcePart, order) {
  const config = PART_CONFIG[order];

  return {
    id: config.id,
    order,
    kind: config.kind,
    title: sourcePart.name,
    goal: sourcePart.outcome,
    question: sourcePart.question,
    realization: sourcePart.realization,
    scope: sourcePart.scope,
    representativeNodeIds: config.representativeNodeIds,
    existingCompetency: sourcePart.existing,
    outcome: sourcePart.outcome,
    unitLabel: sourcePart.unitLabel ?? 'Chapter',
    ...(sourcePart.secondaryLabel ? { secondaryLabel: sourcePart.secondaryLabel } : {}),
    ...(sourcePart.memory ? { memory: sourcePart.memory } : {}),
  };
}

function buildChapter(sourceChapter, partOrder, order, config) {
  const outlineConcepts = splitConcepts(sourceChapter.concepts);
  const conceptRefs = outlineConcepts
    .map((name) => CONCEPT_ID_BY_NAME[name])
    .filter(Boolean);
  const isRuntimeBasics = config.id === 'runtime-basics';

  return {
    schemaVersion: SCHEMA_VERSION,
    id: config.id,
    partId: PART_CONFIG[partOrder].id,
    order,
    status: 'draft',
    title: sourceChapter.title,
    description: sourceChapter.mission,
    estimatedMinutes: isRuntimeBasics ? 40 : null,
    coreQuestion: sourceChapter.question,
    mission: sourceChapter.mission,
    incident: isRuntimeBasics
      ? '터미널을 닫자 조금 전까지 접속되던 서비스가 사라졌습니다.'
      : null,
    map: config.map,
    learningObjectives: isRuntimeBasics
      ? [
        '소스 코드와 실행 중인 프로그램을 구분합니다.',
        '프로그램을 실행하는 데 필요한 환경과 설정을 찾습니다.',
        '프로세스, 메모리, 포트의 관계를 설명합니다.',
      ]
      : [],
    outlineConcepts,
    conceptRefs,
    steps: [],
    completionPrompt: isRuntimeBasics
      ? '이 서비스가 실행되기 위해 필요한 조건을 설명하세요.'
      : null,
  };
}

async function writeJson(filePath, value) {
  await writeFile(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

async function main() {
  const input = getArgument('--input');
  if (!input) {
    throw new Error('사용법: node scripts/import-eight-part-curriculum.mjs --input <첨부 HTML 경로>');
  }

  const sourceParts = extractParts(await readFile(resolve(input), 'utf8'));
  const nodeAliases = JSON.parse(
    await readFile(join(SOURCE_DIR, 'node-aliases.json'), 'utf8'),
  );
  validateSource(sourceParts, nodeAliases);
  await mkdir(SOURCE_DIR, { recursive: true });
  await mkdir(CHAPTER_DIR, { recursive: true });

  await writeJson(join(SOURCE_DIR, 'eight-part-outline.json'), {
    sourceVersion: 1,
    partCount: sourceParts.length,
    chapterCount: sourceParts.reduce((total, part) => total + part.chapters.length, 0),
    parts: sourceParts,
  });

  await writeJson(join(CONTENT_DIR, 'parts.json'), {
    schemaVersion: SCHEMA_VERSION,
    parts: sourceParts.map((part, order) => buildPart(part, order)),
  });

  for (const [partOrderText, chapterConfigs] of Object.entries(PILOT_CHAPTER_CONFIG)) {
    const partOrder = Number(partOrderText);
    const sourceChapters = sourceParts[partOrder].chapters;

    if (sourceChapters.length !== chapterConfigs.length) {
      throw new Error('Part ' + partOrder + ' Chapter 개수가 원본과 설정에서 다릅니다.');
    }

    for (let index = 0; index < chapterConfigs.length; index += 1) {
      const chapter = buildChapter(
        sourceChapters[index],
        partOrder,
        index + 1,
        chapterConfigs[index],
      );
      await writeJson(join(CHAPTER_DIR, chapter.id + '.json'), chapter);
    }
  }

  console.log('새 커리큘럼 시험 이관');
  console.log('  전체 Part 9개');
  console.log('  원본 Chapter 46개 보존');
  console.log('  시험 Chapter 10개 생성 (Part 0, Part 4)');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
