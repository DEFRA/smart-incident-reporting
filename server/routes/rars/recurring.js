import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_RECURRING

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createRecurringRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_RECURRING, {
        question,
        problem,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      let { answerId } = request.payload

      // validate payload
      const errorSummary = validatePayload(answerId, request, problem)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_RECURRING, {
          question,
          problem,
          errorSummary,
          ...serviceDetails
        })
      }
      // convert answerId to number
      answerId = Number(answerId)

      request.yar.set(constants.redisKeys.RARS_RECURRING, buildAnswers(answerId))

      return h.redirect(redirect.when)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const validatePayload = (answerId, request, problem) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    const selectedProblem = problem === 'vermin'
      ? (request?.yar?.get(constants.redisKeys.VERMIN_TYPE_SELECTED) || 'vermin')
      : problem

    errorSummary.errorList.push({
      text: `Select 'yes' if the ${selectedProblem} has caused you a problem before`,
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswers = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

export default createRecurringRoutes
