import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => h.view(constants.views.ADD_A_PHOTO)
}

export default [
  {
    method: 'GET',
    path: constants.routes.ADD_A_PHOTO,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]