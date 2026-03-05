import constants from '../utils/constants.js'

const handlers = {
  get: (request, h) => {
    const thumbnails = request.yar.get('thumbnails')
    return h.view(constants.views.YOUR_PHOTOS, { thumbnails })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.YOUR_PHOTOS,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
