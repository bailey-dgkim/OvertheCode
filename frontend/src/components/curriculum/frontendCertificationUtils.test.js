import { describe, expect, it } from 'vitest';
import {
  FRONTEND_CERTIFICATION_QUESTIONS,
  FRONTEND_CERTIFICATION_REQUIRED_IDS,
} from '../../content/v2/frontend-certification';
import {
  evaluateFrontendCertification,
  isCertificationAnswerCorrect,
} from './frontendCertificationUtils';

function correctAnswers() {
  return Object.fromEntries(FRONTEND_CERTIFICATION_QUESTIONS.map((question) => [
    question.id,
    question.type === 'sequence' ? question.correctOrder : question.correctChoiceId,
  ]));
}

describe('프론트엔드 인증 퀴즈 채점', () => {
  it('15문항의 정답을 모두 판정한다', () => {
    const answers = correctAnswers();
    const evaluation = evaluateFrontendCertification(answers);

    expect(evaluation.correctCount).toBe(15);
    expect(evaluation.total).toBe(15);
    expect(evaluation.requiredPassed).toBe(true);
    expect(evaluation.passed).toBe(true);
  });

  it('순서 문제는 모든 항목의 위치가 맞아야 정답이다', () => {
    const question = FRONTEND_CERTIFICATION_QUESTIONS.find(({ id }) => id === 'q15');

    expect(isCertificationAnswerCorrect(question, question.correctOrder)).toBe(true);
    expect(isCertificationAnswerCorrect(question, [...question.correctOrder].reverse())).toBe(false);
  });

  it('총점이 충분해도 필수 판단을 틀리면 통과하지 못한다', () => {
    const answers = correctAnswers();
    FRONTEND_CERTIFICATION_REQUIRED_IDS.forEach((questionId) => {
      const question = FRONTEND_CERTIFICATION_QUESTIONS.find(({ id }) => id === questionId);
      answers[questionId] = question.type === 'sequence'
        ? [...question.correctOrder].reverse()
        : question.choices.find(({ id }) => id !== question.correctChoiceId).id;
    });

    const evaluation = evaluateFrontendCertification(answers);

    expect(evaluation.correctCount).toBe(13);
    expect(evaluation.requiredPassed).toBe(false);
    expect(evaluation.passed).toBe(false);
  });
});

