import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_RIVER_NAME)
  }

}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_RIVER_NAME,
    handler: handlers.get
  }
]
