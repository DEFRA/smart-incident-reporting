import constants from '../../utils/constants.js'
// import { getErrorSummary } from '../../utils/helpers.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_WHEN),
  post: async (request, h) => {
    // const { locationDescription } = request.payload
    // if (!locationDescription) {
    //   const errorSummary = getErrorSummary()
    //   errorSummary.errorList.push({
    //     text: 'Enter a description of where the pollution is',
    //     href: '#locationDescription'
    //   })
    //   return h.view(constants.views.WATER_POLLUTION_LOCATION_DESCRIPTION, {
    //     errorSummary
    //   })
    // }

    // request.yar.set(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION, locationDescription)

    return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_WHEN,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_WHEN,
    handler: handlers.post
  }
]
