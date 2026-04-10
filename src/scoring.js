import { axisMeta, quizQuestions } from './quiz-data.js'
import { indexedResults } from './results.js'

const axisOrder = ['A', 'B', 'C', 'D', 'E', 'F']

export function scoreAnswer(answer, reverse) {
  return reverse ? 6 - answer : answer
}

export function getAxisScores(answers, questions = quizQuestions) {
  const axisScores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 }

  questions.forEach((question, index) => {
    const rawAnswer = answers[index]

    if (!Number.isInteger(rawAnswer)) {
      return
    }

    axisScores[question.axis] += scoreAnswer(rawAnswer, question.reverse)
  })

  return axisScores
}

export function axisBit(score, tieRawAnswer) {
  if (score <= 23) {
    return 0
  }

  if (score >= 25) {
    return 1
  }

  return tieRawAnswer >= 4 ? 1 : 0
}

export function getAxisBreakdown(axisScores, answers) {
  return axisOrder.map((axis) => {
    const meta = axisMeta[axis]
    const tieBreakerQuestionId = meta.tieBreakerQuestionId
    const tieRawAnswer = answers[tieBreakerQuestionId - 1]
    const score = axisScores[axis]
    const bit = axisBit(score, tieRawAnswer)

    return {
      axis,
      title: meta.title,
      score,
      bit,
      label: bit === 0 ? meta.lowLabel : meta.highLabel,
      tied: score === 24,
      tieBreakerQuestionId,
      tieRawAnswer,
    }
  })
}

export function getResultIndex(axisScores, answers) {
  const [A, B, C, D, E, F] = getAxisBreakdown(axisScores, answers).map((item) => item.bit)
  return A * 32 + B * 16 + C * 8 + D * 4 + E * 2 + F
}

export function getFinalResult(answers, questions = quizQuestions, resultList = indexedResults) {
  const axisScores = getAxisScores(answers, questions)
  const axisBreakdown = getAxisBreakdown(axisScores, answers)
  const index = getResultIndex(axisScores, answers)

  return {
    axisScores,
    axisBreakdown,
    binaryIndex: axisBreakdown.map((item) => item.bit).join(''),
    index,
    result: resultList[index],
  }
}

export function getAnsweredCount(answers) {
  return answers.filter((answer) => Number.isInteger(answer)).length
}

export function isQuizComplete(answers) {
  return getAnsweredCount(answers) === quizQuestions.length
}

export function getFirstUnansweredIndex(answers) {
  return answers.findIndex((answer) => !Number.isInteger(answer))
}
