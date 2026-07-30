import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => h.view(constants.views.OS_TERMS)
}

export default [
  {
    method: 'GET',
    path: constants.routes.OS_TERMS,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
