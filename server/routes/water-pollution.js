import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.WATER_POLUTION, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.WATER_POLLUTION_WATER_FEATURE
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLUTION,
    handler: handlers.get
  }
]
