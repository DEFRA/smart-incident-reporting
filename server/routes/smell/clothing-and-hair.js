import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.SMELL_CLOTHING_AND_HAIR
const serviceDetails = getServiceDetails('smell')

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.SMELL_CLOTHING_AND_HAIR, {
      ...getContext(request),
      ...serviceDetails
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload
    const { current } = getContext(request)

    // validate payload for errors
    const errorSummary = validatePayload(answerId, current)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_CLOTHING_AND_HAIR, {
        ...getContext(request),
        errorSummary,
        ...serviceDetails
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(question.key, buildAnswers(answerId))

    return h.redirect(constants.routes.SMELL_EFFECT_ON_DAILY_LIFE)
  }
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers,
    current: isCurrent(request)
  }
}

const isCurrent = request => {
  const optionNow = 1
  return request.yar.get(constants.redisKeys.DATE_TIME_OPTION) === optionNow
}

const validatePayload = (answerId, current) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: `Select 'yes' if the smell ${current ? 'sticks' : 'stuck'} to your clothing or hair`,
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
    path: constants.routes.SMELL_CLOTHING_AND_HAIR,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_CLOTHING_AND_HAIR,
    handler: handlers.post
  }
]
