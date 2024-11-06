import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_SOURCE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_SOURCE, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId, yesDetails } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId, yesDetails)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_SOURCE, {
        ...getContext(request),
        errorSummary,
        yesChecked: Number(answerId) === question.answers.yes.answerId
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(question.key, buildAnswers(answerId, yesDetails))

    // handle redirects
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO)
  }
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers
  }
}

const validatePayload = (answerId, yesDetails) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Answer yes if you know where the pollution is coming from',
      href: '#answerId'
    })
  } else if (Number(answerId) === question.answers.yes.answerId && !yesDetails) {
    errorSummary.errorList.push({
      text: 'Enter details about where the pollution is coming from',
      href: '#yesDetails'
    })
  } else {
    // do nothing (sonarcloud made me do this)
  }
  return errorSummary
}

const buildAnswers = (answerId, yesDetails) => {
  const answers = []
  answers.push({
    ...baseAnswer,
    answerId
  })
  if (answerId === question.answers.yes.answerId) {
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
    path: constants.routes.WATER_POLLUTION_SOURCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_SOURCE,
    handler: handlers.post
  }
]
