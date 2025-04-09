import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    const context = getContext()
    return h.view(constants.views.SMELL_START, {
      ...context
    })
  }
}

const getContext = () => {
  return {
    hideBackLink: true,
    startHref: constants.routes.SMELL
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_START,
    handler: handlers.get
  }
]
