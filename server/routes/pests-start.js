import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.PESTS_START, {
      hideBackLink: true,
      startHref: constants.routes.PESTS
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.PESTS_START,
    handler: handlers.get
  }
]
