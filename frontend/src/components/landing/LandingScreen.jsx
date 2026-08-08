import { useScrollReveal } from '../../hooks/useScrollReveal';
import {
  landingHero,
  landingManifesto,
  landingClosing,
} from '../../data/landing';
import { curriculumRepository } from '../../content/v2';

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, revealed] = useScrollReveal();
  const classes = 'ld-reveal'
    + (revealed ? ' ld-reveal--in' : '')
    + (className ? ' ' + className : '');

  return (
    <div
      ref={ref}
      className={classes}
      style={{ transitionDelay: delay + 'ms' }}
    >
      {children}
    </div>
  );
}

function ManifestoBlock({ item, index }) {
  return (
    <Reveal delay={index * 60} className="ld-manifesto__item">
      <p className="ld-manifesto__lead">{item.lead}</p>
      <p className="ld-manifesto__body">{item.body}</p>
    </Reveal>
  );
}

function PartPreview({ part, index }) {
  return (
    <Reveal delay={index * 60}>
      <article className="ld-track">
        <span className="ld-track__label">{String(part.order).padStart(2, '0')}</span>
        <div className="ld-track__body">
          <h3 className="ld-track__headline">{part.title}</h3>
          <p className="ld-track__desc">{part.goal}</p>
        </div>
        <span className="ld-track__arrow" aria-hidden="true">→</span>
      </article>
    </Reveal>
  );
}

function LandingScreen({ onStart }) {
  const parts = curriculumRepository.listParts();

  return (
    <main className="ld">
      <header className="ld-header">
        <div className="ld-header__inner">
          <div className="ld-brand">
            <span className="ld-brand__mark" aria-hidden="true">O</span>
            <strong>Over the Code</strong>
          </div>
          <button type="button" className="ld-header__action" onClick={onStart}>
            커리큘럼 보기 →
          </button>
        </div>
      </header>

      <section className="ld-section ld-hero">
        <div className="ld-inner ld-hero__inner">
          <p className="ld-hero__eyebrow">{landingHero.eyebrow}</p>

          <h1 className="ld-hero__title">
            {landingHero.title.map((line) => (
              <span key={line} className="ld-hero__line">
                {line}
              </span>
            ))}
          </h1>

          <p className="ld-hero__subtitle">{landingHero.subtitle}</p>

          <button type="button" className="ld-btn ld-btn--primary" onClick={onStart}>
            {landingHero.cta} →
          </button>
        </div>
      </section>

      <section className="ld-section ld-manifesto" id="ld-manifesto">
        <div className="ld-inner">
          {landingManifesto.map((item, index) => (
            <ManifestoBlock key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="ld-section ld-tracks">
        <div className="ld-inner">
          <Reveal>
            <h2 className="ld-tracks__title">
              Part 0에서 Part 8까지 시스템 전체를 배웁니다
            </h2>
            <p className="ld-tracks__intro">
              하나의 서비스가 만들어지고 운영될 때까지, 순서대로 연결해서 살펴봅니다.
            </p>
          </Reveal>

          <div className="ld-tracks__grid">
            {parts.map((part, index) => (
              <PartPreview key={part.id} part={part} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="ld-section ld-closing">
        <div className="ld-inner">
          <Reveal>
            <h2 className="ld-closing__title">{landingClosing.title}</h2>
            <button type="button" className="ld-btn ld-btn--primary" onClick={onStart}>
              {landingClosing.cta} →
            </button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default LandingScreen;
