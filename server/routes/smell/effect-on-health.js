import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getHandler, postHandler } from '../shared/effect-on-x.js'

const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_HEALTH
const key = constants.redisKeys.SMELL_EFFECT_ON_HEALTH
const view = constants.views.SMELL_EFFECT_ON_HEALTH
const route = constants.routes.SMELL_OTHER_INFORMATION

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_EFFECT_ON_HEALTH,
    handler: getHandler(question, view)
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_EFFECT_ON_HEALTH,
    handler: postHandler(question, route, key)
  }
]
