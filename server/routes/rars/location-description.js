import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'

const question = questionSets.SMELL.questions.SMELL_LOCATION_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const createLocationDescriptionRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_LOCATION_DESCRIPTION, {
        problem,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      const { locationDescription } = request.payload

      // validate payload
      const errorSummary = validatePayload(locationDescription)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_DESCRIPTION, {
          errorSummary
        })
      }

      request.yar.set(constants.redisKeys.RARS_LOCATION_DESCRIPTION, buildAnswers(locationDescription))

      return h.redirect(constants.routes.RARS_DESCRIPTION)
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
