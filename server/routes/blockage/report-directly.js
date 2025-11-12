import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.BLOCKAGE_REPORT_DIRECTLY)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_REPORT_DIRECTLY,
    handler: handlers.get
  }
]
