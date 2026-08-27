import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_NUMBER_OF_FISH

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_NUMBER_OF_FISH, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_NUMBER_OF_FISH, {
        errorSummary,
        ...getContext(request)
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_NUMBER_OF_FISH, buildAnswers(answerId))
    return h.redirect(constants.routes.ILLEGAL_FISHING_ANGLING_TRUST)
  }
}

const buildAnswers = (answerId) => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })

  return answers
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
      text: 'Select how many fish or \'you do not know\'',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_NUMBER_OF_FISH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_NUMBER_OF_FISH,
    handler: handlers.post
  }
]
