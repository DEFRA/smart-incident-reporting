import constants from '../../utils/constants.js'
import bngToNgr from '../../utils/bng-to-ngr.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LOCATION_MAP
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.nationalGridReference.answerId
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_LOCATION_MAP),
  post: async (request, h) => {
    let { point } = request.payload

    point = JSON.parse(point)

    if (!point || point.length === 0) {
      return h.view(constants.views.WATER_POLLUTION_LOCATION_MAP, {
        noPoint: true
      })
    }

    request.yar.set(constants.redisKeys.WATER_POLLUTION_WHEN, buildAnswers(bngToNgr(point).text))

    // handle redirects
    return h.redirect(constants.routes.WATER_POLLUTION_WHEN)
  }
}

const buildAnswers = ngr => {
  return [{
    ...baseAnswer,
    nationalGridReference: ngr
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_LOCATION_MAP,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_LOCATION_MAP,
    handler: handlers.post
  }
]
