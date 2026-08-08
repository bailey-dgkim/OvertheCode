/**
 * 자료구조 카드 스텝.
 * 자료구조 하나를 세 가지로 파악한다: 어떤 형태인지 · 언제 쓰는지 · 시간복잡도.
 * 판정이 없는 학습 화면이라 solution/concepts처럼 '다음'으로만 넘어간다.
 */
function StructureStep({ step, onNext }) {
  return (
    <div className="oc-stack oc-stack--lg">
      <div>
        <h2 className="oc-step__title">{step.name}</h2>
        {step.tagline && <p className="oc-muted">{step.tagline}</p>}
      </div>

      <section className="oc-struct">
        <h3 className="oc-struct__label">어떤 형태인가</h3>
        <p className="oc-struct__body">{step.shape}</p>
      </section>

      <section className="oc-struct">
        <h3 className="oc-struct__label">언제 쓰는가</h3>
        <ul className="oc-struct__uses">
          {step.whenToUse.map((use) => (
            <li key={use}>{use}</li>
          ))}
        </ul>
      </section>

      <section className="oc-struct">
        <h3 className="oc-struct__label">주요 연산의 시간복잡도</h3>
        <div className="oc-struct__table" role="table" aria-label="시간복잡도">
          <div className="oc-struct__row oc-struct__row--head" role="row">
            <span role="columnheader">연산</span>
            <span role="columnheader">시간</span>
            <span role="columnheader">왜</span>
          </div>
          {step.complexity.map((item) => (
            <div key={item.op} className="oc-struct__row" role="row">
              <span role="cell" className="oc-struct__op">
                {item.op}
              </span>
              <span role="cell">
                <code className="oc-struct__time">{item.time}</code>
              </span>
              <span role="cell" className="oc-muted">
                {item.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {step.note && <p className="oc-struct__hint">참고 · {step.note}</p>}

      <div className="oc-btn-row oc-btn-row--stack">
        <button type="button" className="oc-btn oc-btn--primary" onClick={onNext}>
          이해했어요, 다음
        </button>
      </div>
    </div>
  );
}

export default StructureStep;
