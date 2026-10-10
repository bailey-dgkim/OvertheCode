import { useEffect, useRef, useState } from 'react';
import { landingHero, landingPhilosophy } from '../../data/landing';

function Brand() {
  return (
    <a className="ld-brand" href="#top" aria-label="Over the Code 첫 화면">
      <span className="ld-brand__mark" aria-hidden="true">O</span>
      <strong>Over the Code</strong>
    </a>
  );
}

function PhilosophyModal({ onClose, onDiagnosis }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="ld-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="ld-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="philosophy-title"
      >
        <div className="ld-modal__topbar">
          <p>{landingPhilosophy.eyebrow}</p>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="설명 닫기">×</button>
        </div>

        <div className="ld-modal__content">
          <div className="ld-modal__intro">
            <h2 id="philosophy-title">{landingPhilosophy.title}</h2>
            <p>{landingPhilosophy.intro}</p>
          </div>

          <ol className="ld-philosophy-list">
            {landingPhilosophy.sections.map((section, index) => (
              <li key={section.label}>
                <span>{String(index + 1).padStart(2, '0')} · {section.label}</span>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="ld-modal__learning">
            <p>학습의 방향</p>
            <ol>
              {landingPhilosophy.outcomes.map((outcome, index) => (
                <li key={outcome}><span>{index + 1}</span>{outcome}</li>
              ))}
            </ol>
          </div>

          <div className="ld-modal__principles">
            <p>{landingPhilosophy.principle}</p>
            <p>{landingPhilosophy.system}</p>
          </div>
        </div>

        <footer className="ld-modal__footer">
          <p>5개의 상황으로 지금의 출발점을 확인합니다.</p>
          <button type="button" className="ld-btn ld-btn--primary" onClick={onDiagnosis}>
            {landingPhilosophy.cta}<span aria-hidden="true">→</span>
          </button>
        </footer>
      </section>
    </div>
  );
}

function LandingScreen({ onDiagnosis }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="ld" id="top">
      <header className="ld-header">
        <div className="ld-header__inner"><Brand /></div>
      </header>

      <section className="ld-hero">
        <div className="ld-hero__copy">
          <p className="ld-eyebrow">{landingHero.eyebrow}</p>
          <h1>
            {landingHero.title.map((line) => <span key={line}>{line}</span>)}
          </h1>
          <p className="ld-hero__description">{landingHero.description}</p>
          <button type="button" className="ld-btn ld-btn--primary ld-hero__cta" onClick={() => setIsModalOpen(true)}>
            {landingHero.cta}<span aria-hidden="true">→</span>
          </button>
          <ul className="ld-hero__subjects" aria-label="주요 학습 주제">
            {landingHero.subjects.map((subject) => <li key={subject}>{subject}</li>)}
          </ul>
        </div>
        <p className="ld-hero__note">Technical agency for people who build digital products.</p>
      </section>

      {isModalOpen && (
        <PhilosophyModal
          onClose={() => setIsModalOpen(false)}
          onDiagnosis={onDiagnosis}
        />
      )}
    </main>
  );
}

export default LandingScreen;
