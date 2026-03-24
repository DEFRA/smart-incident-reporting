import constants from '../utils/constants.js'
import imageChecker from '../services/image-checker.js'

const handlers = {
  get: (request, h) => {
    const thumbnails = request.yar.get('thumbnails') || []
    return h.view(constants.views.SEND_PHOTOS, {
      photos: thumbnails.length
    })
  },
  post: async (request, h) => {
    const thumbnails = request.yar.get('thumbnails') || []
    await imageChecker.validate(thumbnails)
    return h.redirect(constants.routes.SUCCESS)
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
  },
  {
    method: 'POST',
    path: constants.routes.SEND_PHOTOS,
    handler: handlers.post,
    options: {
      auth: false
    }
  }
]
