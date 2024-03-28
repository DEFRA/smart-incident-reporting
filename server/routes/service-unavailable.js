import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => h.view(constants.views.SERVICE_UNAVAILABLE)
}

export default [
  {
    method: 'GET',
    path: constants.routes.SERVICE_UNAVAILABLE,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
