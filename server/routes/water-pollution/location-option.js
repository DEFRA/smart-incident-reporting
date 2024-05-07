import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_LOCATION_OPTION),
  post: async (request, h) => {
    const { locationOption } = request.payload

    // validate payload
    const errorSummary = validatePayload(locationOption)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_LOCATION_OPTION, {
        errorSummary
      })
    }

    // handle redirects
    if (locationOption === 'map') {
      return h.redirect(constants.routes.WATER_POLLUTION_LOCATION_MAP)
    } else {
      return h.redirect(constants.routes.WATER_POLLUTION_LOCATION_DESCRIPTION)
    }
  }
}

const validatePayload = locationOption => {
  const errorSummary = getErrorSummary()
  if (!locationOption) {
    errorSummary.errorList.push({
      text: 'Select how you\'d prefer to give the location',
      href: '#locationOption'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_LOCATION_OPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_LOCATION_OPTION,
    handler: handlers.post
  }
]
