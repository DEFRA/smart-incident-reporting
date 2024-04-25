import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_DAILY_LIFE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const onGoingAnswer = request.yar.get(constants.redisKeys.SMELL_ONGOING)
    const onGoing = onGoingAnswer && onGoingAnswer[0].answerId === questionSets.SMELL.questions.SMELL_ONGOING.answers.yes.answerId
    return h.view(constants.views.SMELL_EFFECT_ON_DAILY_LIFE, {
      ...getContext(),
      onGoing
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE, buildAnswers(request.payload))

    return h.redirect(constants.routes.SMELL_EFFECT_ON_HEALTH)
  }
}

const getContext = () => {
  return {
    question
  }
}

const buildAnswers = payload => {
  const answers = []
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
      answerId: question.answers.noActions.answerId
    })
  }

  return answers
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE,
    handler: handlers.post
  }
]
