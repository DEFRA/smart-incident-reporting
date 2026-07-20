import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.MUD.questionSetId)
    return h.redirect(constants.routes.MUD_START)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.MUD,
    handler: handlers.get
  }
]
