import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION),
  post: async (request, h) => {
    const { otherInfo } = request.payload
    if (!otherInfo) {
      const { errorSummary } = constants.errors
      errorSummary.errorList.push({
        text: 'Enter a description of the pollution',
        href: '#otherInfo'
      })
      return h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION, {
        errorSummary
      })
    }
    request.yar.set(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION, otherInfo)
    // TODO Data needs forwarding to service bus queue here
    return h.redirect(constants.routes.REPORT_SENT)
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
