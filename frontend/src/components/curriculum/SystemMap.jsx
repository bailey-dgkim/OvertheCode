import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const NODE_STATE_LABELS = {
  primary: '이번 Chapter의 핵심',
  related: '함께 살펴볼 영역',
  context: '전체 시스템의 배경',
};

function getNodeState(nodeId, primaryNodeIds, relatedNodeIds) {
  if (primaryNodeIds.has(nodeId)) {
    return 'primary';
  }

  if (relatedNodeIds.has(nodeId)) {
    return 'related';
  }

  return 'context';
}

function getEdgePath(fromElement, toElement, stageRect) {
  const fromRect = fromElement.getBoundingClientRect();
  const toRect = toElement.getBoundingClientRect();
  const fromCenter = {
    x: fromRect.left + fromRect.width / 2 - stageRect.left,
    y: fromRect.top + fromRect.height / 2 - stageRect.top,
  };
  const toCenter = {
    x: toRect.left + toRect.width / 2 - stageRect.left,
    y: toRect.top + toRect.height / 2 - stageRect.top,
  };
  const horizontal = Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y);

  if (horizontal) {
    const goesRight = toCenter.x >= fromCenter.x;
    const startX = fromCenter.x + (goesRight ? fromRect.width / 2 : -fromRect.width / 2);
    const endX = toCenter.x + (goesRight ? -toRect.width / 2 : toRect.width / 2);
    const controlX = (startX + endX) / 2;

    return `M ${startX} ${fromCenter.y} C ${controlX} ${fromCenter.y}, ${controlX} ${toCenter.y}, ${endX} ${toCenter.y}`;
  }

  const goesDown = toCenter.y >= fromCenter.y;
  const startY = fromCenter.y + (goesDown ? fromRect.height / 2 : -fromRect.height / 2);
  const endY = toCenter.y + (goesDown ? -toRect.height / 2 : toRect.height / 2);
  const controlY = (startY + endY) / 2;

  return `M ${fromCenter.x} ${startY} C ${fromCenter.x} ${controlY}, ${toCenter.x} ${controlY}, ${toCenter.x} ${endY}`;
}

function SystemMap({ systemMap, chapterMap }) {
  const sortedGroups = useMemo(
    () => [...systemMap.groups].sort((a, b) => a.order - b.order),
    [systemMap.groups],
  );
  const orderedNodes = useMemo(
    () => sortedGroups.flatMap((group) => (
      systemMap.nodes.filter((node) => node.groupId === group.id)
    )),
    [sortedGroups, systemMap.nodes],
  );
  const nodeById = useMemo(
    () => new Map(systemMap.nodes.map((node) => [node.id, node])),
    [systemMap.nodes],
  );
  const groupById = useMemo(
    () => new Map(systemMap.groups.map((group) => [group.id, group])),
    [systemMap.groups],
  );
  const primaryNodeIds = useMemo(
    () => new Set(chapterMap.primaryNodeIds),
    [chapterMap.primaryNodeIds],
  );
  const relatedNodeIds = useMemo(
    () => new Set(chapterMap.relatedNodeIds),
    [chapterMap.relatedNodeIds],
  );
  const activeEdgeIds = useMemo(
    () => new Set(chapterMap.activeEdgeIds),
    [chapterMap.activeEdgeIds],
  );
  const activeEdges = useMemo(
    () => systemMap.edges.filter((edge) => activeEdgeIds.has(edge.id)),
    [activeEdgeIds, systemMap.edges],
  );

  const [selectedNodeId, setSelectedNodeId] = useState(
    chapterMap.primaryNodeIds[0] ?? systemMap.nodes[0]?.id ?? null,
  );
  const [edgePaths, setEdgePaths] = useState([]);
  const stageRef = useRef(null);
  const nodeRefs = useRef(new Map());

  const setNodeRef = useCallback((nodeId, element) => {
    if (element) {
      nodeRefs.current.set(nodeId, element);
    } else {
      nodeRefs.current.delete(nodeId);
    }
  }, []);

  const measureEdges = useCallback(() => {
    const stageElement = stageRef.current;

    if (!stageElement) {
      return;
    }

    const stageRect = stageElement.getBoundingClientRect();
    const nextPaths = systemMap.edges.flatMap((edge) => {
      const fromElement = nodeRefs.current.get(edge.from);
      const toElement = nodeRefs.current.get(edge.to);

      if (!fromElement || !toElement) {
        return [];
      }

      return [{
        ...edge,
        path: getEdgePath(fromElement, toElement, stageRect),
        active: activeEdgeIds.has(edge.id),
      }];
    });

    setEdgePaths(nextPaths);
  }, [activeEdgeIds, systemMap.edges]);

  useEffect(() => {
    let frameId = window.requestAnimationFrame(measureEdges);
    const handleResize = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(measureEdges);
    };
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(handleResize);

    if (stageRef.current) {
      resizeObserver?.observe(stageRef.current);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [measureEdges]);

  const focusNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    nodeRefs.current.get(nodeId)?.focus();
  };

  const handleNodeKeyDown = (event, nodeId) => {
    const currentIndex = orderedNodes.findIndex((node) => node.id === nodeId);
    let nextIndex = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % orderedNodes.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + orderedNodes.length) % orderedNodes.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = orderedNodes.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      focusNode(orderedNodes[nextIndex].id);
    }
  };

  const selectedNode = nodeById.get(selectedNodeId) ?? orderedNodes[0];
  const selectedNodeState = selectedNode
    ? getNodeState(selectedNode.id, primaryNodeIds, relatedNodeIds)
    : 'context';
  const selectedConnections = selectedNode
    ? systemMap.edges.filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id)
    : [];

  return (
    <div className="cv2-system-map">
      <div className="cv2-system-map__summary">
        <p>
          <strong>{systemMap.groups.length}개 영역</strong>
          <span aria-hidden="true">·</span>
          <strong>{systemMap.nodes.length}개 요소</strong>
          <span aria-hidden="true">·</span>
          <strong>{activeEdges.length}개 연결 강조</strong>
        </p>
        <div className="cv2-system-map__legend" aria-label="지도 범례">
          <span><i className="cv2-map-key cv2-map-key--primary" />Chapter 핵심</span>
          <span><i className="cv2-map-key cv2-map-key--related" />함께 볼 영역</span>
          <span><i className="cv2-map-key cv2-map-key--context" />전체 배경</span>
        </div>
      </div>

      <p className="cv2-system-map__help" id="system-map-help">
        요소를 선택하면 연결 정보를 볼 수 있습니다. 키보드에서는 방향키나 Home, End 키로 이동할 수 있습니다.
      </p>

      <div
        className="cv2-system-map__stage"
        ref={stageRef}
        aria-describedby="system-map-help"
      >
        <svg
          className="cv2-system-map__edges"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          <defs>
            <marker id="cv2-map-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
            <marker id="cv2-map-arrow-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 8 4 L 0 8 z" />
            </marker>
          </defs>
          {edgePaths.map((edge) => (
            <path
              key={edge.id}
              className={'cv2-system-map__edge' + (edge.active ? ' cv2-system-map__edge--active' : '')}
              d={edge.path}
              data-edge-id={edge.id}
              data-edge-active={edge.active ? 'true' : 'false'}
              markerEnd={edge.active ? 'url(#cv2-map-arrow-active)' : 'url(#cv2-map-arrow)'}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <div className="cv2-system-map__groups">
          {sortedGroups.map((group) => {
            const groupNodes = orderedNodes.filter((node) => node.groupId === group.id);

            return (
              <section className="cv2-map-group" key={group.id} aria-labelledby={`map-group-${group.id}`}>
                <div className="cv2-map-group__heading">
                  <h3 id={`map-group-${group.id}`}>{group.label}</h3>
                  <span>{groupNodes.length}</span>
                </div>
                <ul className="cv2-map-group__nodes">
                  {groupNodes.map((node) => {
                    const nodeState = getNodeState(node.id, primaryNodeIds, relatedNodeIds);
                    const isSelected = selectedNodeId === node.id;

                    return (
                      <li key={node.id}>
                        <button
                          className={`cv2-map-node cv2-map-node--${nodeState}`}
                          type="button"
                          ref={(element) => setNodeRef(node.id, element)}
                          data-map-node-id={node.id}
                          data-node-state={nodeState}
                          aria-label={`${node.label}, ${NODE_STATE_LABELS[nodeState]}`}
                          aria-pressed={isSelected}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => setSelectedNodeId(node.id)}
                          onFocus={() => setSelectedNodeId(node.id)}
                          onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
                        >
                          <span className="cv2-map-node__dot" aria-hidden="true" />
                          <span>{node.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      {selectedNode && (
        <aside className="cv2-system-map__detail" aria-live="polite">
          <div>
            <span className={`cv2-map-detail-state cv2-map-detail-state--${selectedNodeState}`}>
              {NODE_STATE_LABELS[selectedNodeState]}
            </span>
            <h3>{selectedNode.label}</h3>
            <p>{groupById.get(selectedNode.groupId)?.label}</p>
          </div>
          <div className="cv2-system-map__connections">
            <strong>직접 연결</strong>
            {selectedConnections.length > 0 ? (
              <ul>
                {selectedConnections.map((edge) => (
                  <li key={edge.id} className={activeEdgeIds.has(edge.id) ? 'is-active' : ''}>
                    <span>{nodeById.get(edge.from)?.label}</span>
                    <span aria-label="에서">→</span>
                    <span>{nodeById.get(edge.to)?.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>이 지도에 등록된 직접 연결이 아직 없습니다.</p>
            )}
          </div>
        </aside>
      )}

      <section className="cv2-system-map__flow" aria-labelledby="active-flow-title">
        <div>
          <p className="cv2-eyebrow">Active Flow</p>
          <h3 id="active-flow-title">이번 Chapter에서 따라갈 연결</h3>
        </div>
        <ol>
          {activeEdges.map((edge) => (
            <li key={edge.id}>
              <span>{nodeById.get(edge.from)?.label}</span>
              <span aria-hidden="true">→</span>
              <span>{nodeById.get(edge.to)?.label}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default SystemMap;
