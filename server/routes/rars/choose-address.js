import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { findByPostcode } from '../../services/find-location.js'

const createChooseAddressRoutes = ({ problem, route, redirect }) => {
  const postcodeDetailsKey = `${problem}-postcode-details`

  const handlers = {
    get: async (request, h) => {
      const result = await findAddresses(request, postcodeDetailsKey)
      request.yar.set(constants.redisKeys.RARS_CHOOSE_ADDRESS, result)
      return h.view(constants.views.RARS_CHOOSE_ADDRESS, {
        ...result,
        ...getContext(request, redirect.findAddress, redirect.confirmAddress, redirect.locationAddress)
      })
    },
    post: async (request, h) => {
      let { answerId } = request.payload

      answerId = Number(answerId)

      const errorSummary = validatePayload(request.payload)
      if (errorSummary.errorList.length > 0) {
        const result = request.yar.get(constants.redisKeys.RARS_CHOOSE_ADDRESS)
        return h.view(constants.views.RARS_CHOOSE_ADDRESS, {
          ...result,
          ...getContext(request, redirect.findAddress, redirect.confirmAddress, redirect.locationAddress),
          errorSummary
        })
      }

      request.yar.set(constants.redisKeys.RARS_CONFIRM_ADDRESS, buildAnswers(request, answerId))

      return h.redirect(redirect.confirmAddress)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = (request, findAddressRoute, confirmAddressRoute, locationAddressRoute) => {
  const selectedOption = request.yar.get(constants.redisKeys.RARS_CONFIRM_ADDRESS)
  let answer
  if (selectedOption) {
    const { selectedAddress } = selectedOption
    answer = selectedAddress[0].uprn
  }

  return {
    answer,
    findAddress: findAddressRoute,
    confirmAddress: confirmAddressRoute,
    enterAddress: locationAddressRoute
  }
}

const findAddresses = async (request, postcodeDetailsKey) => {
  const cachedResult = request.yar.get(constants.redisKeys.RARS_CHOOSE_ADDRESS)
  const { buildingDetails, postcode } = request.yar.get(constants.redisKeys.RARS_FIND_ADDRESS)

  let isBuildingDetailsCached = false
  let isPostcodeCached = false
  if (cachedResult) {
    isBuildingDetailsCached = cachedResult.buildingDetails === buildingDetails
    isPostcodeCached = cachedResult.postcode === postcode
  }

  if (!cachedResult || !isBuildingDetailsCached || !isPostcodeCached) {
    request.yar.clear(constants.redisKeys.RARS_CONFIRM_ADDRESS)
    let payload
    if (isPostcodeCached && !isBuildingDetailsCached) {
      payload = request.yar.get(postcodeDetailsKey)
    } else {
      const apiResults = await findByPostcode(postcode)
      payload = apiResults.payload
      request.yar.set(postcodeDetailsKey, payload)
    }

    if (payload.header.totalresults === 0) {
      return {
        resultsFound: false,
        buildingDetails,
        postcode
      }
    }

    const { results, fullResults } = processPayload(payload, buildingDetails)
    const resultsData = results
      .map(item => ({
        uprn: item.UPRN,
        postcode: item.POSTCODE,
        address: capitaliseAddress(item.ADDRESS),
        x: item.X_COORDINATE,
        y: item.Y_COORDINATE
      }))

    return {
      resultsFound: true,
      buildingDetails,
      postcode,
      showFullResults: fullResults,
      resultsData,
      resultlength: resultsData.length
    }
  } else {
    return cachedResult
  }
}

const processPayload = (payload, buildingDetails) => {
  const results = []
  const filteredItems = payload.results.map(item => item.DPA).filter(item => filterResults(item.ADDRESS, buildingDetails))
  const fullResults = filteredItems.length === 0
  const allItems = fullResults ? payload.results.map(item => item.DPA) : filteredItems
  allItems.forEach((item) => {
    if (!results.some(result => result.UPRN === item.UPRN)) {
      results.push(item)
    }
  })

  results.sort((a, b) => a.ADDRESS.localeCompare(b.ADDRESS, 'en-GB', { numeric: true, sensitivity: 'base' }))

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
  return addressLine1.includes(buildingData)
}

const capitaliseAddress = (address) => {
  const components = address.split(', ')
  for (let i = 0; i < components.length - 1; i++) {
    const words = components[i].split(' ')
    for (let j = 0; j < words.length; j++) {
      words[j] = words[j].charAt(0).toUpperCase() + words[j].slice(1).toLowerCase()
    }
    components[i] = words.join(' ')
  }
  return components.join(', ')
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
  const { resultsData } = request.yar.get(constants.redisKeys.RARS_CHOOSE_ADDRESS)
  const selectedAddress = resultsData.filter(item => Number(item.uprn) === answerId)
  return {
    selectedAddress
  }
}

export default createChooseAddressRoutes
