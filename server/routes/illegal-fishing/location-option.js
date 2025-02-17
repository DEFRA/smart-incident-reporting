import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_LOCATION_OPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_LOCATION_OPTION, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_LOCATION_OPTION, {
        ...getContext(request),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_LOCATION_OPTION, buildAnswers(answerId))

    // handle redirects
    if (answerId === question.answers.map.answerId) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_LOCATION_MAP)
    } else {
      return h.redirect(constants.routes.ILLEGAL_FISHING_LOCATION_DESCRIPTION)
    }
  }
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select how you\'d prefer to give the location',
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
    path: constants.routes.ILLEGAL_FISHING_LOCATION_OPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_LOCATION_OPTION,
    handler: handlers.post
  }
]
