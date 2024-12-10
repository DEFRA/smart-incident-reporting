import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_AREA

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_POLLUTION_AREA, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_POLLUTION_AREA, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA, buildAnswers(answerId))

    // handle redirection
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
  }
}

const buildAnswers = answerId => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })
  return answers
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select your estimated area, or that you do not know',
      href: '#answerId'
    })
  }
  return errorSummary
}
export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_POLLUTION_AREA,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_POLLUTION_AREA,
    handler: handlers.post
  }
]
