import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
import { findByPostcode } from '../../services/find-location.js'
import { findSitesNearby } from '../../services/nearby-sites.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
const { postcodeRegExp } = constants

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createLocationAddressRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_LOCATION_ADDRESS, {
        ...serviceDetails,
        question
      })
    },
    post: async (request, h) => {
      if (request.payload.postcode) {
        request.payload.postcode = request.payload.postcode.replace(/[^\w\s]/gi, '')
      }

      const errorSummary = validatePayload(request.payload)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_ADDRESS, {
          question,
          errorSummary,
          ...serviceDetails,
          ...request.payload
        })
      }

      request.yar.set(constants.redisKeys.RARS_LOCATION_ADDRESS, buildAnswers(request.payload))
      request.yar.set(constants.redisKeys.RARS_NEARBY_SITES, [])

      const { payload: postcodeResults } = await findByPostcode(request.payload.postcode)
      const addressPoint = findAddressPoint(request.payload, postcodeResults.results || [])

      if (addressPoint) {
        const point = [Number(addressPoint.X_COORDINATE), Number(addressPoint.Y_COORDINATE)]
        if (point.every(Number.isFinite)) {
          const nearbySites = await findSitesNearby(...point)
          request.yar.set(constants.redisKeys.RARS_NEARBY_SITES, nearbySites)
        }
      }

      return h.redirect(redirect.chooseSite)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const findAddressPoint = (payload, results) => {
  const normalize = value => (value || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const addressLine1 = normalize(payload.addressLine1)
  const addressLine2 = normalize(payload.addressLine2)
  const townOrCity = normalize(payload.townOrCity)
  const postcode = normalize(payload.postcode)
  const postcodeAddresses = results
    .map(result => result.DPA)
    .filter(address => address && normalize(address.POSTCODE) === postcode)
  const candidates = postcodeAddresses.filter(address => normalize(address.ADDRESS).includes(addressLine1))

  return candidates.find(address => {
    const fullAddress = normalize(address.ADDRESS)
    return (!addressLine2 || fullAddress.includes(addressLine2)) && (!townOrCity || fullAddress.includes(townOrCity))
  }) || candidates[0] || (postcodeAddresses.length === 1 ? postcodeAddresses[0] : undefined)
}

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  if (!payload.addressLine1) {
    errorSummary.errorList.push({
      text: 'Enter the first line of the address, for example house number and street',
      href: '#addressLine1'
    })
  }
  if (!payload.townOrCity) {
    errorSummary.errorList.push({
      text: 'Enter a town or city',
      href: '#townOrCity'
    })
  }
  if (!payload.postcode) {
    errorSummary.errorList.push({
      text: 'Enter a postcode',
      href: '#postcode'
    })
  } else if (!postcodeRegExp.test(payload.postcode)) {
    errorSummary.errorList.push({
      text: 'Enter a full postcode, for example W1 8QS',
      href: '#postcode'
    })
  } else {
    // do nothing
  }
  return errorSummary
}

const buildAnswers = payload => {
  const answers = []
  Object.keys(payload).forEach(key => {
    answers.push({
      ...baseAnswer,
      answerId: question.answers[key].answerId,
      otherDetails: payload[key]
    })
  })
  return answers
}

export default createLocationAddressRoutes
