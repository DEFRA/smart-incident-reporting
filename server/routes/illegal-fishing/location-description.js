import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_LOCATION_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_LOCATION_DESCRIPTION, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    const { locationDescription } = request.payload

    // validate payload
    const errorSummary = validatePayload(locationDescription)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_LOCATION_DESCRIPTION, {
        ...getContext(),
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_LOCATION_DESCRIPTION, buildAnswers(locationDescription))

    return h.redirect(constants.routes.ILLEGAL_FISHING_WHEN)
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = locationDescription => {
  const errorSummary = getErrorSummary()
  if (!locationDescription) {
    errorSummary.errorList.push({
      text: 'Enter a description of where you\'ve seen illegal fishing',
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

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_LOCATION_DESCRIPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_LOCATION_DESCRIPTION,
    handler: handlers.post
  }
]
