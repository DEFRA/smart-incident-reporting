import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_LOCATION_OPTION)
  }

}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_LOCATION_OPTION,
    handler: handlers.get
  }
]
