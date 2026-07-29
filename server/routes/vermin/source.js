import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.RARS_SOURCE, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.RARS_SOURCE, {
        ...getContext(),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.RARS_SOURCE, buildAnswers(answerId))

    // handle redirects
    return h.redirect(constants.routes.VERMIN_SOURCE)
  }
}

const buildAnswers = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

const getContext = () => {
  return {
    question,
    problem: 'vermin'
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select a type of place or activity where the vermin is coming from',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.VERMIN_SOURCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.VERMIN_SOURCE,
    handler: handlers.post
  }
]
