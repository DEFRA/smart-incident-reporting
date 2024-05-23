import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => h.view(constants.views.PRIVACY_NOTICE)
}

export default [
  {
    method: 'GET',
    path: constants.routes.PRIVACY_NOTICE,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
