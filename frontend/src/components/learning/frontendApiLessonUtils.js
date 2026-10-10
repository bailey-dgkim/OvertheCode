function isApiInterpretationCorrect(answer) {
  return answer === 'patch-order-status';
}

function areEndpointMatchesCorrect(matches, expectedMatches) {
  return Object.entries(expectedMatches).every(
    ([endpointId, actionId]) => matches[endpointId] === actionId,
  );
}

export { areEndpointMatchesCorrect, isApiInterpretationCorrect };
