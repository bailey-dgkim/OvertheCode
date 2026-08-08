import { useMemo, useState } from 'react';
import Badge from '../common/Badge';

/**
 * 파일 트리에서 정답 파일을 찾는 스텝.
 *
 * 퀴즈와 저장 방식이 같다: 정답이면 selectedAnswers에 경로가 남고, 오답은 재시도로 센다.
 * 그래서 CasePlayer는 QuizStep과 똑같이 onAnswer/onNext를 넘긴다.
 */

/** "frontend/components/OrderForm.jsx" 목록을 폴더 중첩 구조로 만든다. */
function buildTree(files) {
  const root = { folders: new Map(), files: [] };

  files.forEach((file) => {
    const parts = file.path.split('/');
    const fileName = parts.pop();

    let node = root;
    parts.forEach((folder) => {
      if (!node.folders.has(folder)) {
        node.folders.set(folder, { folders: new Map(), files: [] });
      }
      node = node.folders.get(folder);
    });
    node.files.push({ ...file, fileName });
  });

  return root;
}

function TreeNode({ node, depth, selectedPath, correctPath, onPick }) {
  return (
    <ul className="oc-tree__list">
      {[...node.folders.entries()].map(([name, child]) => (
        <li key={name}>
          <div className="oc-tree__folder" style={{ paddingLeft: depth * 16 }}>
            <span aria-hidden="true">📁</span> {name}
          </div>
          <TreeNode
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            correctPath={correctPath}
            onPick={onPick}
          />
        </li>
      ))}

      {node.files.map((file) => {
        const isSelected = selectedPath === file.path;
        const isCorrect = file.path === correctPath;
        const state = isSelected ? (isCorrect ? 'correct' : 'incorrect') : '';

        return (
          <li key={file.path}>
            <button
              type="button"
              className={`oc-tree__file${state ? ` oc-tree__file--${state}` : ''}`}
              style={{ paddingLeft: depth * 16 }}
              onClick={() => onPick(file)}
              aria-pressed={isSelected}
            >
              <span aria-hidden="true">📄</span>
              <span className="oc-tree__name">{file.fileName}</span>
              <Badge variant="layer" layer={file.layer}>
                {file.layer === 'frontend' ? '프론트엔드' : '백엔드'}
              </Badge>
              {state && (
                <span className="oc-tree__mark">
                  <span aria-hidden="true">{state === 'correct' ? '✓' : '✗'}</span>
                  {state === 'correct' ? '정답' : '다시 찾기'}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function LocateFileStep({ step, savedAnswer, onAnswer, onNext }) {
  const tree = useMemo(() => buildTree(step.files), [step.files]);
  const [selected, setSelected] = useState(savedAnswer ?? null);

  const selectedFile = step.files.find((f) => f.path === selected) ?? null;
  const isCorrect = selected === step.correctPath;

  const handlePick = (file) => {
    if (isCorrect) return; // 정답을 맞힌 뒤에는 잠근다
    setSelected(file.path);
    onAnswer(step.id, file.path, file.path === step.correctPath);
  };

  return (
    <div className="oc-stack oc-stack--lg">
      <p className="oc-question">{step.question}</p>
      {step.hint && <p className="oc-muted">💡 {step.hint}</p>}

      <div className="oc-tree" role="group" aria-label="파일 트리">
        <TreeNode
          node={tree}
          depth={0}
          selectedPath={selected}
          correctPath={step.correctPath}
          onPick={handlePick}
        />
      </div>

      {selectedFile && (
        <div
          className={`oc-locate-feedback oc-locate-feedback--${isCorrect ? 'correct' : 'incorrect'}`}
          role="status"
          aria-live="polite"
        >
          <p className="oc-locate-feedback__role">
            <code>{selectedFile.path}</code> · {selectedFile.role}
          </p>
          {isCorrect ? (
            <p>이 파일이 맞습니다. 이제 이 안에서 정확한 위치를 찾습니다.</p>
          ) : (
            <p>{selectedFile.feedback}</p>
          )}
        </div>
      )}

      <div className="oc-btn-row oc-btn-row--stack">
        <button
          type="button"
          className="oc-btn oc-btn--primary"
          onClick={onNext}
          disabled={!isCorrect}
        >
          이 파일 열기
        </button>
        {!isCorrect && (
          <span className="oc-muted" style={{ fontSize: 14 }}>
            맞는 파일을 찾으면 열어볼 수 있습니다.
          </span>
        )}
      </div>
    </div>
  );
}

export default LocateFileStep;
