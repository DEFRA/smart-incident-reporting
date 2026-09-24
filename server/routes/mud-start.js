import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.MUD_START, {
      hideBackLink: true,
      startHref: constants.routes.MUD
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.MUD_START,
    handler: handlers.get
  }
]
