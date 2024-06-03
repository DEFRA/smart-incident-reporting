import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getHandler, postHandler } from '../shared/yes-no.js'

const question = questionSets.SMELL.questions.SMELL_ONGOING
const key = constants.redisKeys.SMELL_ONGOING
const routeFunction = (h) => {
  return h.redirect(constants.routes.SMELL_STRENGTH)
}
const errMessage = 'Select yes if the smell is still there'

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_ONGOING,
    handler: getHandler(question)
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_ONGOING,
    handler: postHandler(question, routeFunction, key, errMessage)
  }
]
