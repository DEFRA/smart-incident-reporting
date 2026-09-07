import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'

const questionText = 'How strong is the smell?'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_SMELL_STRENGTH, {
      questionText,
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_SMELL_STRENGTH, {
        questionText,
        ...getContext(request),
        errorSummary
      })
    }

    answerId = Number(answerId)
    request.yar.set(constants.redisKeys.SMELL_SMELL_STRENGTH, answerId)

    return h.redirect(constants.routes.SMELL_LOCATION_DESCRIPTION)
  }
}

const getContext = request => {
  const answer = request.yar.get(constants.redisKeys.SMELL_SMELL_STRENGTH)
  return {
    answer
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()

  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select how strong the smell is',
      href: '#answerId'
    })
  }

  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_SMELL_STRENGTH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_SMELL_STRENGTH,
    handler: handlers.post
  }
]
