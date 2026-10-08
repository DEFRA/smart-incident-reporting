import constants from '../../utils/constants.js'
import bngToNgr from '../../utils/bng-to-ngr.js' 
import { questionSets } from '../../utils/question-sets.js'
import { oSGBToWGS84 } from '../../utils/transform-point.js'

const question = questionSets.FLOOD.questions.FLOOD_LOCATION_MAP
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.FLOOD_LOCATION_MAP, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { point } = request.payload

    point = point && JSON.parse(point)

    if (!point || point.length === 0) {
      // Handle the case where the point is not provided or empty
      return h.view(constants.views.FLOOD_LOCATION_MAP, {
        ...getContext(request),
        noPoint: true
      })
    }

      const lngLat = oSGBToWGS84(point) 
      request.yar.set(question.key, buildAnswer(point,lngLat))
    return h.redirect(constants.routes.NEXT_STEP) // Replace '/next-step' with the actual next step URL
  }
}

  const getContext = (request) => {
    const locationOption = request.yar.get(constants.views.FLOOD_LOCATION_OPTION)
    const showCurrentLocation = locationOption?.[0]?.answerId === questionSets.FLOOD.questions.FLOOD_LOCATION_OPTION.answers.gps.answerId
    const location = request.yar.get(constants.redisKeys.FLOOD_LOCATION_MAP)
    const locationAnswer = location && { 
      point: [Number(location[1].otherDetails), Number(location[2].otherDetails)], zoom: 10
    }
    return {
      question,
      showCurrentLocation,
      locationAnswer
    }
  }

  const buildAnswer = (point, lngLat) => {
    const ngr = bngToNrg(point).text
    const six = 6
    return [{
      ...baseAnswer,
      answerId: question.answers.map.nationGridReference.answerId,
      otherDetails: ngr
    }, {
      ...baseAnswer,
      answerId:  question.answers.easting.answerId,
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
    path: constants.routes.FLOOD_LOCATION_MAP,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.FLOOD_LOCATION_MAP,
    handler: handlers.post
  }
]
