import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.SMELL_REPORT_LOCAL_COUNCIL, {
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
    path: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
    handler: handlers.get
  }
]
