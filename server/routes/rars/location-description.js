import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const createLocationDescriptionRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const answers = request.yar.get(constants.redisKeys.RARS_LOCATION_DESCRIPTION)
      return h.view(constants.views.RARS_LOCATION_DESCRIPTION, {
        question,
        problem,
        answers,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      const { locationDescription } = request.payload

      // validate payload
      const errorSummary = validatePayload(locationDescription)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_DESCRIPTION, {
          question,
          problem,
          errorSummary,
          ...serviceDetails
        })
      }

      request.yar.set(constants.redisKeys.RARS_LOCATION_DESCRIPTION, buildAnswers(locationDescription))

      return h.redirect(redirect.when)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const validatePayload = locationDescription => {
  const errorSummary = getErrorSummary()
  if (!locationDescription) {
    errorSummary.errorList.push({
      text: 'Enter a description of the location',
      href: '#locationDescription'
    })
  }
  return errorSummary
}

const buildAnswers = otherDetails => {
  return [{
    ...baseAnswer,
    otherDetails
  }]
}

export default createLocationDescriptionRoutes
