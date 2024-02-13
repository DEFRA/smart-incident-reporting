import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = constants.questions.WATER_POLLUTION_POLLUTION_LENGTH

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_POLLUTION_LENGTH, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_POLLUTION_LENGTH, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH, buildAnswers(answerId))

    // handle redirection
    return h.redirect(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
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
  const waterFeature = constants.waterFeatureLabels[request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)[0].answerId]
  return {
    question,
    waterFeature
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select your estimated length, or that you do not know',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_POLLUTION_LENGTH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_POLLUTION_LENGTH,
    handler: handlers.post
  }
]
