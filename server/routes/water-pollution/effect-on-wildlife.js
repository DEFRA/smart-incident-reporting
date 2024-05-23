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
  get: async (_request, h) => {
    return h.view(constants.views.WATER_POLLUTION_EFFECT_ON_WILDLIFE, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    // validate payload
    const errorSummary = validatePayload(request.payload)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_EFFECT_ON_WILDLIFE, {
        ...getContext(),
        errorSummary,
        ...request.payload
      })
    }

    request.yar.set(constants.redisKeys.WATER_POLLUTION_EFFECT_ON_WILDLIFE, buildAnswers(request.payload))

    return h.redirect(constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  if (!payload.effectOnWildlife) {
    errorSummary.errorList.push({
      text: 'Select yes if you\'ve seen dead or distressed fish or other animals nearby',
      href: '#effectOnWildlife'
    })
  }
  return errorSummary
}

const buildAnswers = payload => {
  const answers = [{
    ...baseAnswer,
    answerId: payload.effectOnWildlife === 'yes' ? question.answers.yes.answerId : question.answers.no.answerId
  }]
  if (payload.effectOnWildlife === 'yes' && payload.yesDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.yesDetails.answerId,
      otherDetails: payload.yesDetails
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
