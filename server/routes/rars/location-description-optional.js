import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'
import { findSitesNearby } from '../../services/nearby-sites.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_DESCRIPTION_OPTIONAL

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const createLocationDescriptionOptionalRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_LOCATION_DESCRIPTION_OPTIONAL, {
        problem,
        ...serviceDetails,
        ...getContext(request)
      })
    },
    post: async (request, h) => {
      const { otherLocationInfo } = request.payload

      const errorSummary = validatePayload(otherLocationInfo)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_DESCRIPTION_OPTIONAL, {
          problem,
          ...serviceDetails,
          question,
          answers: otherLocationInfo,
          errorSummary
        })
      }

      if (otherLocationInfo) {
        request.yar.set(question.key, buildAnswers(otherLocationInfo))
      }
      const locationMap = request.yar.get(constants.redisKeys.RARS_LOCATION_MAP) || []
      const easting = locationMap[1]?.otherDetails
      const northing = locationMap[2]?.otherDetails
      const point = [Number(easting), Number(northing)]

      request.yar.set(constants.redisKeys.RARS_NEARBY_SITES, [])
      if (easting && northing && point.every(Number.isFinite)) {
        const nearbySites = await findSitesNearby(...point)
        request.yar.set(constants.redisKeys.RARS_NEARBY_SITES, nearbySites)
      }

      return h.redirect(redirect.chooseSite)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers: answers?.[0]?.otherDetails
  }
}

const buildAnswers = (otherDetails) => {
  return [{
    ...baseAnswer,
    otherDetails
  }]
}

const validatePayload = otherLocationInfo => {
  const errorSummary = getErrorSummary()
  if (maxLength(otherLocationInfo, constants.locationDescriptionCharacterLimit)) {
    errorSummary.errorList.push({
      text: `Other location information must be ${constants.locationDescriptionCharacterLimit} characters or less`,
      href: '#otherLocationInfo'
    })
  }
  return errorSummary
}

export default createLocationDescriptionOptionalRoutes
