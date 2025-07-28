import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question01 = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_DESCRIPTION_DETAILS
const question02 = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_VEHICLE_REGISTERATION_DETAILS

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

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_DESCRIPTION_DETAILS, [{
      questionId: question01.questionId,
      questionAsked: question01.text,
      questionResponse: true,
      answerId: question01.answers.descriptionDetails.answerId,
      otherDetails: descriptionDetails
    }])
    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_VEHICLE_REGISTERATION_DETAILS, [{
      questionId: question02.questionId,
      questionAsked: question02.text,
      questionResponse: true,
      answerId: question02.answers.vehicleRegistration.answerId,
      otherDetails: vehicleRegistration
    }])

    return h.redirect(constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)
  }
}

const getContext = () => {
  return {
    question01,
    question02
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
