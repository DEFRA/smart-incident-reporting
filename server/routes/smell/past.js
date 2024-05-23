import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_PAST

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true,
  answerId: question.answers.howLong.answerId
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_PAST, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    const { howLong: otherDetails } = request.payload
    request.yar.set(constants.redisKeys.SMELL_PAST, buildAnswers(otherDetails))
    return h.redirect(constants.routes.SMELL_DATE_TIME)
  }
}

const getContext = () => {
  return {
    question
  }
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
    path: constants.routes.SMELL_PAST,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_PAST,
    handler: handlers.post
  }
]
