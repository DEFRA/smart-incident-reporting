import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails, titleHelper } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_HOME
const verminQuestion = 'Where are the {vermin} causing a problem?'

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createLocationHomeRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const { title, pageTitle } = titleHelper(request, question.text, verminQuestion, problem)
      return h.view(constants.views.RARS_LOCATION_HOME, {
        question,
        problem,
        title,
        pageTitle,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      let { answerId } = request.payload

      const errorSummary = validatePayload(answerId, problem)
      if (errorSummary.errorList.length > 0) {
        const { title, pageTitle } = titleHelper(request, question.text, verminQuestion, problem)
        return h.view(constants.views.RARS_LOCATION_HOME, {
          question,
          problem,
          title,
          pageTitle,
          errorSummary,
          ...serviceDetails
        })
      }

      answerId = Number(answerId)

      request.yar.set(constants.redisKeys.RARS_LOCATION_HOME, buildAnswers(answerId))

      if (answerId === question.answers.home.answerId) {
        return h.redirect(redirect.findAddress)
      } else {
        return h.redirect(redirect.locationOption)
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

export default createLocationHomeRoutes
