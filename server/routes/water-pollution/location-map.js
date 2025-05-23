import constants from '../../utils/constants.js'
import bngToNgr from '../../utils/bng-to-ngr.js'
import { questionSets } from '../../utils/question-sets.js'
import { oSGBToWGS84 } from '../../utils/transform-point.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LOCATION_MAP
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_LOCATION_MAP, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { point } = request.payload

    point = point && JSON.parse(point)

    if (!point || point.length === 0) {
      return h.view(constants.views.WATER_POLLUTION_LOCATION_MAP, {
        ...getContext(request),
        noPoint: true
      })
    }

    const lngLat = oSGBToWGS84(point)

    request.yar.set(question.key, buildAnswers(point, lngLat))

    // handle redirects
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_WHEN)
  }
}

const getContext = request => {
  const location = request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_MAP)
  const locationAnswer = location && {
    point: [Number(location[1].otherDetails), Number(location[2].otherDetails)],
    zoom: 10
  }

  return {
    question,
    locationAnswer
  }
}

const buildAnswers = (point, lngLat) => {
  const ngr = bngToNgr(point).text
  const six = 6
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
    otherDetails: lngLat[0].toFixed(six)
  }, {
    ...baseAnswer,
    answerId: question.answers.lat.answerId,
    otherDetails: lngLat[1].toFixed(six)
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
