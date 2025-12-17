import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_OTHER_INFORMATION, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherInformation = '' } = request.payload || {}

    request.yar.set(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION, {
      otherInformation: otherInformation || ''
    })

    // handle redirects
    return h.redirect(constants.routes.BLOCKAGE_START)
  }
}

const getContext = request => {
  const data = request.yar.get(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION)
  const otherInformation = data?.otherInformation || ''

  return {
    otherInformation
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_OTHER_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_OTHER_INFORMATION,
    handler: handlers.post
  }
]
