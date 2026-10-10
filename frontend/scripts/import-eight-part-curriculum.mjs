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

const CHAPTER_IDS = {
  0: [
    'source-files',
    'project-structure',
    'paths',
    'terminal-basics',
    'source-and-process',
  ],
  1: [
    'frontend-components',
    'frontend-state-events',
    'browser-and-server-state',
    'frontend-review',
    'frontend-api-call',
  ],
  2: [
    'persistent-data',
    'domain-data-model',
    'relational-integrity',
    'crud-and-sql',
    'schema-migration',
  ],
  3: [
    'api-contract',
    'application-layers',
    'server-validation',
    'transactions',
    'idempotency',
  ],
  4: [
    'runtime-basics',
    'process-resources',
    'localhost-and-port',
    'ec2-runtime',
    'environment-configuration',
  ],
  5: [
    'git-collaboration',
    'build-artifacts',
    'continuous-integration',
    'deployment-strategies',
    'migration-deployment-order',
  ],
  6: [
    'dns-basics',
    'ip-port-connections',
    'https-tls',
    'reverse-proxy-load-balancer',
    'network-access-control',
  ],
  7: [
    'performance-signals',
    'horizontal-scaling',
    'database-performance',
    'caching',
    'async-queue-workers',
    'distributed-consistency',
  ],
  8: [
    'observability',
    'incident-response',
    'external-system-failures',
    'resource-exhaustion',
    'auth-and-security',
    'backup-and-recovery',
  ],
};

const CURATED_CHAPTER_CONFIG = {
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

const CONCEPT_NODE_ALIASES = {
  HTML: 'dom',
  CSS: 'dom',
  JavaScript: 'frontend',
  React: 'component',
  Event: 'frontend-state',
  Rendering: 'dom',
  Form: 'frontend-state',
  'Event Handler': 'component',
  'Memory State': 'frontend-state',
  'Local Storage': 'browser',
  Cookie: 'browser',
  'Server State': 'http-api',
  Loading: 'component',
  Accessibility: 'dom',
  Persistence: 'database-primary',
  Database: 'database-primary',
  Record: 'table',
  'Data Lifecycle': 'database-primary',
  'Domain Model': 'entity',
  Attribute: 'entity',
  Relationship: 'entity',
  Cardinality: 'entity',
  Unique: 'database-index',
  'Not Null': 'table',
  Integrity: 'table',
  CRUD: 'database-primary',
  SQL: 'database-primary',
  SELECT: 'database-primary',
  INSERT: 'database-primary',
  UPDATE: 'database-primary',
  DELETE: 'database-primary',
  'Schema Migration': 'table',
  Nullability: 'table',
  API: 'http-api',
  'HTTP Method': 'http-api',
  URL: 'http-api',
  Header: 'http-api',
  Body: 'dto',
  JSON: 'dto',
  Validation: 'service',
  'Business Rule': 'service',
  'Trust Boundary': 'authentication',
  Invariant: 'service',
  ACID: 'transaction',
  Commit: 'transaction',
  Rollback: 'transaction',
  Atomicity: 'transaction',
  Idempotency: 'service',
  'Race Condition': 'process',
  'Unique Constraint': 'database-index',
  Git: 'source-repository',
  Branch: 'source-repository',
  Diff: 'source-repository',
  Merge: 'source-repository',
  'Pull Request': 'source-repository',
  Dependency: 'build',
  'Package Manager': 'build',
  'Lock File': 'build',
  Version: 'artifact',
  CI: 'ci-cd',
  'Automated Test': 'test',
  Lint: 'test',
  'Type Check': 'test',
  'Static Analysis': 'test',
  Rolling: 'deployment',
  'Blue-Green': 'deployment',
  Canary: 'deployment',
  'Feature Flag': 'deployment',
  Domain: 'dns',
  Resolver: 'dns',
  TTL: 'dns',
  IP: 'port',
  TCP: 'port',
  Socket: 'port',
  Connection: 'port',
  HTTP: 'http-api',
  HTTPS: 'tls',
  Certificate: 'tls',
  'Encryption in Transit': 'tls',
  'Reverse Proxy': 'load-balancer',
  Routing: 'load-balancer',
  CORS: 'firewall',
  'Security Group': 'firewall',
  'Horizontal Scaling': 'application-instance',
  Stateless: 'application-instance',
  'Shared Session': 'redis',
  'Query Plan': 'database-index',
  'N+1': 'database-primary',
  'Connection Pool': 'database-primary',
  Pagination: 'database-primary',
  'Cache Hit': 'redis',
  'Cache Aside': 'redis',
  Invalidation: 'redis',
  Async: 'message-queue',
  Producer: 'message-queue',
  Consumer: 'worker',
  DLQ: 'message-queue',
  Backpressure: 'message-queue',
  'Structured Log': 'logs',
  Metric: 'metrics',
  Trace: 'traces',
  'Correlation ID': 'traces',
  SLO: 'metrics',
  Incident: 'runbook',
  Triage: 'runbook',
  Mitigation: 'runbook',
  Recovery: 'restore',
  'Memory Leak': 'memory',
  'Thread Pool': 'thread',
  Saturation: 'metrics',
  Secret: 'environment-variable',
  Audit: 'logs',
  Restore: 'restore',
  Failover: 'database-replica',
  RTO: 'restore',
  RPO: 'backup',
  Postmortem: 'runbook',
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

function unique(values) {
  return [...new Set(values)];
}

function resolveSourceNode(label, partOrder, nodeAliases) {
  return nodeAliases.contextAliases?.[partOrder]?.[label]
    ?? nodeAliases.aliases?.[label]
    ?? null;
}

function validateSource(parts, nodeAliases, mapNodeIds) {
  const chapterCount = parts.reduce((total, part) => total + part.chapters.length, 0);
  if (chapterCount !== 47) {
    throw new Error('원본 Chapter는 47개여야 합니다. 현재 ' + chapterCount + '개입니다.');
  }

  const unmappedNodes = [];
  const missingMapNodes = [];
  const chapterIds = [];
  parts.forEach((part, partOrder) => {
    const ids = CHAPTER_IDS[partOrder] ?? [];
    if (part.chapters.length !== ids.length) {
      throw new Error(
        'Part ' + partOrder + ' Chapter 개수가 원본과 id 설정에서 다릅니다.',
      );
    }
    chapterIds.push(...ids);

    part.nodes.forEach((label) => {
      const mapped = resolveSourceNode(label, partOrder, nodeAliases);
      if (!mapped) unmappedNodes.push('Part ' + partOrder + ': ' + label);
      else if (!mapNodeIds.has(mapped)) {
        missingMapNodes.push('Part ' + partOrder + ': ' + label + ' -> ' + mapped);
      }
    });
  });

  if (unique(chapterIds).length !== 47) {
    throw new Error('Chapter id는 중복 없이 47개여야 합니다.');
  }
  if (unmappedNodes.length > 0) {
    throw new Error('시스템 요소 별칭이 없습니다: ' + unmappedNodes.join(', '));
  }
  if (missingMapNodes.length > 0) {
    throw new Error('시스템 지도에 없는 요소로 연결됩니다: ' + missingMapNodes.join(', '));
  }
}

function buildAutomaticMap({
  sourcePart,
  sourceChapter,
  partOrder,
  systemMap,
  nodeAliases,
}) {
  const mapNodeIds = new Set(systemMap.nodes.map((node) => node.id));
  const nodeByLabel = new Map(
    systemMap.nodes.map((node) => [node.label.toLowerCase(), node.id]),
  );
  const conceptNodeIds = splitConcepts(sourceChapter.concepts)
    .map((name) => (
      CONCEPT_NODE_ALIASES[name]
      ?? resolveSourceNode(name, partOrder, nodeAliases)
      ?? nodeByLabel.get(name.toLowerCase())
    ))
    .filter((nodeId) => mapNodeIds.has(nodeId));
  const partNodeIds = sourcePart.nodes
    .map((label) => resolveSourceNode(label, partOrder, nodeAliases))
    .filter((nodeId) => mapNodeIds.has(nodeId));
  const primaryNodeIds = unique(conceptNodeIds).slice(0, 4);

  if (primaryNodeIds.length === 0) {
    primaryNodeIds.push(...PART_CONFIG[partOrder].representativeNodeIds.slice(0, 3));
  }

  const relatedNodeIds = unique([
    ...partNodeIds,
    ...PART_CONFIG[partOrder].representativeNodeIds,
  ])
    .filter((nodeId) => !primaryNodeIds.includes(nodeId))
    .slice(0, 7);
  const highlightedNodeIds = new Set([...primaryNodeIds, ...relatedNodeIds]);
  const activeEdgeIds = systemMap.edges
    .filter((edge) => (
      highlightedNodeIds.has(edge.from)
      && highlightedNodeIds.has(edge.to)
      && (primaryNodeIds.includes(edge.from) || primaryNodeIds.includes(edge.to))
    ))
    .slice(0, 8)
    .map((edge) => edge.id);

  return {
    primaryNodeIds,
    relatedNodeIds,
    activeEdgeIds,
  };
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
  const conceptRefs = unique(outlineConcepts
    .map((name) => CONCEPT_ID_BY_NAME[name])
    .filter(Boolean));
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
  await mkdir(SOURCE_DIR, { recursive: true });
  await mkdir(CHAPTER_DIR, { recursive: true });

  let sourceParts;
  if (input) {
    sourceParts = extractParts(await readFile(resolve(input), 'utf8'));
    await writeJson(join(SOURCE_DIR, 'eight-part-outline.json'), {
      sourceVersion: 1,
      partCount: sourceParts.length,
      chapterCount: sourceParts.reduce((total, part) => total + part.chapters.length, 0),
      parts: sourceParts,
    });
  } else {
    const preservedSource = JSON.parse(
      await readFile(join(SOURCE_DIR, 'eight-part-outline.json'), 'utf8'),
    );
    sourceParts = preservedSource.parts;
  }

  const nodeAliases = JSON.parse(
    await readFile(join(SOURCE_DIR, 'node-aliases.json'), 'utf8'),
  );
  const systemMap = JSON.parse(
    await readFile(join(CONTENT_DIR, 'system-map.json'), 'utf8'),
  );
  validateSource(sourceParts, nodeAliases, new Set(systemMap.nodes.map((node) => node.id)));

  await writeJson(join(CONTENT_DIR, 'parts.json'), {
    schemaVersion: SCHEMA_VERSION,
    parts: sourceParts.map((part, order) => buildPart(part, order)),
  });

  for (let partOrder = 0; partOrder < sourceParts.length; partOrder += 1) {
    const sourcePart = sourceParts[partOrder];
    const chapterIds = CHAPTER_IDS[partOrder];
    const curatedConfigs = CURATED_CHAPTER_CONFIG[partOrder] ?? [];

    for (let index = 0; index < sourcePart.chapters.length; index += 1) {
      const curatedConfig = curatedConfigs[index];
      if (curatedConfig && curatedConfig.id !== chapterIds[index]) {
        throw new Error(
          'Part ' + partOrder + ' Chapter ' + (index + 1) + ' id 설정이 서로 다릅니다.',
        );
      }
      const chapterConfig = {
        id: chapterIds[index],
        map: curatedConfig?.map ?? buildAutomaticMap({
          sourcePart,
          sourceChapter: sourcePart.chapters[index],
          partOrder,
          systemMap,
          nodeAliases,
        }),
      };
      const chapter = buildChapter(
        sourcePart.chapters[index],
        partOrder,
        index + 1,
        chapterConfig,
      );
      await writeJson(join(CHAPTER_DIR, chapter.id + '.json'), chapter);
    }
  }

  console.log('새 커리큘럼 전체 이관');
  console.log('  전체 Part 9개');
  console.log('  Chapter 47개 생성');
  console.log('  내용 설계 중 47개');
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
