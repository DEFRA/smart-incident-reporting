import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.SMELL_SOURCE_DETAILS, {
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
    path: constants.routes.SMELL_SOURCE_DETAILS,
    handler: handlers.get
  }
]
