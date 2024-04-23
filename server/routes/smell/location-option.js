import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_LOCATION_OPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_LOCATION_OPTION, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_LOCATION_OPTION, {
        ...getContext(),
        errorSummary
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.SMELL_LOCATION_OPTION, buildAnswers(answerId))

    if (answerId === question.answers.address.answerId) {
      return h.redirect(constants.routes.SMELL_LOCATION_ADDRESS)
    } else {
      return h.redirect(constants.routes.SMELL_LOCATION_DESCRIPTION)
    }
  }
}

const getContext = () => {
  return {
    question
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
    path: constants.routes.SMELL_LOCATION_OPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_LOCATION_OPTION,
    handler: handlers.post
  }
]
