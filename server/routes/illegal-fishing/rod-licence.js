import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ROD_LICENCE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.noRodLicenceDetails.answerId
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_ROD_LICENCE, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    const { noRodLicenceDescription } = request.payload

    // validate payload
    const errorSummary = validatePayload(noRodLicenceDescription)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_ROD_LICENCE, {
        ...getContext(),
        errorSummary
      })
    }

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_ROD_LICENCE, buildAnswers(noRodLicenceDescription))

    return h.redirect(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = noRodLicenceDescription => {
  const errorSummary = getErrorSummary()
  if (!noRodLicenceDescription) {
    errorSummary.errorList.push({
      text: 'Enter how you know the people fishing do not have a rod licence',
      href: '#noRodLicenceDescription'
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
    path: constants.routes.ILLEGAL_FISHING_ROD_LICENCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_ROD_LICENCE,
    handler: handlers.post
  }
]
