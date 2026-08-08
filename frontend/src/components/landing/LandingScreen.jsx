import { useScrollReveal, useHasScrolled } from '../../hooks/useScrollReveal';
import {
  landingHero,
  landingManifesto,
  landingTracks,
  landingClosing,
} from '../../data/landing';

/** 스크롤에 반응해 아래에서 올라오며 나타나는 래퍼 */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, revealed] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`ld-reveal${revealed ? ' ld-reveal--in' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
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

function TrackPreview({ track, index }) {
  return (
    <Reveal delay={index * 80}>
      <article className={`ld-track ld-track--${track.id}`}>
        <div className="ld-track__top">
          <span className="ld-track__label">{track.trackLabel}</span>
          <span
            className={`ld-track__status ld-track__status--${
              track.status === 'available' ? 'on' : 'off'
            }`}
          >
            {track.statusLabel}
          </span>
        </div>
        <h3 className="ld-track__headline">{track.headline}</h3>
        <p className="ld-track__desc">{track.description}</p>
      </article>
    </Reveal>
  );
}

function LandingScreen({ onStart }) {
  const scrolled = useHasScrolled();

  const scrollToNext = () => {
    document
      .getElementById('ld-manifesto')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="ld">
      {/* ---------- 히어로 ---------- */}
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
          className={`ld-scroll-hint${scrolled ? ' ld-scroll-hint--hidden' : ''}`}
          onClick={scrollToNext}
          aria-label={landingHero.scrollHint}
          tabIndex={scrolled ? -1 : 0}
        >
          <span className="ld-scroll-hint__text">{landingHero.scrollHint}</span>
          <span className="ld-scroll-hint__chevron" aria-hidden="true" />
        </button>
      </section>

      {/* ---------- 이 서비스가 존재하는 이유 ---------- */}
      <section className="ld-section ld-manifesto" id="ld-manifesto">
        <div className="ld-inner">
          {landingManifesto.map((item, index) => (
            <ManifestoBlock key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* ---------- 두 개의 트랙 ---------- */}
      <section className="ld-section ld-tracks">
        <div className="ld-inner">
          <Reveal>
            <h2 className="ld-tracks__title">
              두 가지 방식으로
              <br />
              개발자의 일을 배웁니다
            </h2>
          </Reveal>

          <div className="ld-tracks__grid">
            {landingTracks.map((track, index) => (
              <TrackPreview key={track.id} track={track} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 마무리 ---------- */}
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
