import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.FISHING, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.FISHING_WATER_FEATURE
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FISHING,
    handler: handlers.get
  }
]
