import { Link, useParams } from 'react-router-dom';
import { curriculumRepository } from '../../content/v2';
import NotFoundScreen from './NotFoundScreen';
import SystemMap from './SystemMap';

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
  const canStart = chapter.status === 'available' && chapter.steps.length > 0;
  const contextLabel = chapter.incident ? '대표 실패 상황' : '실습 미션';
  const contextText = chapter.incident ?? chapter.mission;

  return (
    <div className="cv2-container cv2-page">
      <nav className="cv2-breadcrumb" aria-label="현재 위치">
        <Link to="/curriculum">커리큘럼</Link>
        <span aria-hidden="true">/</span>
        <Link to={'/parts/' + part.id}>Part {part.order}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{part.unitLabel} {chapter.order}</span>
      </nav>

      <section className="cv2-entry" aria-labelledby="chapter-title">
        <div className="cv2-entry__heading">
          <div>
            <p className="cv2-eyebrow">
              Part {part.order} · {part.unitLabel} {String(chapter.order).padStart(2, '0')}
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
          <span>{contextLabel}</span>
          <p>{contextText}</p>
        </div>

        <section className="cv2-entry__map-preview" aria-labelledby="map-preview-title">
          <div className="cv2-entry__map-heading">
            <div>
              <p className="cv2-eyebrow">System Map</p>
              <h2 id="map-preview-title">이번 Chapter의 위치</h2>
              <p>전체 시스템 안에서 지금 배울 요소와 연결 흐름을 먼저 살펴보세요.</p>
            </div>
            <span className="cv2-status-badge cv2-status-badge--ready">Chapter 영역 강조</span>
          </div>
          <SystemMap key={chapter.id} systemMap={systemMap} chapterMap={chapter.map} />
        </section>

        <div className="cv2-entry__actions">
          {canStart ? (
            <Link className="cv2-button cv2-button--primary" to={`/chapters/${chapter.id}/learn`}>
              Chapter 시작하기
            </Link>
          ) : (
            <button className="cv2-button cv2-button--primary" type="button" disabled>
              Chapter 시작하기 · 준비 중
            </button>
          )}
          <span>
            {canStart
              ? `${chapter.steps.length}개 학습 단계를 시작합니다.`
              : '학습 내용이 준비되면 이 버튼이 자동으로 열립니다.'}
          </span>
        </div>
      </section>
    </div>
  );
}

export default ChapterEntry;
