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

      const errorSummary = validatePayload(answerId, problem)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_SOURCE, {
          question,
          problem,
          errorSummary,
          ...serviceDetails
        })
      }

      answerId = Number(answerId)

      request.yar.set(constants.redisKeys.RARS_SOURCE, buildAnswers(answerId))

      // handle redirects
      console.log('answerId: ', answerId)
      if (answerId === question.answers.local.answerId || answerId === question.answers.neighbour.answerId) {
        return h.redirect(redirect.localCouncil)
      } else if (answerId === question.answers.unknown.answerId) {
        return h.redirect(redirect.contactEnvironmentAgency)
      } else {
        return h.redirect(redirect.sourceDetails)
      }
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const buildAnswers = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

const validatePayload = (answerId, problem) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: `Select a type of place or activity where the ${problem} is coming from`,
      href: '#answerId'
    })
  }
  return errorSummary
}

export default createSourceRoutes
