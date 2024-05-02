import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => h.view(constants.views.MAP)
}

export default [
  {
    method: 'GET',
    path: constants.routes.MAP,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
