import { Link, useParams } from 'react-router-dom';
import { curriculumRepository } from '../../content/v2';
import { readFrontendLessonProgress } from '../learning/frontendLessonProgress';
import NotFoundScreen from './NotFoundScreen';

function ChapterCard({ chapter, isFoundation = false, unitLabel }) {
  const available = chapter.status === 'available';
  const stepCount = chapter.lessonCount ?? chapter.steps.length;
  const savedProgress = chapter.renderer ? readFrontendLessonProgress(chapter.id) : null;
  const started = savedProgress && savedProgress.stepIndex > 0;
  const statusLabel = savedProgress?.completed
    ? '완료'
    : started
      ? `${savedProgress.stepIndex + 1}단계 이어하기`
      : available
        ? '학습 가능'
        : '내용 설계 중';
  const conceptPreview = chapter.outlineConcepts.slice(0, 3).join(' · ');
  const learningSummary = stepCount > 0
    ? `${stepCount}개 학습 단계 · ${chapter.estimatedMinutes}분`
    : `${chapter.outlineConcepts.length}개 핵심 개념`;

  return (
    <Link
      className="cv2-chapter-card"
      to={`/chapters/${chapter.id}/learn`}
      aria-label={`${unitLabel} ${chapter.order} ${chapter.title} 학습 시작`}
    >
      <div className="cv2-chapter-card__badges">
        <span className="cv2-chapter-card__category">
          {unitLabel} {String(chapter.order).padStart(2, '0')}
        </span>
        {isFoundation && <span className="cv2-foundation-badge">기초</span>}
        <span className={'cv2-status-badge' + (available ? ' cv2-status-badge--ready' : '')}>
          {statusLabel}
        </span>
      </div>

      <div className="cv2-chapter-card__body">
        <h2>{chapter.title}</h2>
      </div>

      <dl className="cv2-chapter-card__info">
        <div>
          <dt>핵심 질문</dt>
          <dd>{chapter.coreQuestion}</dd>
        </div>
        <div>
          <dt>학습 구성</dt>
          <dd>
            <strong>{learningSummary}</strong>
            {conceptPreview && <small>{conceptPreview}</small>}
          </dd>
        </div>
      </dl>

      <span className="cv2-chapter-card__cta">
        {started && !savedProgress.completed ? '이어서 학습' : 'Chapter 시작'} <span aria-hidden="true">→</span>
      </span>
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
  const isFrontendPart = part.id === 'frontend';

  return (
    <div className="cv2-container cv2-page">
      <nav className="cv2-breadcrumb" aria-label="현재 위치">
        <Link to="/curriculum">커리큘럼</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Part {part.order}</span>
      </nav>

      <section
        className="cv2-part-hero cv2-part-hero--single"
        aria-labelledby="part-title"
      >
        <div>
          <p className="cv2-eyebrow">Part {part.order}</p>
          <h1 id="part-title">{part.title}</h1>
          <p className={isFrontendPart ? 'cv2-part-hero__tagline' : undefined}>
            {part.realization}
          </p>
        </div>

      </section>

      {isFrontendPart ? (
        <section className="cv2-part-scope-section" aria-labelledby="part-scope-title">
          <div className="cv2-part-scope-section__heading">
            <p className="cv2-eyebrow">Curriculum</p>
            <h2 id="part-scope-title">교육 범위</h2>
            <p>{part.outcome}</p>
          </div>
          <ol className="cv2-part-scope cv2-part-scope--main">
            {part.scope.map((item, index) => (
              <li key={item}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section className="cv2-part-context" aria-labelledby="part-question-title">
          <div className="cv2-part-context__question">
            <p className="cv2-eyebrow">Core Question</p>
            <h2 id="part-question-title">{part.question}</h2>
          </div>

          <div className="cv2-part-context__details">
            <section className="cv2-part-context__row" aria-labelledby="part-scope-title">
              <h3 id="part-scope-title">교육 범위</h3>
              <ol className="cv2-part-scope">
                {part.scope.map((item, index) => (
                  <li key={item}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </section>

            <section className="cv2-part-context__row" aria-labelledby="part-existing-title">
              <h3 id="part-existing-title">이미 가진 역량과 연결</h3>
              <p>{part.existingCompetency}</p>
            </section>

            <section className="cv2-part-context__row" aria-labelledby="part-outcome-title">
              <h3 id="part-outcome-title">이 Part를 마치면</h3>
              <p>{part.outcome}</p>
            </section>
          </div>
        </section>
      )}

      {!isFrontendPart && part.memory && (
        <section className="cv2-memory-design" aria-labelledby="memory-design-title">
          <div className="cv2-memory-design__intro">
            <p className="cv2-eyebrow">Learning Design</p>
            <h2 id="memory-design-title">{part.memory.title}</h2>
            <p>{part.memory.copy}</p>
          </div>

          <div className="cv2-memory-design__body">
            <div className="cv2-memory-design__rule">
              <strong>학습 규칙</strong>
              <p>{part.memory.rule}</p>
            </div>
            <ol>
              {part.memory.items.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section aria-labelledby="chapter-list-title">
        <div className="cv2-section-heading">
          <div>
            <p className="cv2-eyebrow">Contents</p>
            <h2 id="chapter-list-title">{chapters.length}개 {part.unitLabel}</h2>
          </div>
        </div>

        {chapters.length > 0 ? (
          <div className={`cv2-chapter-list cv2-chapter-list--${chapters.length}`}>
            {chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                isFoundation={isFrontendPart && chapter.order === 1}
                unitLabel={part.unitLabel}
              />
            ))}
          </div>
        ) : (
          <div className="cv2-empty-state">
            <strong>Chapter 내용을 설계하고 있습니다.</strong>
            <p>Part 구조는 열려 있으며 콘텐츠가 준비되는 순서대로 여기에 추가됩니다.</p>
          </div>
        )}

        {isFrontendPart && (
          <Link className="cv2-certification-quiz" to="/parts/frontend/quiz" aria-labelledby="frontend-quiz-title">
            <div>
              <p className="cv2-eyebrow">Certification</p>
              <h2 id="frontend-quiz-title">프론트엔드 인증 퀴즈</h2>
            </div>
            <span className="cv2-certification-quiz__meta">15문항 <span aria-hidden="true">→</span></span>
          </Link>
        )}
      </section>
    </div>
  );
}

export default PartDetail;
