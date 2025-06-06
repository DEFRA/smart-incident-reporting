import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_START_DATE_TIME, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_START_DATE_TIME, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.DATE_TIME_OPTION, answerId)

    // handle redirects
    const optionOne = 1
    const optionTwo = 2
    const optionThree = 3
    const optionFour = 4
    if (answerId === optionOne) {
      request.yar.set(constants.redisKeys.SMELL_START_DATE_TIME, (new Date()).toISOString())
      return h.redirect(constants.routes.SMELL_CURRENT)
    } else if (answerId === optionTwo) {
      return h.redirect(constants.routes.SMELL_EARLIER_TODAY)
    } else if (answerId === optionThree) {
      return h.redirect(constants.routes.SMELL_YESTERDAY)
    } else if (answerId === optionFour) {
      return h.redirect(constants.routes.SMELL_DATE_BEFORE_YESTERDAY)
    } else {
      // do nothing
    }

    return null
  }
  
}

const getContext = request => {
  const answer = request.yar.get(constants.redisKeys.DATE_TIME_OPTION)
  return {
    answer
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
