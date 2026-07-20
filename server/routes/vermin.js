import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.VERMIN.questionSetId)
    return h.redirect(constants.routes.VERMIN_START)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.VERMIN,
    handler: handlers.get
  }
]
