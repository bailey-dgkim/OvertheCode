export function isCorrectSequence(items = [], correctOrder = []) {
  return items.length === correctOrder.length
    && items.every((item, index) => item.id === correctOrder[index]);
}
