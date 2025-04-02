import constants from '../utils/constants.js'
import { getErrorSummary, validatePayload } from '../utils/helpers.js'
import { sendMessage } from '../services/service-bus.js'

const handlers = {
  get: (request, h) => {
    request.yar.set(constants.redisKeys.FEEDBACK, {
      feedbackURL: request.headers.referer || ''
    })
    return h.view(constants.views.FEEDBACK)
  },
  post: async (request, h) => {
    const { feedback, otherInfo } = request.payload

    // validate payload
    if (!feedback) {
      const errorSummary = getErrorSummary()
      errorSummary.errorList.push({
        text: 'Select how you feel about the service',
        href: '#feedback'
      })
      return h.view(constants.views.FEEDBACK, {
        errorSummary
      })
    }

    const payload = buildPayload(request, feedback, otherInfo)

    // test the payload against the schema
    if (!validatePayload(payload, true)) {
      throw new Error('Invalid payload')
    }

    await sendMessage(request.logger, payload, '-feedback')

    return h.redirect(constants.routes.FEEDBACK_SUCCESS)
  }
}

const buildPayload = (request, feedback, otherInfo) => {
  const nowUtc = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  return {
    givingFeedbackToAEnvironmentalProblemReport: {
      sessionGuid: request.yar.id,
      feedbackDateAndTime: nowUtc.toISOString(),
      feedbackRating: feedback,
      feedbackURL: request.yar.get(constants.redisKeys.FEEDBACK).feedbackURL,
      feedbackText: otherInfo,
      questionSetId: request.yar.get(constants.redisKeys.QUESTION_SET_ID)
    }
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FEEDBACK,
    handler: handlers.get,
    options: {
      auth: false
    }
  }, {
    method: 'POST',
    path: constants.routes.FEEDBACK,
    handler: handlers.post,
    options: {
      auth: false
    }
  }
]
