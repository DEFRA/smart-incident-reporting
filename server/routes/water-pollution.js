import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.WATER_POLUTION, {
      ...context
    })
  }
}

const getContext = (request) => {
    // Clear referer key in case if user restarts the journey before report submission
    request.yar.clear(constants.redisKeys.REFERER)
  return {
    hideBackLink: true,
    startHref: constants.routes.WATER_POLLUTION_WATER_FEATURE
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLUTION,
    handler: handlers.get
  }
]
