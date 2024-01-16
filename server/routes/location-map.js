import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.LOCATION_MAP, {
      mapConfig: {}
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.LOCATION_MAP,
    handler: handlers.get
  }
]
