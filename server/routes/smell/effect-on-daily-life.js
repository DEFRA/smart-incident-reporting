import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getHandler, postHandler } from '../shared/effect-on-x.js'

const question = questionSets.SMELL.questions.SMELL_EFFECT_ON_DAILY_LIFE
const key = constants.redisKeys.SMELL_EFFECT_ON_DAILY_LIFE
const view = constants.views.SMELL_EFFECT_ON_DAILY_LIFE
const route = constants.routes.SMELL_EFFECT_ON_HEALTH

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE,
    handler: getHandler(question, view)
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_EFFECT_ON_DAILY_LIFE,
    handler: postHandler(question, route, key)
  }
]
