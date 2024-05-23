import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_DESCRIPTION, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.SMELL_DESCRIPTION, buildAnswers(request.payload))

    return h.redirect(constants.routes.SMELL_PREVIOUSLY_REPORTED)
  }
}

const getContext = () => {
  return {
    question
  }
}

const buildAnswers = payload => {
  const answers = []
  let { smellDescription } = payload

  if (!Array.isArray(smellDescription)) {
    smellDescription = [smellDescription]
  }

  smellDescription.forEach(item => {
    answers.push({
      ...baseAnswer,
      answerId: Number(item)
    })
    if (Number(item) === question.answers.other.answerId) {
      answers.push({
        ...baseAnswer,
        answerId: question.answers.otherDetail.answerId,
        otherDetails: payload.otherDetail
      })
    }
  })
  if (answers.length === 0) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.youCannotDescribeIt.answerId
    })
  }

  return answers
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_DESCRIPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_DESCRIPTION,
    handler: handlers.post
  }
]
