import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.REPORT_WATER_POLUTION, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageHeading: 'Report water pollution in England',
    hideBackLink: true
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_WATER_POLUTION,
    handler: handlers.get
  }
]
