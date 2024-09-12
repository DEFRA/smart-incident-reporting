import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_SMELL_STRENGTH

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const currentAnswer = request.yar.get(constants.redisKeys.SMELL_CURRENT)
    const current = currentAnswer && currentAnswer[0].answerId === questionSets.SMELL.questions.SMELL_CURRENT.answers.yes.answerId
    return h.view(constants.views.SMELL_SMELL_STRENGTH, {
      ...getContext(),
      current
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload
    const currentAnswer = request.yar.get(constants.redisKeys.SMELL_CURRENT)
    const current = currentAnswer && currentAnswer[0].answerId === questionSets.SMELL.questions.SMELL_CURRENT.answers.yes.answerId

    // validate payload
    const errorSummary = validatePayload(answerId, current)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_SMELL_STRENGTH, {
        ...getContext(),
        errorSummary,
        current
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.SMELL_SMELL_STRENGTH, buildAnswers(answerId))

    return h.redirect(constants.routes.SMELL_INDOORS)
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = (answerId, current) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: `Select how strong the smell ${current ? 'is' : 'was'}`,
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
    path: constants.routes.SMELL_SMELL_STRENGTH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_SMELL_STRENGTH,
    handler: handlers.post
  }
]
