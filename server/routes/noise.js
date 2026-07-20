import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.NOISE.questionSetId)
    return h.redirect(constants.routes.NOISE_START)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.NOISE,
    handler: handlers.get
  }
]
