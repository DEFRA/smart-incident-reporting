import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.VERMIN_START, {
      hideBackLink: true,
      startHref: constants.routes.VERMIN
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.VERMIN_START,
    handler: handlers.get
  }
]
