import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.LITTER_START, {
      hideBackLink: true,
      startHref: constants.routes.LITTER
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.LITTER_START,
    handler: handlers.get
  }
]
