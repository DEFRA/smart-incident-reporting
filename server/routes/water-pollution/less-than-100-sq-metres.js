import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_LESS_THAN_100_SQ_METRES

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.WATER_POLLUTION_LESS_THAN_100_SQ_METRES, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_LESS_THAN_100_SQ_METRES, {
        errorSummary,
        ...getContext()
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_LESS_THAN_100_SQ_METRES, buildAnswers(answerId))

    // handle redirects
    if (answerId === question.answers.no.answerId) {
      return h.redirect(constants.routes.WATER_POLLUTION_POLLUTION_AREA)
    } else {
      return h.redirect(constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE)
    }
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = (answerId) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select yes if the pollution covers less than 100 square metres',
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
    path: constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES,
    handler: handlers.post
  }
]
