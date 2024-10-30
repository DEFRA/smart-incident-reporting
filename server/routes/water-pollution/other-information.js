import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION),
  post: async (request, h) => {
    const { otherInfo } = request.payload

    request.yar.set(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION, otherInfo)
    return h.redirect(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_OTHER_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_OTHER_INFORMATION,
    handler: handlers.post
  }
]
