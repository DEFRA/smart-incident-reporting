import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => {
    return h.view(constants.views.LINK_USED)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.LINK_USED,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
