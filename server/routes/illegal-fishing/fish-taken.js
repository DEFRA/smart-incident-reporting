import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_FISH_TAKEN

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_FISH_TAKEN, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_FISH_TAKEN, {
        ...getContext(),
        errorSummary
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_FISH_TAKEN, buildAnswers(answerId))

    if (answerId === question.answers.yes.answerId) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_NUMBER_OF_FISH)
    } else {
      return h.redirect(constants.routes.ILLEGAL_FISHING_ANGLING_TRUST)
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
      text: 'Select \'yes\' if you have seen fish being taken',
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
    path: constants.routes.ILLEGAL_FISHING_FISH_TAKEN,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_FISH_TAKEN,
    handler: handlers.post
  }
]
