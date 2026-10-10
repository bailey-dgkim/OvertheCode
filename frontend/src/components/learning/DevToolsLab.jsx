function DevToolsLab({ answer, children, steps, title, tool }) {
  return (
    <aside className="cv2-devtools-lab" aria-label={`DevTools Lab · ${tool}`}>
      <header>
        <div>
          <span>DevTools Lab</span>
          <strong>{tool}</strong>
        </div>
        <p>Chrome · Microsoft Edge 기준</p>
      </header>

      <section>
        <p className="cv2-devtools-lab__eyebrow">지금 배운 개념을 브라우저에서 확인해보자</p>
        <h2>{title}</h2>
        {children}
        <ol>
          {steps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
        {answer && (
          <details>
            <summary>확인해야 할 핵심</summary>
            <p>{answer}</p>
          </details>
        )}
      </section>
    </aside>
  );
}

export default DevToolsLab;
