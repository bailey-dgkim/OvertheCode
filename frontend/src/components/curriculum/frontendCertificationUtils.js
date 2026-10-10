import {
  FRONTEND_CERTIFICATION_CATEGORIES,
  FRONTEND_CERTIFICATION_PASSING_SCORE,
  FRONTEND_CERTIFICATION_QUESTIONS,
  FRONTEND_CERTIFICATION_REQUIRED_IDS,
} from '../../content/v2/frontend-certification';

export function isCertificationAnswerCorrect(question, answer) {
  if (question.type === 'sequence') {
    return Array.isArray(answer)
      && answer.length === question.correctOrder.length
      && answer.every((itemId, index) => itemId === question.correctOrder[index]);
  }

  return answer === question.correctChoiceId;
}

export function evaluateFrontendCertification(answers) {
  const results = FRONTEND_CERTIFICATION_QUESTIONS.map((question) => ({
    question,
    correct: isCertificationAnswerCorrect(question, answers[question.id]),
  }));
  const correctCount = results.filter((result) => result.correct).length;
  const requiredPassed = FRONTEND_CERTIFICATION_REQUIRED_IDS.every((questionId) => (
    results.find((result) => result.question.id === questionId)?.correct
  ));
  const categoryResults = Object.entries(FRONTEND_CERTIFICATION_CATEGORIES).map(([id, label]) => {
    const categoryQuestions = results.filter((result) => result.question.category === id);
    return {
      id,
      label,
      correct: categoryQuestions.filter((result) => result.correct).length,
      total: categoryQuestions.length,
    };
  });

  return {
    categoryResults,
    correctCount,
    passed: correctCount >= FRONTEND_CERTIFICATION_PASSING_SCORE && requiredPassed,
    requiredPassed,
    results,
    total: results.length,
  };
}

export function getCertificationAnswerText(question, answer) {
  if (question.type === 'sequence') {
    const itemById = new Map(question.items.map((item) => [item.id, item.text]));
    return Array.isArray(answer)
      ? answer.map((itemId) => itemById.get(itemId)).filter(Boolean).join(' → ')
      : '응답하지 않음';
  }

  return question.choices.find((choice) => choice.id === answer)?.text ?? '응답하지 않음';
}

export function getCertificationCorrectAnswerText(question) {
  return question.type === 'sequence'
    ? getCertificationAnswerText(question, question.correctOrder)
    : getCertificationAnswerText(question, question.correctChoiceId);
}

