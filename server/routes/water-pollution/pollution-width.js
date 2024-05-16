import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_WIDTH

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_POLLUTION_WIDTH, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId, request)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_POLLUTION_WIDTH, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_POLLUTION_WIDTH, buildAnswers(answerId))

    return h.redirect(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
  }
}

const getContext = request => {
  const waterFeature = constants.waterFeatureLabels[request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)[0].answerId]
  return {
    question,
    waterFeature
  }
}

const validatePayload = (answerId, request) => {
  const errorSummary = getErrorSummary()
  const waterFeature = constants.waterFeatureLabels[request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)[0].answerId]
  if (!answerId) {
    errorSummary.errorList.push({
      text: `Select yes if there's pollution along both sides of the ${waterFeature}`,
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
    path: constants.routes.WATER_POLLUTION_POLLUTION_WIDTH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_POLLUTION_WIDTH,
    handler: handlers.post
  }
]
