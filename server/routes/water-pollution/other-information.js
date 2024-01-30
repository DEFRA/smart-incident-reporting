import constants from '../../utils/constants.js'
import { sendMessage } from '../../services/service-bus.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION),
  post: async (request, h) => {
    const { otherInfo } = request.payload
    if (!otherInfo) {
      const { errorSummary } = JSON.parse(JSON.stringify(constants.errors))
      errorSummary.errorList.push({
        text: 'Enter a description of the pollution',
        href: '#otherInfo'
      })
      return h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION, {
        errorSummary
      })
    }
    request.yar.set(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION, otherInfo)
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

    // Need to transform this data using a schema, but for now just submit raw
    await sendMessage(request.yar._store)

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
