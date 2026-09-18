import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.DUST_START, {
      hideBackLink: true,
      startHref: constants.routes.DUST
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.DUST_START,
    handler: handlers.get
  }
]
