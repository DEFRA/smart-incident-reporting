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

    // handle routes based on fishing activity
    const activityQuestion = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ACTIVITY
    const activityAnswer = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_ACTIVITY)
    const illegalEquipmentSelected = activityAnswer.some(answer => Object.values(answer).includes(activityQuestion.answers.illegalFishingEquipment.answerId))
    const protectedSpeciesSelected = activityAnswer.some(answer => Object.values(answer).includes(activityQuestion.answers.protectedSpecies.answerId))

    if (illegalEquipmentSelected) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)
    } else if (protectedSpeciesSelected) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_TYPE_OF_FISH)
    } else {
      return h.redirect(constants.routes.ILLEGAL_FISHING_FISH_TAKEN)
    }
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
  if (vehicleRegistration) {
    return [{
      ...baseAnswer,
      answerId: question.answers.descriptionDetails.answerId,
      otherDetails: descriptionDetails
    },
    {
      ...baseAnswer,
      answerId: question.answers.vehicleRegistration.answerId,
      otherDetails: vehicleRegistration
    }]
  } else {
    return [{
      ...baseAnswer,
      answerId: question.answers.descriptionDetails.answerId,
      otherDetails: descriptionDetails
    }]
  }
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
