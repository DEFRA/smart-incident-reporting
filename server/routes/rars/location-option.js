import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_OPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createLocationOptionRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_LOCATION_OPTION, {
        question,
        problem,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      let { answerId } = request.payload

      // validate payload
      const errorSummary = validatePayload(answerId)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_OPTION, {
          question,
          problem,
          errorSummary,
          ...serviceDetails
        })
      }
      // convert answerId to number
      answerId = Number(answerId)

      request.yar.set(constants.redisKeys.RARS_LOCATION_OPTION, buildAnswers(answerId))

      if (answerId === question.answers.gps.answerId || answerId === question.answers.map.answerId) {
        return h.redirect(redirect.locationMap)
      } else {
        return h.redirect(redirect.locationDescription)
      }
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select how you want to give the location',
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

export default createLocationOptionRoutes
