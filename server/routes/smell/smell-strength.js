import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_STRENGTH

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const onGoingAnswer = request.yar.get(constants.redisKeys.SMELL_ONGOING)
    const onGoing = onGoingAnswer && onGoingAnswer[0].answerId === questionSets.SMELL.questions.SMELL_ONGOING.answers.yes.answerId
    return h.view(constants.views.SMELL_STRENGTH, {
      ...getContext(),
      onGoing
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload
    const onGoingAnswer = request.yar.get(constants.redisKeys.SMELL_ONGOING)
    const onGoing = onGoingAnswer && onGoingAnswer[0].answerId === questionSets.SMELL.questions.SMELL_ONGOING.answers.yes.answerId

    // validate payload
    const errorSummary = validatePayload(answerId, onGoing)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_STRENGTH, {
        ...getContext(),
        errorSummary,
        onGoing
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.SMELL_STRENGTH, buildAnswers(answerId))

    return h.redirect(constants.routes.SMELL_EFFECT_ON_ACTIVITY)
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = (answerId, onGoing) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: `Select how strong the smell ${onGoing ? 'is' : 'was'}`,
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
    path: constants.routes.SMELL_STRENGTH,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_STRENGTH,
    handler: handlers.post
  }
]
