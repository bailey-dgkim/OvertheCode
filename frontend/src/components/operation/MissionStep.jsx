function MissionStep({ step, onNext }) {
  return (
    <div className="oc-stack oc-stack--lg">
      <div className="oc-stack">
        <div className="oc-block oc-block--mission">
          <p className="oc-block__label">Mission</p>
          <p className="oc-block__body">{step.mission}</p>
        </div>

        <div className="oc-block oc-block--problem">
          <p className="oc-block__label">Problem</p>
          <p className="oc-block__body">{step.problem}</p>
        </div>
      </div>

      <p className="oc-question">{step.question}</p>

      <div className="oc-btn-row oc-btn-row--stack">
        <button type="button" className="oc-btn oc-btn--primary" onClick={onNext}>
          {step.actionLabel}
        </button>
      </div>
    </div>
  );
}

export default MissionStep;
