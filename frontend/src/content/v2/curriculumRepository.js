import partsDocument from './parts.json';
import conceptsDocument from './concepts.json';
import { CURRICULUM_SCHEMA_VERSION } from './contentContract';

/**
 * chapters 폴더의 JSON을 자동으로 모은다.
 * 새 Chapter를 추가할 때 이 파일에 import나 id를 수동 등록할 필요가 없다.
 */
const chapterModules = import.meta.glob('./chapters/*.json', {
  eager: true,
  import: 'default',
});

const parts = [...partsDocument.parts].sort((a, b) => a.order - b.order);
const partOrderById = new Map(parts.map((part) => [part.id, part.order]));
const chapters = Object.values(chapterModules).sort((a, b) => {
  if (a.partId !== b.partId) {
    return (partOrderById.get(a.partId) ?? Number.MAX_SAFE_INTEGER)
      - (partOrderById.get(b.partId) ?? Number.MAX_SAFE_INTEGER);
  }

  return a.order - b.order;
});

function createIndex(items, label) {
  const index = new Map();

  items.forEach((item) => {
    if (index.has(item.id)) {
      throw new Error(`${label} id가 중복되었습니다: ${item.id}`);
    }
    index.set(item.id, item);
  });

  return index;
}

function assertSupportedVersion(document, label) {
  if (document.schemaVersion !== CURRICULUM_SCHEMA_VERSION) {
    throw new Error(
      `${label} schemaVersion ${document.schemaVersion}은 지원하지 않습니다. `
      + `현재 버전은 ${CURRICULUM_SCHEMA_VERSION}입니다.`,
    );
  }
}

assertSupportedVersion(partsDocument, 'parts.json');
assertSupportedVersion(conceptsDocument, 'concepts.json');
chapters.forEach((chapter) => assertSupportedVersion(chapter, `${chapter.id}.json`));

const partsById = createIndex(parts, 'Part');
const chaptersById = createIndex(chapters, 'Chapter');
const conceptsById = createIndex(conceptsDocument.concepts, 'Concept');

/**
 * 현재는 JSON을 읽지만 화면은 이 함수들만 사용한다.
 * 나중에 백엔드 API로 바꿔도 화면 컴포넌트의 호출 모양은 유지할 수 있다.
 */
export const curriculumRepository = Object.freeze({
  listParts: () => parts,
  getPart: (partId) => partsById.get(partId) ?? null,
  listChapters: (partId) => (
    partId ? chapters.filter((chapter) => chapter.partId === partId) : chapters
  ),
  getChapter: (chapterId) => chaptersById.get(chapterId) ?? null,
  listConcepts: () => conceptsDocument.concepts,
  getConcept: (conceptId) => conceptsById.get(conceptId) ?? null,
});
