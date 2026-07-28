import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_REPORT_LOCAL_COUNCIL)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
    handler: handlers.get
  }
]
