import { useState } from 'react';

/**
 * Java 코드를 한글로 "번역"하는 스텝.
 * 외국어 문장을 읽듯, 코드 한 줄을 보고 뜻을 떠올린 뒤 확인한다.
 *
 * 판정이 없는 학습 화면이라 '다음'으로만 넘어간다(체크는 뒤의 quiz가 담당).
 * 가리기/펼치기는 개념 사전 복습 모드와 같은 방식이다.
 */
function TranslateLine({ line }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="oc-tr">
      <code className="oc-tr__code">{line.code}</code>

      {revealed ? (
        <p className="oc-tr__ko">{line.ko}</p>
      ) : (
        <button
          type="button"
          className="oc-tr__reveal"
          onClick={() => setRevealed(true)}
          aria-label={`뜻 보기: ${line.code}`}
        >
          뜻 보기
        </button>
      )}
    </div>
  );
}

function TranslateStep({ step, onNext }) {
  return (
    <div className="oc-stack oc-stack--lg">
      <div>
        <h2 className="oc-step__title">{step.title ?? '코드를 한글로 해석해보세요'}</h2>
        <p className="oc-muted">
          {step.intro ?? '한 줄씩 뜻을 떠올린 뒤, 버튼을 눌러 확인하세요.'}
        </p>
      </div>

      <div className="oc-tr-list">
        {step.lines.map((line) => (
          <TranslateLine key={line.code} line={line} />
        ))}
      </div>

      <div className="oc-btn-row oc-btn-row--stack">
        <button type="button" className="oc-btn oc-btn--primary" onClick={onNext}>
          해석했어요, 다음
        </button>
      </div>
    </div>
  );
}

export default TranslateStep;
