import constants from '../../utils/constants.js'

const handlers = {
  get: (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.PRIVACY, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: false
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.PRIVACY,
    handler: handlers.get
  }
]
