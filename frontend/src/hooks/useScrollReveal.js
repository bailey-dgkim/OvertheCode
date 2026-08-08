import { useEffect, useRef, useState } from 'react';

/**
 * 스크롤 등장 연출.
 *
 * 이 연출의 실패 모드는 "애니메이션이 안 나옴"이 아니라 "콘텐츠가 영영 안 보임"이다.
 * 숨긴 상태(opacity:0)에서 시작하기 때문에, 관찰자가 한 번도 콜백을 주지 않으면
 * 화면이 그대로 비어버린다. 그래서 다음 두 가지 안전장치를 둔다.
 *
 *  1) IntersectionObserver가 실제로 동작하는 환경인지 한 번 검사한다.
 *     (구현은 있지만 콜백이 오지 않는 환경이 있다.)
 *  2) 마운트 시점에 이미 화면 안에 있으면 관찰자를 기다리지 않고 바로 보여준다.
 *
 * 둘 중 하나라도 이상하면 연출을 포기하고 콘텐츠를 노출한다.
 */

/** null = 아직 모름, true/false = 검사 완료 */
let observerWorks = null;
const waiting = new Set();

function resolveSupport(value) {
  observerWorks = value;
  waiting.forEach((notify) => notify(value));
  waiting.clear();
}

function probeObserverSupport() {
  if (observerWorks !== null) return;

  if (typeof IntersectionObserver === 'undefined' || typeof document === 'undefined') {
    resolveSupport(false);
    return;
  }

  // 숨겨진 문서(백그라운드 탭 등)에서는 관찰자 콜백이 오지 않는 것이 정상이다.
  // 여기서 '못 쓴다'고 판정하면 사용자가 탭을 열었을 때 연출이 사라져버리므로,
  // 문서가 보이게 될 때까지 판정을 미룬다.
  if (document.hidden) {
    document.addEventListener('visibilitychange', function onVisible() {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', onVisible);
      probeObserverSupport();
    });
    return;
  }

  let fired = false;
  const probe = new IntersectionObserver(() => {
    fired = true;
    probe.disconnect();
    resolveSupport(true);
  });

  probe.observe(document.body);

  // 정상 환경이라면 관찰 직후 콜백이 한 번 온다. 오지 않으면 못 쓰는 것으로 본다.
  window.setTimeout(() => {
    if (fired) return;
    probe.disconnect();
    resolveSupport(false);
  }, 400);
}

function isInViewport(node) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function useScrollReveal(options = {}) {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px' } = options;

  const ref = useRef(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const [revealed, setRevealed] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const node = ref.current;
    if (!node) return undefined;

    // 처음부터 화면에 들어와 있는 요소는 관찰자를 기다릴 이유가 없다.
    if (isInViewport(node)) {
      setRevealed(true);
      return undefined;
    }

    let observer;
    let cancelled = false;

    const start = (supported) => {
      if (cancelled) return;

      if (!supported) {
        setRevealed(true);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setRevealed(true);
          observer.disconnect();
        },
        { threshold, rootMargin },
      );
      observer.observe(node);
    };

    if (observerWorks === null) {
      waiting.add(start);
      probeObserverSupport();
    } else {
      start(observerWorks);
    }

    return () => {
      cancelled = true;
      waiting.delete(start);
      observer?.disconnect();
    };
  }, [threshold, rootMargin, prefersReducedMotion]);

  return [ref, revealed];
}

/**
 * 스크롤을 조금이라도 내렸는지 여부. 히어로의 스크롤 힌트를 숨기는 데 쓴다.
 * 스크롤 이벤트가 오지 않는 환경에서도 힌트가 남아있을 뿐 콘텐츠에는 영향이 없다.
 */
export function useHasScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);

  return scrolled;
}
