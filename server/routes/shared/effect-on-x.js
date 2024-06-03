import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'

const buildAnswers = (question, payload) => {
  const answers = []
  const baseAnswer = {
    questionId: question.questionId,
    questionAsked: question.text,
    questionResponse: true
  }
  let { effect, otherDetails } = payload

  if (effect && !Array.isArray(effect)) {
    effect = [effect]
  }

  effect?.forEach(item => {
    answers.push({
      ...baseAnswer,
      answerId: Number(item)
    })
    if (Number(item) === question.answers.other.answerId) {
      answers.push({
        ...baseAnswer,
        answerId: question.answers.otherDetails.answerId,
        otherDetails
      })
    }
  })
  if (answers.length === 0) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.noneOfThese.answerId
    })
  }

  return answers
}

const getHandler = (question, view) => {
  return async (request, h) => {
    const onGoingAnswer = request.yar.get(constants.redisKeys.SMELL_ONGOING)
    const onGoing = onGoingAnswer && onGoingAnswer[0].answerId === questionSets.SMELL.questions.SMELL_ONGOING.answers.yes.answerId
    return h.view(view, {
      question,
      onGoing
    })
  }
}

const postHandler = (question, route, key) => {
  return async (request, h) => {
    request.yar.set(key, buildAnswers(question, request.payload))
    return h.redirect(route)
  }
}

export {
  getHandler,
  postHandler
}
