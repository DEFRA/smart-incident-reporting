import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const reportSentPageData = request.yar.get(constants.redisKeys.REPORT_SENT_PAGE_DATA)

    request.yar.reset()
    const context = _getContext(reportSentPageData)

    return h.view(constants.views.REPORT_SENT, context)
  }
}

const _getContext = (photoUploadDetails) => {
  return {
    hideBackLink: true,
    photoUploadDetails
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_SENT,
    handler: handlers.get
  }
]
