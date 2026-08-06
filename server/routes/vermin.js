import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.REPORT_REGULATED_SITE.questionSetId)
    return h.redirect(constants.routes.VERMIN_TYPE)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.VERMIN,
    handler: handlers.get
  }
]
