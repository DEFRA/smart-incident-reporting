import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = _getContext()
    return h.view(constants.views.SMELL, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.SMELL_SOURCE
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL,
    handler: handlers.get
  }
]
