import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_DESCRIPTION_OPTIONAL

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const createLocationDescriptionOptionalRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_LOCATION_DESCRIPTION_OPTIONAL, {
        problem,
        ...serviceDetails,
        ...getContext(request)
      })
    },
    post: async (request, h) => {
      const { otherLocationInfo } = request.payload

      const errorSummary = validatePayload(otherLocationInfo)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_DESCRIPTION_OPTIONAL, {
          problem,
          ...serviceDetails,
          question,
          answers: otherLocationInfo,
          errorSummary
        })
      }

      if (otherLocationInfo) {
        request.yar.set(question.key, buildAnswers(otherLocationInfo))
      }
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
  const answers = request.yar.get(question.key)
  return {
    question,
    answers: answers?.[0]?.otherDetails
  }
}

const buildAnswers = (otherDetails) => {
  return [{
    ...baseAnswer,
    otherDetails
  }]
}

const validatePayload = otherLocationInfo => {
  const errorSummary = getErrorSummary()
  if (maxLength(otherLocationInfo, constants.locationDescriptionCharacterLimit)) {
    errorSummary.errorList.push({
      text: `Other location information must be ${constants.locationDescriptionCharacterLimit} characters or less`,
      href: '#otherLocationInfo'
    })
  }
  return errorSummary
}

export default createLocationDescriptionOptionalRoutes
