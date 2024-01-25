import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.REPORT_SENT, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    hideBackLink: true
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_SENT,
    handler: handlers.get
  }
]
