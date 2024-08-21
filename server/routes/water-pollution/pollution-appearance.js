import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_POLLUTION_APPEARANCE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_POLLUTION_APPEARANCE, {
    ...getContext()
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetail } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_POLLUTION_APPEARANCE, {
        errorSummary,
        ...getContext()
      })
    }

    // Convert answer to array if only a single string answer
    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_POLLUTION_APPEARANCE, buildAnswers(answerId, somethingElseDetail))

    return h.redirect(constants.routes.WATER_POLLUTION_SOURCE)
  }
}

const buildAnswers = (answerId, somethingElseDetail) => {
  const answers = []
  answerId.forEach(item => {
    answers.push({
      ...baseAnswer,
      answerId: Number(item)
    })
  })

  if (somethingElseDetail) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetail.answerId,
      otherDetails: somethingElseDetail
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
  if (!answerId || answerId.length === 0) {
    errorSummary.errorList.push({
      text: 'Select what the pollution looks like',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_POLLUTION_APPEARANCE,
    handler: handlers.post
  }
]
