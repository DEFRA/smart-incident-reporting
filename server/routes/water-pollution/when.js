import constants from '../../utils/constants.js'
// import { getErrorSummary } from '../../utils/helpers.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_WHEN),
  post: async (_request, h) => h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE)
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
