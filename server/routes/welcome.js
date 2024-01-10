import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const context = _getContext()
    return h.view(constants.views.WELCOME, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: true
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WELCOME,
    handler: handlers.get
  }
]
