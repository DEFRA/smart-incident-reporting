import constants from '../../utils/constants.js'
import bngToNgr from '../../utils/bng-to-ngr.js'
import { questionSets } from '../../utils/question-sets.js'
import { oSGBToWGS84 } from '../../utils/transform-point.js'

const question = questionSets.SMELL.questions.SMELL_LOCATION_MAP
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_LOCATION_MAP, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { point } = request.payload

    point = point && JSON.parse(point)

    if (!point || point.length === 0) {
      return h.view(constants.views.SMELL_LOCATION_MAP, {
        ...getContext(),
        noPoint: true
      })
    }

    const lngLat = oSGBToWGS84(point)

    request.yar.set(constants.redisKeys.SMELL_LOCATION_MAP, buildAnswers(point, lngLat))

    // handle redirects
    return h.redirect(constants.routes.SMELL_PREVIOUS)
  }
}

const getContext = () => {
  return {
    question
  }
}

const buildAnswers = (point, lngLat) => {
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
  }, {
    ...baseAnswer,
    answerId: question.answers.lng.answerId,
    otherDetails: lngLat[0].toFixed(6)
  }, {
    ...baseAnswer,
    answerId: question.answers.lat.answerId,
    otherDetails: lngLat[1].toFixed(6)
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_LOCATION_MAP,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_LOCATION_MAP,
    handler: handlers.post
  }
]
