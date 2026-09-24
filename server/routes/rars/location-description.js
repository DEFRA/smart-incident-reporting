import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'

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
      return h.view(constants.views.RARS_LOCATION_DESCRIPTION, {
        problem,
        ...serviceDetails,
        ...getContext(request)
      })
    },
    post: async (request, h) => {
      const { locationDescription } = request.payload

      // validate payload
      const errorSummary = validatePayload(locationDescription)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_DESCRIPTION, {
          problem,
          ...serviceDetails,
          ...getContext(request),
          errorSummary
        })
      }

      request.yar.set(constants.redisKeys.RARS_LOCATION_DESCRIPTION, buildAnswers(locationDescription))

      if (problem === 'vermin/pests') {
        return h.redirect(redirect.recurring)
      }
      return h.redirect(redirect.description)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = request => {
  return {
    question,
    answers: request.yar.get(constants.redisKeys.RARS_LOCATION_DESCRIPTION)
  }
}

const validatePayload = locationDescription => {
  const errorSummary = getErrorSummary()
  if (!locationDescription) {
    errorSummary.errorList.push({
      text: 'Enter a description of the location',
      href: '#locationDescription'
    })
  } else if (maxLength(locationDescription, constants.locationDescriptionCharacterLimit)) {
    errorSummary.errorList.push({
      text: `Location description must be ${constants.locationDescriptionCharacterLimit} characters or less`,
      href: '#locationDescription'
    })
  } else {
    // do nothing
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
