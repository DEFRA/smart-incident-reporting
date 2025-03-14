import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
import { findByPostcode } from '../../services/find-location.js'

const question = questionSets.SMELL.questions.SMELL_CHOOSE_ADDRESS

const handlers = {
  get: async (request, h) => {
    const result = await find(request)
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

  if (payload.header.totalresults === 0) {
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
        postcode: item.POSTCODE,
        address: capitaliseAddress(item.ADDRESS),
        x: item.X_COORDINATE,
        y: item.Y_COORDINATE
      }
    })

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
  let allItems = payload.results.map(item => item.DPA).filter(item => filterResults(item.ADDRESS, buildingDetails))

  if (allItems.length === 0) {
    allItems = payload.results.map(item => item.DPA)
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
  const addressParts = address.toLowerCase().split(', ')
  const n = 2
  const addressLine1 = addressParts.slice(0, -n)
  const buildingData = buildingDetails.toLowerCase()
  const searchResults = addressLine1.includes(buildingData)

  return searchResults
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
