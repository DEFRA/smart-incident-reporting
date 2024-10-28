import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const questionSetID = request.yar.get(constants.redisKeys.QUESTION_SET_ID)
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSetID)
    request.cookieAuth.clear()
    const context = _getContext()
    return h.view(constants.views.REPORT_SENT, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    hideBackLink: true
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_SENT,
    handler: handlers.get
  }
]
