import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_PREVIOUSLY_REPORTED

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_PREVIOUSLY_REPORTED, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_PREVIOUSLY_REPORTED, {
        ...getContext(),
        errorSummary
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.SMELL_PREVIOUSLY_REPORTED, buildAnswers(answerId))

    if (answerId === question.answers.yes.answerId) {
      return h.redirect(constants.routes.SMELL_DATE_TIME)
    } else {
      return h.redirect(constants.routes.SMELL_RECURRING)
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
      text: 'Select yes if you\'ve reported the smell before',
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
    path: constants.routes.SMELL_PREVIOUSLY_REPORTED,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_PREVIOUSLY_REPORTED,
    handler: handlers.post
  }
]
