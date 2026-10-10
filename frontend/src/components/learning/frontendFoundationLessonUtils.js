function areLessonMatchesCorrect(answers, expectedAnswers) {
  return Object.entries(expectedAnswers).every(
    ([questionId, answer]) => answers[questionId] === answer,
  );
}

export { areLessonMatchesCorrect };
