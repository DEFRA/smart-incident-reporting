import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.NOISE_START, {
      hideBackLink: true,
      startHref: constants.routes.NOISE
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.NOISE_START,
    handler: handlers.get
  }
]
