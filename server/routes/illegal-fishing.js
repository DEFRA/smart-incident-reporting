import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.ILLEGAL_FISHING.questionSetId)
    return h.redirect(constants.routes.ILLEGAL_FISHING_WATER_FEATURE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING,
    handler: handlers.get
  }
]
