import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_POLLUTION_AREA),
  post: async (request, h) => {
    return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_AREA)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_POLLUTION_AREA,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_POLLUTION_AREA,
    handler: handlers.post
  }
]
