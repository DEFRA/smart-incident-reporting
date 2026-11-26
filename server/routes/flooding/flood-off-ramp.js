import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.FLOOD_OFF_RAMP)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FLOOD_OFF_RAMP,
    handler: handlers.get
  }
]
