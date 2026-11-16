import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.FLOOD_SOURCE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FLOOD_SOURCE,
    handler: handlers.get
  }
]
