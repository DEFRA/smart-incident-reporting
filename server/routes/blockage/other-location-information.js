import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_OTHER_LOCATION_INFORMATION, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherLocationInfo } = request.payload

    request.yar.set(constants.redisKeys.BLOCKAGE_OTHER_LOCATION_INFORMATION, otherLocationInfo)
    return h.redirect(constants.routes.BLOCKAGE_START)
  }
}

const getContext = request => {
  const answers = request.yar.get(constants.redisKeys.BLOCKAGE_OTHER_LOCATION_INFORMATION)
  return {
    answers
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_OTHER_LOCATION_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_OTHER_LOCATION_INFORMATION,
    handler: handlers.post
  }
]
