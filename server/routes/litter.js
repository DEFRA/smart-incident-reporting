import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.LITTER.questionSetId)
    return h.redirect(constants.routes.LITTER_START)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.LITTER,
    handler: handlers.get
  }
]
