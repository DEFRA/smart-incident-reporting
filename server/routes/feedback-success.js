import constants from '../utils/constants.js'

const handlers = {
  get: (request, h) => {
    const { feedbackURL } = request.yar.get(constants.redisKeys.FEEDBACK)
    const returnToStart = feedbackURL.includes(constants.routes.REPORT_SENT)
    return h.view(constants.views.FEEDBACK_SUCCESS, {
      returnToStart,
      feedbackURL
    })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FEEDBACK_SUCCESS,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
