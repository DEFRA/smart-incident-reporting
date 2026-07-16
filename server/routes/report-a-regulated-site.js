import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSets.REPORT_A_REGULATED_SITE.questionSetId)
    return h.redirect(constants.routes.REPORT_A_REGULATED_SITE_HOME)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_A_REGULATED_SITE,
    handler: handlers.get
  }
]
