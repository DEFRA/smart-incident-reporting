import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherLocationInfo } = request.payload

    request.yar.set(constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL, otherLocationInfo)
    return h.redirect(constants.routes.BLOCKAGE_WHEN)
  }
}

const getContext = request => {
  const answers = request.yar.get(constants.redisKeys.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL)
  return {
    answers
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL,
    handler: handlers.post
  }
]
