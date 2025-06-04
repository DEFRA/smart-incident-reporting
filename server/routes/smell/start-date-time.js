import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_START_DATE_TIME)
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_START_DATE_TIME, {
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)
    if (answerId === 1) {
      request.yar.set(constants.redisKeys.SMELL_START_DATE_TIME, (new Date()).toISOString())
      return h.redirect(constants.routes.SMELL_CURRENT)
    } else if (answerId === 2) {
      return h.redirect(constants.routes.SMELL_EARLIER_TODAY)
    } else if (answerId === 3) {
      return h.redirect(constants.routes.SMELL_YESTERDAY)
    } else if (answerId === 4) {
      return h.redirect(constants.routes.SMELL_DATE_BEFORE_YESTERDAY)
    }
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select when you noticed the smell',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_START_DATE_TIME,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_START_DATE_TIME,
    handler: handlers.post
  }
]
