import { useEffect } from 'react';

/** 준비 중 안내용 간단한 토스트. 일정 시간 뒤 자동으로 닫힌다. */
function Toast({ message, onDismiss, duration = 2400 }) {
  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss, duration]);

  if (!message) return null;

  return (
    <div className="oc-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default Toast;
