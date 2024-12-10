import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherInfo } = request.payload

    request.yar.set(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION, otherInfo)
    return h.redirect(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
  }
}

const getContext = request => {
  const answers = request.yar.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION)
  return {
    answers
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
