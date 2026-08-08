import { Link, useParams } from 'react-router-dom';
import { curriculumRepository } from '../../content/v2';
import NotFoundScreen from './NotFoundScreen';

function ChapterCard({ chapter, unitLabel }) {
  const available = chapter.status === 'available';
  const duration = typeof chapter.estimatedMinutes === 'number'
    ? chapter.estimatedMinutes + '분'
    : '예상 시간 미정';
  const objectiveSummary = chapter.learningObjectives.length > 0
    ? chapter.learningObjectives.length + '개 학습 목표'
    : '학습 목표 정리 중';

  return (
    <Link className="cv2-chapter-card" to={'/chapters/' + chapter.id}>
      <div className="cv2-chapter-card__number">
        <span>{unitLabel}</span>
        <strong>{String(chapter.order).padStart(2, '0')}</strong>
      </div>

      <div className="cv2-chapter-card__body">
        <div className="cv2-chapter-card__title-row">
          <h2>{chapter.title}</h2>
          <span className={'cv2-status-badge' + (available ? ' cv2-status-badge--ready' : '')}>
            {available ? '학습 가능' : '내용 설계 중'}
          </span>
        </div>
        <p>{chapter.description}</p>
        <div className="cv2-chapter-card__meta">
          <span>{duration}</span>
          <span aria-hidden="true">·</span>
          <span>{objectiveSummary}</span>
        </div>
      </div>

      <span className="cv2-chapter-card__arrow" aria-hidden="true">→</span>
    </Link>
  );
}

function PartDetail() {
  const { partId } = useParams();
  const part = curriculumRepository.getPart(partId);

  if (!part) {
    return (
      <NotFoundScreen
        title="Part를 찾을 수 없습니다"
        description="커리큘럼 홈에서 존재하는 Part를 다시 선택해 주세요."
      />
    );
  }

  const chapters = curriculumRepository.listChapters(part.id);
  const systemMap = curriculumRepository.getSystemMap();
  const nodeById = new Map(systemMap.nodes.map((node) => [node.id, node]));
  const representativeNodes = part.representativeNodeIds
    .map((nodeId) => nodeById.get(nodeId))
    .filter(Boolean);
  const unitObject = part.unitLabel === '설명' ? '설명을' : part.unitLabel + '를';

  return (
    <div className="cv2-container cv2-page">
      <nav className="cv2-breadcrumb" aria-label="현재 위치">
        <Link to="/curriculum">커리큘럼</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Part {part.order}</span>
      </nav>

      <section className="cv2-part-hero" aria-labelledby="part-title">
        <div>
          <p className="cv2-eyebrow">Part {part.order}</p>
          <h1 id="part-title">{part.title}</h1>
          <p>{part.goal}</p>
        </div>

        <aside className="cv2-part-hero__map" aria-label="대표 시스템 영역">
          <span>대표 시스템 영역</span>
          <div>
            {representativeNodes.map((node) => (
              <span key={node.id} className="cv2-node-chip">{node.label}</span>
            ))}
          </div>
        </aside>
      </section>

      <section aria-labelledby="chapter-list-title">
        <div className="cv2-section-heading">
          <div>
            <p className="cv2-eyebrow">Contents</p>
            <h2 id="chapter-list-title">{chapters.length}개 {part.unitLabel}</h2>
          </div>
          <p>순서대로 살펴보되 언제든 원하는 {unitObject} 열 수 있습니다.</p>
        </div>

        {chapters.length > 0 ? (
          <div className="cv2-chapter-list">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} unitLabel={part.unitLabel} />
            ))}
          </div>
        ) : (
          <div className="cv2-empty-state">
            <strong>Chapter 내용을 설계하고 있습니다.</strong>
            <p>Part 구조는 열려 있으며 콘텐츠가 준비되는 순서대로 여기에 추가됩니다.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default PartDetail;
