import { useState } from 'react';

/**
 * 콜 스택 시각화 스텝.
 *
 * mode: 'run'   — 학습자가 '호출/반환' 버튼을 눌러 프레임을 쌓고 뺀다.
 *                 마지막에 쌓은 것이 먼저 빠지는(LIFO) 동작을 직접 체험한다.
 * mode: 'trace' — 이미 쌓인 상태로 보여준다. 맨 위 = 가장 최근 호출.
 *                 실제 Stack Trace(에러 로그)가 이 스택임을 보여주는 데 쓴다.
 *
 * frames[0]이 가장 먼저 불린 것(스택 바닥), 마지막 원소가 맨 위다.
 * 판정 없는 학습 화면이라 '다음'으로만 넘어간다.
 */
function CallStackViz({ step, onNext }) {
  const mode = step.mode ?? 'run';
  const frames = step.frames ?? [];

  const [depth, setDepth] = useState(mode === 'trace' ? frames.length : 0);
  const [lastAction, setLastAction] = useState(null);

  const pushLabel = step.pushLabel ?? '호출 ↓';
  const popLabel = step.popLabel ?? '반환 ↑';

  const canPush = mode === 'run' && depth < frames.length;
  const canPop = mode === 'run' && depth > 0;

  const push = () => {
    const frame = frames[depth];
    setDepth(depth + 1);
    setLastAction({ kind: 'push', label: frame.label });
  };

  const pop = () => {
    const frame = frames[depth - 1];
    setDepth(depth - 1);
    setLastAction({ kind: 'pop', label: frame.label });
  };

  // 위에서부터(맨 위 = 가장 최근) 그린다.
  const visible = frames.slice(0, depth).reverse();

  return (
    <div className="oc-stack oc-stack--lg">
      <div>
        <h2 className="oc-step__title">{step.title}</h2>
        {step.intro && <p className="oc-muted">{step.intro}</p>}
      </div>

      {mode === 'run' && (
        <div className="oc-btn-row">
          <button
            type="button"
            className="oc-btn oc-btn--secondary"
            onClick={push}
            disabled={!canPush}
          >
            {pushLabel}
            {canPush ? ` ${frames[depth].label}` : ''}
          </button>
          <button
            type="button"
            className="oc-btn oc-btn--secondary"
            onClick={pop}
            disabled={!canPop}
          >
            {popLabel}
            {canPop ? ` ${frames[depth - 1].label}` : ''}
          </button>
        </div>
      )}

      <div className="oc-callstack" aria-label="콜 스택">
        <div className="oc-callstack__top-mark">
          {mode === 'trace' ? '맨 위 = 가장 최근 호출' : '맨 위 (top)'}
        </div>

        {visible.length === 0 ? (
          <div className="oc-callstack__empty">스택이 비어 있습니다. 호출을 눌러보세요.</div>
        ) : (
          visible.map((frame, i) => {
            const isTop = i === 0;
            return (
              <div
                key={frame.label}
                className={`oc-callstack__frame${isTop ? ' oc-callstack__frame--top' : ''}`}
              >
                <span className="oc-callstack__label">{frame.label}</span>
                {frame.detail && <span className="oc-callstack__detail">{frame.detail}</span>}
                {isTop && step.topLabel && (
                  <span className="oc-callstack__badge">{step.topLabel}</span>
                )}
              </div>
            );
          })
        )}

        <div className="oc-callstack__floor">스택 바닥 (가장 먼저 불린 것)</div>
      </div>

      {mode === 'run' && lastAction && (
        <p className="oc-callstack__status" role="status" aria-live="polite">
          {lastAction.kind === 'push'
            ? `${lastAction.label} 를 호출 — 맨 위에 쌓였습니다.`
            : `${lastAction.label} 반환 — 맨 위부터 빠져나갑니다.`}
        </p>
      )}

      {step.caption && <p className="oc-callstack__caption">{step.caption}</p>}

      <div className="oc-btn-row oc-btn-row--stack">
        <button type="button" className="oc-btn oc-btn--primary" onClick={onNext}>
          {step.nextLabel ?? '이해했어요, 다음'}
        </button>
      </div>
    </div>
  );
}

export default CallStackViz;
