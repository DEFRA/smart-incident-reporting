import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
import findLocation from '../../utils/findLocation.js'

const question = questionSets.SMELL.questions.SMELL_CHOOSE_ADDRESS

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const result = await find(request)
    console.log('Data for resultsFinal', result)
    request.yar.set(constants.redisKeys.SMELL_CHOOSE_ADDRESS, result)
    return h.view(constants.views.SMELL_CHOOSE_ADDRESS, {
      ...getContext(),
      ...result
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload
    // convert answerId to number
    answerId = Number(answerId)

    console.log('Data for answerId', answerId)

    // validate payload
    const errorSummary = validatePayload(request.payload)
    if (errorSummary.errorList.length > 0) {
      const result = request.yar.get(constants.redisKeys.SMELL_CHOOSE_ADDRESS)
      return h.view(constants.views.SMELL_CHOOSE_ADDRESS, {
        ...getContext(),
        ...result,
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.SMELL_CHOOSE_ADDRESS, buildAnswers(request, answerId))
    return h.redirect(constants.routes.SMELL_CONFIRM_ADDRESS)
  }
}

const getContext = () => {
  return {
    question,
    enterAddress: constants.routes.SMELL_LOCATION_ADDRESS,
    findAddress: constants.routes.SMELL_FIND_ADDRESS
  }
}

const processPayload = (results, payload, buildingData) => {
  let allItems = payload.results.map(item => item.DPA ? item.DPA : item.LPI).filter(item => filterResults(item.ADDRESS, buildingData))

  if (allItems.length === 0) {
    console.log('Inside allItems full result')
    allItems = payload.results.map(item => item.DPA ? item.DPA : item.LPI)
  }
  console.log('Data for allItems', allItems)
  allItems.forEach((item) => {
    if (!(results.find(result => result.UPRN === item.UPRN))) {
      results.push(item)
    }
  })
}

const find = async (request) => {
  const postcodeData = request.yar.get(constants.redisKeys.SMELL_FIND_ADDRESS)
  console.log('Data for postcodeData', postcodeData)
  const postcode = postcodeData[1].otherDetails
  const buildingData = postcodeData[0].otherDetails

  const results = []
  let offset = 0
  let maxresults = 0
  let totalresults = 1

  while (totalresults > (maxresults + offset)) {
    offset += maxresults
    const { payload } = await findLocation.findByPostcode(postcode)
    console.log('Data for payloadERROR', payload)
    if (payload.statuscode === 400) {
      return {
        resultsFound: false,
        buildingDetails: postcodeData[0].otherDetails,
        postcode: postcodeData[1].otherDetails
      }
    }
    processPayload(results, payload, buildingData)
    maxresults = payload.header.maxresults
    totalresults = payload.header.totalresults
  }

  let resultsData = results
    .map(item => {
      return {
        uprn: item.UPRN,
        postcode: item.POSTCODE ? item.POSTCODE : item.POSTCODE_LOCATOR,
        address: capitaliseAddress(item.ADDRESS),
        country_code: item.COUNTRY_CODE,
        x: item.X_COORDINATE,
        y: item.Y_COORDINATE
      }
    })
  console.log('Data for resultsData', resultsData)
  console.log('Data for resultsData length', resultsData.length)
  return {
    resultsFound: true,
    resultsData,
    resultlength: resultsData.length,
    buildingDetails: postcodeData[0].otherDetails,
    postcode: postcodeData[1].otherDetails
  }
}

const capitaliseAddress = (address) => {
  // Split the address into its components
  const components = address.split(', ')

  // Capitalise the first letter of each word except the last component (postcode)
  for (let i = 0; i < components.length - 1; i++) {
    const words = components[i].split(' ')
    for (let j = 0; j < words.length; j++) {
      words[j] = words[j].charAt(0).toUpperCase() + words[j].slice(1).toLowerCase()
    }
    components[i] = words.join(' ')
  }

  // Join the components back together
  const capitalisedAddress = components.join(', ')

  return capitalisedAddress
}

const filterResults = (address, buildingData) => {
  console.log('Data for address', address.toLowerCase().split(', '))
  const addressSplit = address.toLowerCase().split(', ')

  const n = 2;
  const rem = (addressSplit, n) => {
    return addressSplit.filter((_, index) => index < addressSplit.length - n);
  };
  const res = rem(addressSplit, n);
  console.log('Data for res', res)
  const buildingData2 = buildingData.toLowerCase()
  const search = res.includes(buildingData2)

  return search

}

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  console.log('Data for payload', payload)

  if (!payload.answerId) {
    errorSummary.errorList.push({
      text: 'Select an address',
      href: '#addressList'
    })
  }

  return errorSummary
}

const buildAnswers = (request, answerId) => {
  const { resultsData } = request.yar.get(constants.redisKeys.SMELL_CHOOSE_ADDRESS)
  const selectedAddress = resultsData.filter(item => Number(item.uprn) === answerId)
  //console.log('Data for resultsData', resultsData)
  console.log('Data for selectedAddress', selectedAddress)
  return {
    selectedAddress
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_CHOOSE_ADDRESS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_CHOOSE_ADDRESS,
    handler: handlers.post
  }
]
