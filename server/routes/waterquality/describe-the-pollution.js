import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_QUALITY_DESCRIBE_THE_POLLUTION),
  post: async (request, h) => {
    const { otherInfo } = request.payload
    if (!otherInfo) {
      const { errorSummary } = constants.errors
      errorSummary.errorList.push({
        text: 'Enter a description of the pollution',
        href: '#otherInfo'
      })
      return h.view(constants.views.WATER_QUALITY_DESCRIBE_THE_POLLUTION, {
        errorSummary
      })
    }
    request.yar.set(constants.redisKeys.WATER_QUALITY_DESCRIBE_THE_POLLUTION, otherInfo)
    return h.redirect('/') // todo next page not developed
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_QUALITY_DESCRIBE_THE_POLLUTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_QUALITY_DESCRIBE_THE_POLLUTION,
    handler: handlers.post
  }
]
