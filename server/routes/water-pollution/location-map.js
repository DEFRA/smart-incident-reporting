import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_LOCATION_MAP),
  post: async (request, h) => {
    const { 'input-autocomplete': location, point } = request.payload

    // // validate payload
    // const errorSummary = validatePayload(locationOption)
    // if (errorSummary.errorList.length > 0) {
    //   return h.view(constants.views.WATER_POLLUTION_LOCATION_MAP, {
    //     errorSummary
    //   })
    // }

    // handle redirects
    return h.redirect(constants.routes.WATER_POLLUTION_WHEN)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_LOCATION_MAP,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_LOCATION_MAP,
    handler: handlers.post
  }
]
