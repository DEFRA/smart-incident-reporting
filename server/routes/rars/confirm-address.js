import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import bngToNgr from '../../utils/bng-to-ngr.js'
import { oSGBToWGS84 } from '../../utils/transform-point.js'

const addressQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
const locationMapQuestion = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_MAP

const createConfirmAddressRoutes = ({ route, redirect }) => {
  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_CONFIRM_ADDRESS, {
        ...getContext(request, redirect.chooseAddress, redirect.locationAddress)
      })
    },
    post: async (request, h) => {
      const { selectedAddress } = request.yar.get(constants.redisKeys.RARS_CONFIRM_ADDRESS)
      const point = [selectedAddress[0].x, selectedAddress[0].y]
      request.yar.set(constants.redisKeys.RARS_LOCATION_ADDRESS, buildAddressAnswers(selectedAddress))
      request.yar.set(constants.redisKeys.RARS_LOCATION_MAP, buildLocationAnswers(point))

      return h.redirect(redirect.description)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = (request, chooseAddress, locationAddress) => {
  const { selectedAddress } = request.yar.get(constants.redisKeys.RARS_CONFIRM_ADDRESS)
  const addressData = selectedAddress[0].address
  const { addressLine1, addressLine2, townOrCity, postcode } = formatAddress(addressData)
  return {
    addressLine1,
    addressLine2,
    townOrCity,
    postcode,
    chooseAddress,
    enterAddress: locationAddress
  }
}

const formatAddress = (address) => {
  const MAX_LINE_LENGTH = 60
  const addressParts = address.split(',').map(p => p.trim())
  const n = 2

  const baseSegments = addressParts.slice(0, -n)
  const townOrCity = addressParts[addressParts.length - 2]
  const postcode = addressParts[addressParts.length - 1]

  let addressLine1 = ''
  let addressLine2 = ''

  const joinSegment = (line, segment) => line + (line ? ', ' : '') + segment

  for (const segment of baseSegments) {
    const nextLine = joinSegment(addressLine1, segment)
    if (nextLine.length <= MAX_LINE_LENGTH) {
      addressLine1 = nextLine
    } else {
      addressLine2 = joinSegment(addressLine2, segment)
    }
  }

  return {
    addressLine1,
    addressLine2: addressLine2 || null,
    townOrCity,
    postcode
  }
}

const buildAddressAnswers = (selectedAddress) => {
  const baseAnswer = {
    questionId: addressQuestion.questionId,
    questionAsked: addressQuestion.text,
    questionResponse: true
  }
  const addressData = selectedAddress[0].address
  const { addressLine1, addressLine2, townOrCity, postcode } = formatAddress(addressData)
  return [{
    ...baseAnswer,
    answerId: addressQuestion.answers.addressLine1.answerId,
    otherDetails: addressLine1
  }, {
    ...baseAnswer,
    answerId: addressQuestion.answers.addressLine2.answerId,
    otherDetails: addressLine2 || ''
  }, {
    ...baseAnswer,
    answerId: addressQuestion.answers.townOrCity.answerId,
    otherDetails: townOrCity
  }, {
    ...baseAnswer,
    answerId: addressQuestion.answers.county.answerId,
    otherDetails: ''
  }, {
    ...baseAnswer,
    answerId: addressQuestion.answers.postcode.answerId,
    otherDetails: postcode
  }]
}

const buildLocationAnswers = (point) => {
  const baseAnswer = {
    questionId: locationMapQuestion.questionId,
    questionAsked: locationMapQuestion.text,
    questionResponse: true
  }

  const ngr = bngToNgr(point).text
  const lngLat = oSGBToWGS84(point)
  const six = 6
  return [{
    ...baseAnswer,
    answerId: locationMapQuestion.answers.nationalGridReference.answerId,
    otherDetails: ngr
  }, {
    ...baseAnswer,
    answerId: locationMapQuestion.answers.easting.answerId,
    otherDetails: Math.floor(point[0]).toString()
  }, {
    ...baseAnswer,
    answerId: locationMapQuestion.answers.northing.answerId,
    otherDetails: Math.floor(point[1]).toString()
  }, {
    ...baseAnswer,
    answerId: locationMapQuestion.answers.lng.answerId,
    otherDetails: lngLat[0].toFixed(six)
  }, {
    ...baseAnswer,
    answerId: locationMapQuestion.answers.lat.answerId,
    otherDetails: lngLat[1].toFixed(six)
  }]
}

export default createConfirmAddressRoutes
