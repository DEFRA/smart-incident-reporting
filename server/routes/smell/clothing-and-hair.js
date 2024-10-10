import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.SMELL.questions.SMELL_CLOTHING_AND_HAIR

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_CLOTHING_AND_HAIR, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload
    const { current } = getContext(request)

    // validate payload for errors
    const errorSummary = validatePayload(answerId, current)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_CLOTHING_AND_HAIR, {
        question,
        current,
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.SMELL_CLOTHING_AND_HAIR, buildAnswers(answerId))

    return h.redirect(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
  }
}

const getContext = request => {
  const currentAnswer = request.yar.get(constants.redisKeys.SMELL_INDOORS)
  const current = currentAnswer && currentAnswer[0].answerId === questionSets.SMELL.questions.SMELL_INDOORS.answers.yes.answerId
  return {
    question,
    current
  }
}

const validatePayload = (answerId, current) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: `Select yes if the smell ${current ? 'sticks' : 'stuck'} to your clothing or hair`,
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswers = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_CLOTHING_AND_HAIR,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_CLOTHING_AND_HAIR,
    handler: handlers.post
  }
]
