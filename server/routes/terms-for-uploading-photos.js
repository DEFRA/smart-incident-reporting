import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => {
    return h.view(constants.views.TERMS_FOR_UPLOADING_PHOTOS)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.TERMS_FOR_UPLOADING_PHOTOS,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
