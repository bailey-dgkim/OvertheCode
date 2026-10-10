import { LAYER_MAP, PLACEMENT_QUESTIONS } from '../../data/concepts';

/**
 * Architecture 도메인에서만 노출되는 요약 패널.
 * 개별 개념 카드로는 드러나지 않는 "계층 사이의 관계"를 한눈에 보여준다.
 */
function LayerMapPanel() {
  return (
    <div className="oc-layermap">
      <section className="oc-layermap__block">
        <h3 className="oc-layermap__title">백엔드 · 프론트엔드 대응</h3>
        <p className="oc-muted oc-layermap__sub">
          이름만 다르지 같은 생각입니다. 이 대응을 외워두면 양쪽을 오갈 때 방향 감각이
          유지됩니다.
        </p>

        <div className="oc-layermap__table" role="table" aria-label="계층 대응표">
          <div className="oc-layermap__row oc-layermap__row--head" role="row">
            <span role="columnheader">백엔드</span>
            <span role="columnheader">프론트엔드</span>
            <span role="columnheader">역할</span>
          </div>
          {LAYER_MAP.map((row) => (
            <div key={row.backend} className="oc-layermap__row" role="row">
              <span role="cell" className="oc-layermap__cell--code">
                {row.backend}
              </span>
              <span role="cell" className="oc-layermap__cell--code">
                {row.frontend}
              </span>
              <span role="cell" className="oc-muted">
                {row.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="oc-layermap__block">
        <h3 className="oc-layermap__title">어디에 둘지 헷갈릴 때</h3>
        <ol className="oc-layermap__questions">
          {PLACEMENT_QUESTIONS.map((item, index) => (
            <li key={item.question} className="oc-layermap__question">
              <span className="oc-layermap__qnum" aria-hidden="true">
                {index + 1}
              </span>
              <span>
                <strong>{item.question}</strong>
                <span className="oc-layermap__qanswer">→ {item.answer}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default LayerMapPanel;
