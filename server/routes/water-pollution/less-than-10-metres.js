import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LESS_THAN_10_METRES

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_LESS_THAN_10_METRES, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_LESS_THAN_10_METRES, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_LESS_THAN_10_METRES, buildAnswers(answerId))

    // handle redirects
    const refValue = request.yar.get(constants.redisKeys.REFERER)
    if (refValue) {
      if (answerId === question.answers.no.answerId) {
        request.yar.clear(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)
        return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_LENGTH)
      } else {
        request.yar.clear(constants.redisKeys.WATER_POLLUTION_POLLUTION_LENGTH)
        request.yar.clear(constants.redisKeys.WATER_POLLUTION_POLLUTION_AREA)
        return h.redirect(request.yar.get(constants.redisKeys.REFERER))
      }
    } else if (answerId === question.answers.no.answerId) {
      return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_LENGTH)
    } else {
      return h.redirect(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
    }
  }
}

const getContext = request => {
  const waterFeature = constants.waterFeatureLabels[request.yar.get(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE)[0].answerId]
  const answers = request.yar.get(question.key)
  return {
    question,
    waterFeature,
    answers
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select yes if the pollution spreads less than 10 metres',
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
    path: constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES,
    handler: handlers.post
  }
]
