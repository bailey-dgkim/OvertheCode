import { Link } from 'react-router-dom';
import { curriculumRepository } from '../../content/v2';

function formatDuration(minutes) {
  if (!minutes) return '콘텐츠 준비 중';
  if (minutes < 60) return minutes + '분';

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? hours + '시간 ' + remainder + '분' : hours + '시간';
}

function PartRow({ part, chapters, nodeLabels }) {
  const estimatedMinutes = chapters.reduce(
    (total, chapter) => total + chapter.estimatedMinutes,
    0,
  );

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
          <span>{chapters.length}개 Chapter</span>
          <span aria-hidden="true">·</span>
          <span>{formatDuration(estimatedMinutes)}</span>
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
          <h1 id="curriculum-title">시스템 전체를 읽는 다섯 Part</h1>
          <p className="cv2-hero__description">
            코드를 많이 쓰는 것보다, 요청이 어디로 이동하고 무엇이 실패할 수 있는지
            설명하는 능력을 먼저 기릅니다.
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
            다섯 Part에서 배운 내용을 하나의 시스템에 적용하는 종합 프로젝트입니다.
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
