import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_RIVER)
  }
  // post: async (request, h) => {
  // }
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_RIVER,
    handler: handlers.get
  }
  // {
  //   method: 'POST',
  //   path: constants.routes.WATER_POLLUTION_WATER_FEATURE,
  //   handler: handlers.post
  // }
]
