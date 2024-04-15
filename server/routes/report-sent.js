import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.cookieAuth.clear()
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
