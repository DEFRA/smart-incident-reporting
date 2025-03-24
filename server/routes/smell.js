import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.SMELL, {
      ...context
    })
  }
}

const getContext = (request) => {
  request.yar.reset()
  request.cookieAuth.clear()
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
