import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_SOURCE_DETAILS)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_SOURCE_DETAILS,
    handler: handlers.get
  }
]
