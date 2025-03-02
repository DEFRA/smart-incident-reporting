import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import bngToNgr from '../../utils/bng-to-ngr.js'

const question = questionSets.SMELL.questions.SMELL_LOCATION_ADDRESS
const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_CONFIRM_ADDRESS, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { selectedAddress } = request.yar.get(constants.redisKeys.SMELL_CHOOSE_ADDRESS)
    const point = [ selectedAddress[0].x, selectedAddress[0].y ]
    console.log('Data for point', point)
    const ngr = bngToNgr(point).text
    console.log('Data for ngr', ngr)
    request.yar.set(constants.redisKeys.SMELL_CONFIRM_ADDRESS, ngr)
    request.yar.set(constants.redisKeys.SMELL_LOCATION_MAP, buildAnswers(selectedAddress))
    // handle redirects
    return h.redirect(constants.routes.SMELL_PREVIOUS)
  }
}

const getContext = (request) => {
  const { selectedAddress } = request.yar.get(constants.redisKeys.SMELL_CHOOSE_ADDRESS)
  const addressData = selectedAddress[0].address
  console.log('Data for selectedAddressFinal', addressData)
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
  const n = 2;
  const rem = (addressParts, n) => {
    return addressParts.filter((_, index) => index < addressParts.length - n);
  };
  const res = rem(addressParts, n);
  console.log('Data for addressParts', addressParts)
  console.log('Data for res', res)
  const addressLine1 = res.join()
  const townOrCity = addressParts[addressParts.length - 2]
  const postcode = addressParts[addressParts.length - 1]

  return {
    addressLine1,
    townOrCity,
    postcode
  }
}

const buildAnswers = (selectedAddress) => {
  const addressData = selectedAddress[0].address
  console.log('Data for selectedAddressFinal', addressData)
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
