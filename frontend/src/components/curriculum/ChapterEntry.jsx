import { Link, useParams } from 'react-router-dom';
import { curriculumRepository } from '../../content/v2';
import NotFoundScreen from './NotFoundScreen';

function ChapterEntry() {
  const { chapterId } = useParams();
  const chapter = curriculumRepository.getChapter(chapterId);

  if (!chapter) {
    return (
      <NotFoundScreen
        title="Chapter를 찾을 수 없습니다"
        description="Part 화면에서 존재하는 Chapter를 다시 선택해 주세요."
      />
    );
  }

  const part = curriculumRepository.getPart(chapter.partId);
  const systemMap = curriculumRepository.getSystemMap();
  const nodeById = new Map(systemMap.nodes.map((node) => [node.id, node]));
  const primaryNodes = chapter.map.primaryNodeIds
    .map((nodeId) => nodeById.get(nodeId))
    .filter(Boolean);
  const relatedNodes = chapter.map.relatedNodeIds
    .map((nodeId) => nodeById.get(nodeId))
    .filter(Boolean);

  return (
    <div className="cv2-container cv2-page">
      <nav className="cv2-breadcrumb" aria-label="현재 위치">
        <Link to="/curriculum">커리큘럼</Link>
        <span aria-hidden="true">/</span>
        <Link to={'/parts/' + part.id}>Part {part.order}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Chapter {chapter.order}</span>
      </nav>

      <section className="cv2-entry" aria-labelledby="chapter-title">
        <div className="cv2-entry__heading">
          <div>
            <p className="cv2-eyebrow">
              Part {part.order} · Chapter {String(chapter.order).padStart(2, '0')}
            </p>
            <h1 id="chapter-title">{chapter.title}</h1>
            <p>{chapter.description}</p>
          </div>
          <span className="cv2-status-badge">내용 설계 중</span>
        </div>

        <blockquote className="cv2-question">
          <span>핵심 질문</span>
          <p>{chapter.coreQuestion}</p>
        </blockquote>

        <div className="cv2-incident">
          <span>대표 실패 상황</span>
          <p>{chapter.incident}</p>
        </div>

        <section className="cv2-entry__map-preview" aria-labelledby="map-preview-title">
          <div className="cv2-entry__map-heading">
            <div>
              <p className="cv2-eyebrow">System Map</p>
              <h2 id="map-preview-title">이번 Chapter의 위치</h2>
            </div>
            <span className="cv2-status-badge">맵 준비 중</span>
          </div>

          <div className="cv2-entry__node-group">
            <strong>주요 영역</strong>
            <div>
              {primaryNodes.map((node) => (
                <span key={node.id} className="cv2-node-chip cv2-node-chip--primary">
                  {node.label}
                </span>
              ))}
            </div>
          </div>

          <div className="cv2-entry__node-group">
            <strong>함께 볼 영역</strong>
            <div>
              {relatedNodes.map((node) => (
                <span key={node.id} className="cv2-node-chip">{node.label}</span>
              ))}
            </div>
          </div>

          <p className="cv2-entry__map-note">
            다음 단계에서 노드와 연결선을 직접 탐색할 수 있는 시스템 맵을 이 자리에 연결합니다.
          </p>
        </section>

        <div className="cv2-entry__actions">
          <button className="cv2-button cv2-button--primary" type="button" disabled>
            Chapter 시작하기 · 준비 중
          </button>
          <span>학습 단계가 준비되면 이 버튼이 열립니다.</span>
        </div>
      </section>
    </div>
  );
}

export default ChapterEntry;
