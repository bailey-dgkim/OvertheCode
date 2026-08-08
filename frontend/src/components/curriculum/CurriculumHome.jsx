import { Link } from 'react-router-dom';
import { curriculumRepository } from '../../content/v2';

function formatDuration(chapters) {
  if (chapters.length === 0) return '콘텐츠 준비 중';

  const durations = chapters
    .map((chapter) => chapter.estimatedMinutes)
    .filter((minutes) => typeof minutes === 'number');
  if (durations.length !== chapters.length) return '예상 시간 정리 중';

  const minutes = durations.reduce((total, duration) => total + duration, 0);
  if (minutes < 60) return minutes + '분';

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? hours + '시간 ' + remainder + '분' : hours + '시간';
}

function PartRow({ part, chapters, nodeLabels }) {
  return (
    <Link
      className={'cv2-part-card cv2-part-card--' + part.order}
      to={'/parts/' + part.id}
      aria-label={'Part ' + part.order + ' ' + part.title + ' 살펴보기'}
    >
      <span className="cv2-part-card__number">
        {String(part.order).padStart(2, '0')}
      </span>

      <div className="cv2-part-card__body">
        <h2 className="cv2-part-card__title">{part.title}</h2>
        <p className="cv2-part-card__goal">{part.goal}</p>

        <div className="cv2-part-card__nodes" aria-label="대표 시스템 영역">
          {nodeLabels.map((label) => (
            <span key={label} className="cv2-node-chip">{label}</span>
          ))}
        </div>
      </div>

      <div className="cv2-part-card__side">
        <div className="cv2-part-card__meta">
          <span>{chapters.length}개 {part.unitLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDuration(chapters)}</span>
        </div>

        <div className="cv2-progress">
          <div className="cv2-progress__labels">
            <span>진행률</span>
            <strong>0%</strong>
          </div>
          <div
            className="cv2-progress__track"
            role="progressbar"
            aria-label={part.title + ' 진행률'}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
          >
            <span className="cv2-progress__value" />
          </div>
        </div>
      </div>

      <span className="cv2-part-card__arrow" aria-hidden="true">→</span>
    </Link>
  );
}

function CurriculumHome() {
  const parts = curriculumRepository.listParts();
  const systemMap = curriculumRepository.getSystemMap();
  const nodeById = new Map(systemMap.nodes.map((node) => [node.id, node]));

  return (
    <div className="cv2-container cv2-page">
      <section className="cv2-hero" aria-labelledby="curriculum-title">
        <div>
          <p className="cv2-eyebrow">Common Engineering Curriculum</p>
          <h1 id="curriculum-title">Part 0부터 Part 8까지</h1>
          <p className="cv2-hero__description">
            개발 작업 공간에서 시작해 프론트엔드, 데이터, 서버, 네트워크와 운영까지
            소프트웨어가 확장되는 순서로 배웁니다.
          </p>
        </div>

        <Link className="cv2-diagnosis-card" to="/diagnosis">
          <span>
            <strong>어디서 시작할지 모르겠다면</strong>
            <small>진단은 학습을 막지 않고 힌트와 복습만 조절합니다.</small>
          </span>
          <span aria-hidden="true">진단 보기 →</span>
        </Link>
      </section>

      <section aria-labelledby="part-list-title">
        <div className="cv2-section-heading">
          <div>
            <p className="cv2-eyebrow">Curriculum</p>
            <h2 id="part-list-title">Part를 선택하세요</h2>
          </div>
          <p>모든 Part는 잠겨 있지 않습니다.</p>
        </div>

        <div className="cv2-part-grid">
          {parts.map((part) => (
            <PartRow
              key={part.id}
              part={part}
              chapters={curriculumRepository.listChapters(part.id)}
              nodeLabels={part.representativeNodeIds
                .map((nodeId) => nodeById.get(nodeId)?.label)
                .filter(Boolean)}
            />
          ))}
        </div>
      </section>

      <section className="cv2-final-card" aria-labelledby="final-title">
        <div>
          <p className="cv2-eyebrow">Final Project</p>
          <h2 id="final-title">AI가 만든 서비스를 엔지니어링하기</h2>
          <p>
            여덟 Part에서 배운 내용을 하나의 시스템에 적용하는 종합 프로젝트입니다.
          </p>
        </div>
        <Link className="cv2-button cv2-button--secondary" to="/final">
          프로젝트 살펴보기
        </Link>
      </section>
    </div>
  );
}

export default CurriculumHome;
