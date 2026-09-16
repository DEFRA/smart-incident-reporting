import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_MEDICAL_HELP

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createMedicalHelpRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_MEDICAL_HELP, {
        question,
        problem,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      let { answerId } = request.payload

      const errorSummary = validatePayload(answerId, request, problem)
      if (errorSummary && errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_MEDICAL_HELP, {
          question,
          problem,
          errorSummary,
          ...serviceDetails
        })
      }
      // convert the answerID to number
      answerId = Number(answerId)

      request.yar.set(constants.redisKeys.RARS_MEDICAL_HELP, buildAnswer(answerId))
      return h.redirect(redirect.imagesOrVideo)
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
      text: `Select 'yes' if you have had to get any medical help, or treatment because of the ${selectedProblem}`,
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswer = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

export default createMedicalHelpRoutes
