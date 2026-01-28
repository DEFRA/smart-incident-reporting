import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import bngToNgr from '../../utils/bng-to-ngr.js'
import { oSGBToWGS84 } from '../../utils/transform-point.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_CONFIRM_ADDRESS, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { selectedAddress } = request.yar.get(constants.redisKeys.SMELL_CONFIRM_ADDRESS)
    const point = [selectedAddress[0].x, selectedAddress[0].y]
    request.yar.set(constants.redisKeys.SMELL_LOCATION_ADDRESS, buildAddressAnswers(selectedAddress))
    request.yar.set(constants.redisKeys.SMELL_LOCATION_MAP, buildLocationAnswers(point))

    // handle redirects
    return h.redirect(constants.routes.SMELL_DESCRIPTION)
  }
}

const getContext = (request) => {
  const { selectedAddress } = request.yar.get(constants.redisKeys.SMELL_CONFIRM_ADDRESS)
  const addressData = selectedAddress[0].address
  const { addressLine1, addressLine2, townOrCity, postcode } = formatAddress(addressData)
  return {
    addressLine1,
    addressLine2,
    townOrCity,
    postcode,
    enterAddress: constants.routes.SMELL_LOCATION_ADDRESS,
    chooseAddress: constants.routes.SMELL_CHOOSE_ADDRESS
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

  const joinSegment = (line, segment) => {
    return line + (line ? ', ' : '') + segment
  }

  // Build addressLine1 and addressLine2 without splitting any segment
  for (const segment of baseSegments) {
    const nextLine = joinSegment(addressLine1, segment)

    if (nextLine.length <= MAX_LINE_LENGTH) {
      // add to line 1
      addressLine1 = nextLine
    } else {
      // add to line 2
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
  const question = questionSets.SMELL.questions.SMELL_LOCATION_ADDRESS
  const baseAnswer = {
    questionId: question.questionId,
    questionAsked: question.text,
    questionResponse: true
  }
  const addressData = selectedAddress[0].address
  const { addressLine1, addressLine2, townOrCity, postcode } = formatAddress(addressData)
  return [{
    ...baseAnswer,
    answerId: question.answers.addressLine1.answerId,
    otherDetails: addressLine1
  }, {
    ...baseAnswer,
    answerId: question.answers.addressLine2.answerId,
    otherDetails: addressLine2 || ''
  }, {
    ...baseAnswer,
    answerId: question.answers.townOrCity.answerId,
    otherDetails: townOrCity
  }, {
    ...baseAnswer,
    answerId: question.answers.county.answerId,
    otherDetails: ''
  }, {
    ...baseAnswer,
    answerId: question.answers.postcode.answerId,
    otherDetails: postcode
  }]
}

const buildLocationAnswers = (point) => {
  const question = questionSets.SMELL.questions.SMELL_LOCATION_MAP
  const baseAnswer = {
    questionId: question.questionId,
    questionAsked: question.text,
    questionResponse: true
  }

  const ngr = bngToNgr(point).text
  const lngLat = oSGBToWGS84(point)
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
    path: constants.routes.SMELL_CONFIRM_ADDRESS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_CONFIRM_ADDRESS,
    handler: handlers.post
  }
]
