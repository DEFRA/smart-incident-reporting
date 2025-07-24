import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_DESCRIPTION_DETAILS

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_DESCRIPTION_DETAILS, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    const { descriptionDetails, vehicleRegistration } = request.payload

    // validate payload
    const errorSummary = validatePayload(descriptionDetails)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_DESCRIPTION_DETAILS, {
        ...getContext(),
        ...request.payload,
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_DESCRIPTION_DETAILS, buildAnswers(descriptionDetails, vehicleRegistration))

    return h.redirect(constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = descriptionDetails => {
  const errorSummary = getErrorSummary()
  if (!descriptionDetails) {
    errorSummary.errorList.push({
      text: 'Enter a description of the people involved',
      href: '#descriptionDetails'
    })
  }
  return errorSummary
}

const buildAnswers = (descriptionDetails, vehicleRegistration) => {
  return [{
    ...baseAnswer,
    answerId: question.answers.descriptionDetails.answerId,
    otherDetails: descriptionDetails
  }, {
    ...baseAnswer,
    answerId: question.answers.vehicleRegistration.answerId,
    otherDetails: vehicleRegistration
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_DESCRIPTION_DETAILS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_DESCRIPTION_DETAILS,
    handler: handlers.post
  }
]
