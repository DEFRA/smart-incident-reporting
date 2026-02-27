import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => {
    return h.view(constants.views.SEND_PHOTOS)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SEND_PHOTOS,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
