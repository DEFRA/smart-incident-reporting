import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_EFFECT_ON_WILDLIFE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_EFFECT_ON_WILDLIFE, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId, yesDetails } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_EFFECT_ON_WILDLIFE, {
        ...getContext(request),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE, buildAnswers(answerId, yesDetails))

    // handle redirection
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_CONTACT)
  }
}

const getContext = (request) => {
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
      text: 'Select yes if you\'ve seen dead or distressed fish or other animals nearby',
      href: '#answerId'
    })
  }
  return errorSummary
}

const buildAnswers = (answerId, yesDetails) => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })

  if (answerId === question.answers.yes.answerId && yesDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.yesDetails.answerId,
      otherDetails: yesDetails
    })
  }

  return answers
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_EFFECT_ON_WILDLIFE,
    handler: handlers.post
  }
]
