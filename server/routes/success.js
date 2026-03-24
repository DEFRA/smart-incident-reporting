import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => {
    return h.view(constants.views.SUCCESS)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SUCCESS,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
