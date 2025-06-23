import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = getContext()
    return h.view(constants.views.ILLEGAL_FISHING_START, {
      ...context
    })
  }
}

const getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.ILLEGAL_FISHING
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_START,
    handler: handlers.get
  }
]
