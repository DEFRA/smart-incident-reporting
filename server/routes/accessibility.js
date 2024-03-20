import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => h.view(constants.views.ACCESSIBILITY)
}

export default [
  {
    method: 'GET',
    path: constants.routes.ACCESSIBILITY,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
