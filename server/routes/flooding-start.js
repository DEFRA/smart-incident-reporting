import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = getContext()
    return h.view(constants.views.FLOOD_START, {
      ...context
    })
  }
}

const getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.FLOOD
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FLOOD_START,
    handler: handlers.get
  }
]
