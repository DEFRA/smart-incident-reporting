import constants from '../../utils/constants.js'
import bngToNgr from '../../utils/bng-to-ngr.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LOCATION_MAP
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.WATER_POLLUTION_LOCATION_MAP, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { point } = request.payload

    point = point && JSON.parse(point)

    if (!point || point.length === 0) {
      return h.view(constants.views.WATER_POLLUTION_LOCATION_MAP, {
        ...getContext(),
        noPoint: true
      })
    }

    request.yar.set(constants.redisKeys.WATER_POLLUTION_LOCATION_MAP, buildAnswers(point))

    // handle redirects
    return h.redirect(constants.routes.WATER_POLLUTION_WHEN)
  }
}

const getContext = () => {
  return {
    question
  }
}

const buildAnswers = point => {
  const ngr = bngToNgr(point).text
  return [{
    ...baseAnswer,
    answerId: question.answers.nationalGridReference.answerId,
    otherDetails: ngr
  }, {
    ...baseAnswer,
    answerId: question.answers.easting.answerId,
    otherDetails: Math.floor(point[0]).toString()
  }, {
    ...baseAnswer,
    answerId: question.answers.northing.answerId,
    otherDetails: Math.floor(point[1]).toString()
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
