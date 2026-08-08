import { useScrollReveal, useHasScrolled } from '../../hooks/useScrollReveal';
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
        <div className="ld-track__top">
          <span className="ld-track__label">Part {part.order}</span>
        </div>
        <h3 className="ld-track__headline">{part.title}</h3>
        <p className="ld-track__desc">{part.goal}</p>
      </article>
    </Reveal>
  );
}

function LandingScreen({ onStart }) {
  const scrolled = useHasScrolled();
  const parts = curriculumRepository.listParts();

  const scrollToNext = () => {
    document
      .getElementById('ld-manifesto')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="ld">
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
            {landingHero.cta}
          </button>
        </div>

        <button
          type="button"
          className={'ld-scroll-hint' + (scrolled ? ' ld-scroll-hint--hidden' : '')}
          onClick={scrollToNext}
          aria-label={landingHero.scrollHint}
          tabIndex={scrolled ? -1 : 0}
        >
          <span className="ld-scroll-hint__text">{landingHero.scrollHint}</span>
          <span className="ld-scroll-hint__chevron" aria-hidden="true" />
        </button>
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
              다섯 Part로
              <br />
              시스템 전체를 배웁니다
            </h2>
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
              {landingClosing.cta}
            </button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default LandingScreen;
