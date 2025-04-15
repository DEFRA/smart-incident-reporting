import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'
import isWorkingHours from '../utils/is-working-hours.js'

const handlers = {
  get: async (request, h) => {
    if (await isWorkingHours()) {
      // Clear referer key in case if user restarts the journey before report submission
      request.yar.clear(constants.redisKeys.REFERER)
      request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.WATER_POLLUTION.questionSetId)
      return h.redirect(constants.routes.WATER_POLLUTION_WATER_FEATURE)
    } else {
      // request.logger.warn('Service unavailable outside of working hours')
      return h.redirect(constants.routes.SERVICE_UNAVAILABLE)
    }
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION,
    handler: handlers.get
  }
]
