import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_IMAGES_OR_VIDEO, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_IMAGES_OR_VIDEO, {
        ...getContext(request),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.SMELL_IMAGES_OR_VIDEO, buildAnswers(answerId))

    // handle redirects
    return h.redirect(constants.routes.SMELL_OTHER_INFORMATION)
  }
}

const getContext = (request) => {
  const { reporterEmailAddress } = request.yar.get(constants.redisKeys.HOME)
  return {
    question,
    reporterEmailAddress
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select yes if you want to send us any images or videos',
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswers = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_IMAGES_OR_VIDEO,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_IMAGES_OR_VIDEO,
    handler: handlers.post
  }
]
