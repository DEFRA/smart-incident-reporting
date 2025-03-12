import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
import { findByPostcode } from '../../utils/find-location.js'

const question = questionSets.SMELL.questions.SMELL_CHOOSE_ADDRESS

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

    // handle redirects
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

const find = async (request) => {
  const { buildingDetails, postcode } = request.yar.get(constants.redisKeys.SMELL_FIND_ADDRESS)
  const { payload } = await findByPostcode(postcode)

  if (payload.statuscode === 400 || payload.header.totalresults === 0) {
    return {
      resultsFound: false,
      buildingDetails,
      postcode
    }
  }

  const { results, fullResults } = processPayload(payload, buildingDetails)
  const resultsData = results
    .map(item => {
      return {
        uprn: item.UPRN,
        postcode: item.POSTCODE ? item.POSTCODE : item.POSTCODE_LOCATOR,
        address: capitaliseAddress(item.ADDRESS),
        x: item.X_COORDINATE,
        y: item.Y_COORDINATE
      }
    })
  console.log('Data for resultsData', resultsData)
  console.log('Data for resultsData length', resultsData.length)
  return {
    resultsFound: true,
    buildingDetails,
    postcode,
    showFullResults: fullResults,
    resultsData,
    resultlength: resultsData.length
  }
}

const processPayload = (payload, buildingDetails) => {
  const results = []
  let fullResults = false
  let allItems = payload.results.map(item => item.DPA ? item.DPA : item.LPI).filter(item => filterResults(item.ADDRESS, buildingDetails))

  if (allItems.length === 0) {
    allItems = payload.results.map(item => item.DPA ? item.DPA : item.LPI)
    fullResults = true
  }

  allItems.forEach((item) => {
    if (!(results.find(result => result.UPRN === item.UPRN))) {
      results.push(item)
    }
  })

  return {
    results,
    fullResults
  }
}

const filterResults = (address, buildingDetails) => {
  console.log('Data for address', address.toLowerCase().split(', '))
  const addressSplit = address.toLowerCase().split(', ')

  const n = 2
  const rem = (addressSplit, n) => {
    return addressSplit.filter((_, index) => index < addressSplit.length - n)
  }
  const res = rem(addressSplit, n)
  console.log('Data for res', res)
  const buildingData = buildingDetails.toLowerCase()
  const search = res.includes(buildingData)

  return search
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

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  console.log('Data for payload', payload)

  if (!payload.answerId) {
    errorSummary.errorList.push({
      text: 'Select an address',
      href: '#answerId-1'
    })
  }

  return errorSummary
}

const buildAnswers = (request, answerId) => {
  const { resultsData } = request.yar.get(constants.redisKeys.SMELL_CHOOSE_ADDRESS)
  const selectedAddress = resultsData.filter(item => Number(item.uprn) === answerId)
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
