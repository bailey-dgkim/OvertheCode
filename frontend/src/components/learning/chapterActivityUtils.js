export function sameIdSet(left = [], right = []) {
  return left.length === right.length && left.every((id) => right.includes(id));
}

export function isSequenceCorrect(items = [], correctOrder = []) {
  return items.length === correctOrder.length
    && items.every((item, index) => item.id === correctOrder[index]);
}

export function getMapCandidateIds(activity, chapterMap) {
  return [...new Set([
    ...(chapterMap?.primaryNodeIds ?? []),
    ...(chapterMap?.relatedNodeIds ?? []),
    ...(activity.correctNodeIds ?? []),
  ])];
}
