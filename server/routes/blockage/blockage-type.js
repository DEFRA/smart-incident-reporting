import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.BLOCKAGE_TYPE)
  }

}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_TYPE,
    handler: handlers.get
  }
]
