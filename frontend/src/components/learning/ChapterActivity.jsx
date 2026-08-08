import { useMemo, useState } from 'react';
import {
  getMapCandidateIds,
  isSequenceCorrect,
  sameIdSet,
} from './chapterActivityUtils';

function ActivityBody({ value }) {
  if (Array.isArray(value)) {
    return value.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
  }

  return <p>{value}</p>;
}

function StepAction({ disabled = false, isLastStep, label, onComplete }) {
  return (
    <div className="cv2-activity__action">
      <button
        className="cv2-player-button cv2-player-button--primary"
        type="button"
        disabled={disabled}
        onClick={onComplete}
      >
        {label ?? (isLastStep ? 'Chapter 마치기' : '다음 단계')} →
      </button>
    </div>
  );
}

function Feedback({ correct, children }) {
  return (
    <div
      className={'cv2-activity-feedback ' + (correct ? 'is-correct' : 'is-incorrect')}
      role="status"
      aria-live="polite"
    >
      <strong>{correct ? '근거가 맞습니다' : '다시 확인해 보세요'}</strong>
      <p>{children}</p>
    </div>
  );
}

function feedbackText(feedback) {
  if (typeof feedback === 'string') return feedback;
  return feedback?.description ?? feedback?.title ?? '';
}

function ContentActivity({ activity, isLastStep, onComplete }) {
  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Context</p>
      <h2>{activity.title}</h2>
      <div className="cv2-activity__body">
        <ActivityBody value={activity.body} />
      </div>
      {activity.keyPoints?.length > 0 && (
        <ul className="cv2-activity__key-points">
          {activity.keyPoints.map((point) => <li key={point}>{point}</li>)}
        </ul>
      )}
      <StepAction isLastStep={isLastStep} onComplete={onComplete} />
    </article>
  );
}

function EvidenceActivity({ activity, isLastStep, onComplete }) {
  const content = typeof activity.content === 'string'
    ? activity.content
    : JSON.stringify(activity.content, null, 2);

  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Observe · {activity.evidenceType}</p>
      <h2>{activity.title}</h2>
      {activity.description && <p className="cv2-activity__lead">{activity.description}</p>}
      <pre className="cv2-evidence"><code>{content}</code></pre>
      <StepAction isLastStep={isLastStep} label="증거 확인 완료" onComplete={onComplete} />
    </article>
  );
}

function SingleChoiceActivity({ activity, isLastStep, onComplete }) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedChoice = activity.choices.find((choice) => choice.id === selectedId);
  const correct = selectedId === activity.correctChoiceId;

  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Choose one</p>
      <h2>{activity.question}</h2>
      <div className="cv2-answer-list" role="group" aria-label="선택지">
        {activity.choices.map((choice) => (
          <button
            className="cv2-answer-row"
            type="button"
            key={choice.id}
            aria-pressed={selectedId === choice.id}
            onClick={() => setSelectedId(choice.id)}
          >
            <span>{choice.text}</span>
            <span aria-hidden="true">{selectedId === choice.id ? '●' : '○'}</span>
          </button>
        ))}
      </div>
      {selectedChoice && (
        <Feedback correct={correct}>{feedbackText(selectedChoice.feedback)}</Feedback>
      )}
      <StepAction disabled={!correct} isLastStep={isLastStep} onComplete={onComplete} />
    </article>
  );
}

function MultiChoiceActivity({ activity, isLastStep, onComplete }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const correct = sameIdSet(selectedIds, activity.correctChoiceIds);

  const toggleChoice = (choiceId) => {
    setSubmitted(false);
    setSelectedIds((current) => (
      current.includes(choiceId)
        ? current.filter((id) => id !== choiceId)
        : [...current, choiceId]
    ));
  };

  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Choose all that apply</p>
      <h2>{activity.question}</h2>
      <div className="cv2-answer-list" role="group" aria-label="복수 선택지">
        {activity.choices.map((choice) => (
          <button
            className="cv2-answer-row"
            type="button"
            key={choice.id}
            aria-pressed={selectedIds.includes(choice.id)}
            onClick={() => toggleChoice(choice.id)}
          >
            <span>{choice.text}</span>
            <span aria-hidden="true">{selectedIds.includes(choice.id) ? '■' : '□'}</span>
          </button>
        ))}
      </div>
      {!submitted ? (
        <StepAction
          disabled={selectedIds.length === 0}
          label="선택 확인"
          onComplete={() => setSubmitted(true)}
        />
      ) : (
        <>
          <Feedback correct={correct}>
            {correct
              ? '선택한 항목이 모두 근거와 일치합니다.'
              : '빠진 항목이나 함께 선택하면 안 되는 항목이 있습니다.'}
          </Feedback>
          <StepAction disabled={!correct} isLastStep={isLastStep} onComplete={onComplete} />
        </>
      )}
    </article>
  );
}

function MapSelectActivity({ activity, chapterMap, systemMap, isLastStep, onComplete }) {
  const candidateIds = useMemo(
    () => getMapCandidateIds(activity, chapterMap),
    [activity, chapterMap],
  );
  const nodeById = useMemo(
    () => new Map(systemMap.nodes.map((node) => [node.id, node])),
    [systemMap.nodes],
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const correct = sameIdSet(selectedIds, activity.correctNodeIds);

  const toggleNode = (nodeId) => {
    setSubmitted(false);
    setSelectedIds((current) => (
      current.includes(nodeId)
        ? current.filter((id) => id !== nodeId)
        : [...current, nodeId]
    ));
  };

  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Locate on system map</p>
      <h2>{activity.question}</h2>
      <div className="cv2-map-choice-grid" role="group" aria-label="시스템 맵 노드">
        {candidateIds.map((nodeId) => (
          <button
            className="cv2-map-choice"
            type="button"
            key={nodeId}
            aria-pressed={selectedIds.includes(nodeId)}
            onClick={() => toggleNode(nodeId)}
          >
            <span aria-hidden="true">{selectedIds.includes(nodeId) ? '●' : '○'}</span>
            {nodeById.get(nodeId)?.label ?? nodeId}
          </button>
        ))}
      </div>
      {!submitted ? (
        <StepAction
          disabled={selectedIds.length === 0}
          label="위치 확인"
          onComplete={() => setSubmitted(true)}
        />
      ) : (
        <>
          <Feedback correct={correct}>
            {correct
              ? (activity.correctFeedback ?? '문제가 생긴 위치를 정확히 찾았습니다.')
              : (activity.incorrectFeedback ?? '증거가 가리키는 위치를 다시 좁혀 보세요.')}
          </Feedback>
          <StepAction disabled={!correct} isLastStep={isLastStep} onComplete={onComplete} />
        </>
      )}
    </article>
  );
}

function SequenceActivity({ activity, isLastStep, onComplete }) {
  const [items, setItems] = useState(activity.items);
  const [submitted, setSubmitted] = useState(false);
  const correct = isSequenceCorrect(items, activity.correctOrder);

  const moveItem = (index, offset) => {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    setItems(nextItems);
    setSubmitted(false);
  };

  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Put in order</p>
      <h2>{activity.prompt}</h2>
      <ol className="cv2-sequence-list">
        {items.map((item, index) => (
          <li key={item.id}>
            <span><strong>{index + 1}</strong>{item.text}</span>
            <span className="cv2-sequence-list__actions">
              <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label={`${item.text} 위로 이동`}>↑</button>
              <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} aria-label={`${item.text} 아래로 이동`}>↓</button>
            </span>
          </li>
        ))}
      </ol>
      {!submitted ? (
        <StepAction label="순서 확인" onComplete={() => setSubmitted(true)} />
      ) : (
        <>
          <Feedback correct={correct}>
            {correct ? '실행 흐름의 순서가 맞습니다.' : '앞 단계의 결과가 다음 단계의 입력이 되는지 확인해 보세요.'}
          </Feedback>
          <StepAction disabled={!correct} isLastStep={isLastStep} onComplete={onComplete} />
        </>
      )}
    </article>
  );
}

function DiffReviewActivity({ activity, isLastStep, onComplete }) {
  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Review the change</p>
      <h2>{activity.question}</h2>
      <div className="cv2-diff-grid">
        <section>
          <strong>변경 전</strong>
          <pre><code>{activity.before}</code></pre>
        </section>
        <section>
          <strong>변경 후</strong>
          <pre><code>{activity.after}</code></pre>
        </section>
      </div>
      {activity.reviewGuide?.length > 0 && (
        <ul className="cv2-activity__key-points">
          {activity.reviewGuide.map((guide) => <li key={guide}>{guide}</li>)}
        </ul>
      )}
      <StepAction isLastStep={isLastStep} label="변경 검토 완료" onComplete={onComplete} />
    </article>
  );
}

function ChecklistActivity({ activity, isLastStep, onComplete }) {
  const [checkedIds, setCheckedIds] = useState([]);
  const complete = activity.items.every((item) => checkedIds.includes(item.id));

  const toggleItem = (itemId) => {
    setCheckedIds((current) => (
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    ));
  };

  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Verification checklist</p>
      <h2>{activity.prompt}</h2>
      <div className="cv2-checklist">
        {activity.items.map((item) => (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={checkedIds.includes(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <span>{item.text}</span>
          </label>
        ))}
      </div>
      <StepAction disabled={!complete} isLastStep={isLastStep} onComplete={onComplete} />
    </article>
  );
}

function FreeResponseActivity({ activity, isLastStep, onComplete }) {
  const [answer, setAnswer] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const rubric = Array.isArray(activity.rubric) ? activity.rubric : [activity.rubric];

  return (
    <article className="cv2-activity">
      <p className="cv2-player-kicker">Explain in your words</p>
      <h2>{activity.prompt}</h2>
      <label className="cv2-free-response">
        <span>나의 설명</span>
        <textarea
          rows="8"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setReviewing(false);
          }}
          placeholder="원인, 근거, 해결책, 검증 방법을 차례대로 적어보세요."
        />
      </label>
      {!reviewing ? (
        <StepAction
          disabled={answer.trim().length < 10}
          label="확인 기준 보기"
          onComplete={() => setReviewing(true)}
        />
      ) : (
        <>
          <section className="cv2-rubric">
            <strong>내 설명 확인하기</strong>
            <ul>{rubric.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <StepAction isLastStep={isLastStep} onComplete={onComplete} />
        </>
      )}
    </article>
  );
}

function CompletionActivity({ activity, onComplete }) {
  return (
    <article className="cv2-activity cv2-activity--completion">
      <p className="cv2-player-kicker">Chapter complete</p>
      <h2>{activity.title}</h2>
      <div className="cv2-activity__body"><ActivityBody value={activity.summary} /></div>
      <StepAction label="결과 정리하기" isLastStep onComplete={onComplete} />
    </article>
  );
}

function ChapterActivity({ chapterMap, isLastStep, onComplete, step, systemMap }) {
  const commonProps = { activity: step.activity, isLastStep, onComplete };

  switch (step.activity.type) {
    case 'content':
      return <ContentActivity {...commonProps} />;
    case 'evidence':
      return <EvidenceActivity {...commonProps} />;
    case 'single-choice':
      return <SingleChoiceActivity {...commonProps} />;
    case 'multi-choice':
      return <MultiChoiceActivity {...commonProps} />;
    case 'map-select':
      return <MapSelectActivity {...commonProps} chapterMap={chapterMap} systemMap={systemMap} />;
    case 'sequence':
      return <SequenceActivity {...commonProps} />;
    case 'diff-review':
      return <DiffReviewActivity {...commonProps} />;
    case 'checklist':
      return <ChecklistActivity {...commonProps} />;
    case 'free-response':
      return <FreeResponseActivity {...commonProps} />;
    case 'completion':
      return <CompletionActivity activity={step.activity} onComplete={onComplete} />;
    default:
      return (
        <div className="cv2-player-empty" role="alert">
          <h2>지원하지 않는 학습 활동입니다</h2>
          <p>{step.activity.type}</p>
        </div>
      );
  }
}

export default ChapterActivity;
