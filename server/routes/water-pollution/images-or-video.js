import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO
const waterFeatureQuestion = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_WATER_FEATURE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
        ...getContext(request),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO, buildAnswers(answerId))

    // handle redirects
    const waterFeatureAnswer = request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)
    if (waterFeatureAnswer[0].answerId === waterFeatureQuestion.answers.lakeOrReservoir.answerId || waterFeatureAnswer[0].answerId === waterFeatureQuestion.answers.sea.answerId) {
      return h.redirect(constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)
    } else {
      return h.redirect(constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES)
    }
  }
}

const getContext = (request) => {
  const { reporterEmailAddress } = request.yar.get(constants.redisKeys.HOME)
  return {
    question,
    reporterEmailAddress
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select yes if you want to send us any images or videos',
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
    path: constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO,
    handler: handlers.post
  }
]
