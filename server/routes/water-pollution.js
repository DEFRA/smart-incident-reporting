import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.WATER_POLLUTION.questionSetId)
    return h.redirect(constants.routes.WATER_POLLUTION_WATER_FEATURE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION,
    handler: handlers.get
  }
]
