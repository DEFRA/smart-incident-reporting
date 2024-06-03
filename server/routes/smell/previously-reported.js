import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getHandler, postHandler } from '../shared/yes-no.js'

const question = questionSets.SMELL.questions.SMELL_PREVIOUSLY_REPORTED
const key = constants.redisKeys.SMELL_PREVIOUSLY_REPORTED
const routeFunction = (h, answerId) => {
  if (answerId === question.answers.yes.answerId) {
    return h.redirect(constants.routes.SMELL_DATE_TIME)
  } else {
    return h.redirect(constants.routes.SMELL_RECURRING_PROBLEM)
  }
}
const errMessage = 'Select yes if you\'ve reported the smell before'

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_PREVIOUSLY_REPORTED,
    handler: getHandler(question)
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_PREVIOUSLY_REPORTED,
    handler: postHandler(question, routeFunction, key, errMessage)
  }
]
