import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createSourceRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const errorText = `Select a type of place or activity where the ${problem} is coming from`

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_SOURCE, {
        question,
        problem,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      let { answerId } = request.payload

      const errorSummary = getErrorSummary()
      if (!answerId) {
        errorSummary.errorList.push({ text: errorText, href: '#answerId' })
      }

      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_SOURCE, {
          question,
          problem,
          errorSummary,
          ...serviceDetails
        })
      }

      answerId = Number(answerId)

      request.yar.set(constants.redisKeys.RARS_SOURCE, [{ ...baseAnswer, answerId }])

      return h.redirect(redirect)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

export default createSourceRoutes
