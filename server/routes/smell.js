import constants from '../utils/constants.js'
import isWorkingHours from '../utils/is-working-hours.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    const context = getContext()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.SMELL.questionSetId)
    request.yar.reset()
    request.cookieAuth.clear()
    if (await isWorkingHours()) {
      return h.view(constants.views.SMELL, {
        ...context
      })
    } else {
      // request.logger.warn('Service unavailable outside of working hours')
      return h.redirect(constants.routes.SERVICE_UNAVAILABLE)
    }
  },
  post: async (request, h) => {
      request.yar.reset()
      request.cookieAuth.clear()
      request.cookieAuth.set({ id: 11, password: 'ODINTERNAL' })
      request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.SMELL.questionSetId)
  
      // handle redirection
      return h.redirect(constants.routes.constants.routes.SMELL_SOURCE)
    }
}

const getContext = () => {
  return {
    hideBackLink: true
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL,
    handler: handlers.get,
    options: {
      auth: false
    }
  }, {
    method: 'POST',
    path: constants.routes.SMELL,
    handler: handlers.post,
    options: {
      auth: false
    }
  }
]

