import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const context = _getContext()
    return h.view(constants.views.ILLEGAL_FISHING, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.ILLEGAL_FISHING_WATER_FEATURE
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING,
    handler: handlers.get
  }
]
