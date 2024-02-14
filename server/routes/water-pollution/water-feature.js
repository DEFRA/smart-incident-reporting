import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_WATER_FEATURE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.WATER_POLLUTION_WATER_FEATURE, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId, otherSource } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_WATER_FEATURE, {
        errorSummary,
        ...getContext()
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_WATER_FEATURE, buildAnswers(answerId, otherSource))

    // handle redirection
    if (answerId === question.answers.lakeOrReservoir.answerId || answerId === question.answers.sea.answerId) {
      return h.redirect(constants.routes.WATER_POLLUTION_LESS_THAN_100_SQ_METRES)
    } else {
      return h.redirect(constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES)
    }
  }
}

const buildAnswers = (answerId, otherSource) => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })

  if (answerId === question.answers.somethingElse.answerId && otherSource) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetails.answerId,
      otherDetails: otherSource
    })
  }

  return answers
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
      text: 'Select a type of watercourse or feature, or you do not know',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_WATER_FEATURE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_WATER_FEATURE,
    handler: handlers.post
  }
]
