import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.SMELL.questionSetId)
    return h.redirect(constants.routes.SMELL_SOURCE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL,
    handler: handlers.get
  }
]
