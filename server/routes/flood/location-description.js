import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
import { maxLength } from '../../utils/validation.js'

const question = questionSets.FLOOD.questions.FLOOD_LOCATION_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.locationDetails.answerId
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.FLOOD_LOCATION_DESCRIPTION, {
      ...getContext()
    })
  },
  post: async (_request, h) => {
    const { locationDescription } = _request.payload

    const errorSummary = validatePayload(locationDescription)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.FLOOD_LOCATION_DESCRIPTION, {
        ...getContext(),
        errorSummary
      })
    }

    _request.yar.set(constants.redisKeys.FLOOD_LOCATION_DESCRIPTION, buildAnswer(locationDescription))

    return h.redirect('/next-route') // Replace '/next-route' with the actual next route in your application
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = (locationDescription) => {
  const errorSummary = getErrorSummary()
  if (!locationDescription) {
    errorSummary.errorList.push({
      text: 'Enter a description of where the flood is located',
      href: '#locationDescription'
    })
  } else if (maxLength(locationDescription, constants.locationDescriptionCharacterLimit)) {
    errorSummary.errorList.push({
      text: `Description must be ${constants.locationDescriptionCharacterLimit} characters or less`,
      href: '#locationDescription'
    })
  } else {
    // do nothing
  }
  return errorSummary
}

const buildAnswer = otherDetails => {
  return [{
    ...baseAnswer,
    otherDetails
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.FLOOD_LOCATION_DESCRIPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.FLOOD_LOCATION_DESCRIPTION,
    handler: handlers.post
  }
]
