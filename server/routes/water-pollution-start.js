import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = getContext()
    return h.view(constants.views.WATER_POLLUTION_START, {
      ...context
    })
  }
}

const getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.WATER_POLLUTION
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_START,
    handler: handlers.get
  }
]
