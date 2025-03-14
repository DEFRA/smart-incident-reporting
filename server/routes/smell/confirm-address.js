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
    const { selectedAddress } = request.yar.get(constants.redisKeys.SMELL_CHOOSE_ADDRESS)
    const point = [selectedAddress[0].x, selectedAddress[0].y]
    request.yar.set(constants.redisKeys.SMELL_LOCATION_ADDRESS, buildAddressAnswers(selectedAddress))
    request.yar.set(constants.redisKeys.SMELL_LOCATION_MAP, buildLocationAnswers(point))

    // handle redirects
    return h.redirect(constants.routes.SMELL_PREVIOUS)
  }
}

const getContext = (request) => {
  const question = questionSets.SMELL.questions.SMELL_CONFIRM_ADDRESS
  const { selectedAddress } = request.yar.get(constants.redisKeys.SMELL_CHOOSE_ADDRESS)
  const addressData = selectedAddress[0].address
  const { addressLine1, townOrCity, postcode } = formatAddress(addressData)
  return {
    question,
    addressLine1,
    townOrCity,
    postcode,
    enterAddress: constants.routes.SMELL_LOCATION_ADDRESS,
    differentAddress: constants.routes.SMELL_FIND_ADDRESS
  }
}

const formatAddress = (address) => {
  const addressParts = address.split(',')
  const addressLine1 = addressParts.slice(0, -2).join()
  console.log('Data for addressLine1', addressLine1)
  const townOrCity = addressParts[addressParts.length - 2].trimStart()
  const postcode = addressParts[addressParts.length - 1].trimStart()

  return {
    addressLine1,
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
  const { addressLine1, townOrCity, postcode } = formatAddress(addressData)
  return [{
    ...baseAnswer,
    answerId: question.answers.addressLine1.answerId,
    otherDetails: addressLine1
  }, {
    ...baseAnswer,
    answerId: question.answers.addressLine2.answerId,
    otherDetails: ''
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
