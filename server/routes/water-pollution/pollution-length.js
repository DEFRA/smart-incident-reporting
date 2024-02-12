import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_POLLUTION_LENGTH),
  post: async (request, h) => {
    return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_LENGTH)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_POLLUTION_LENGTH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_POLLUTION_LENGTH,
    handler: handlers.post
  }
]
