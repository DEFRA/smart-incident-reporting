import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.BLOCKAGE.questions.BLOCKAGE_FLOOD_RISK

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_FLOOD_RISK, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_FLOOD_RISK, {
        ...getContext(request),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.BLOCKAGE_FLOOD_RISK, buildAnswers(answerId))

    // handle redirects
    if (answerId === question.answers.alreadyFlooding.answerId || answerId === question.answers.yes.answerId) {
      return h.redirect(constants.routes.BLOCKAGE_FLOOD_RISK_DANGER)
    } else {
      return h.redirect(constants.routes.BLOCKAGE_OWNER)
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
      text: 'Select whether the blockage will cause a flood or \'you do not know\'',
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswers = (answerId) => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.BLOCKAGE_FLOOD_RISK,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_FLOOD_RISK,
    handler: handlers.post
  }
]
