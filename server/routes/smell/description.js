import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.SMELL_DESCRIPTION
const serviceDetails = getServiceDetails('smell')

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => h.view(constants.views.SMELL_DESCRIPTION, {
    ...getContext(request)
  }),
  post: async (request, h) => {
    let { answerId } = request.payload

    // convert answerId to number
    answerId = Number(answerId)

    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_DESCRIPTION, {
        errorSummary,
        ...getContext(request)
      })
    }

    request.yar.set(question.key, buildAnswers(answerId))

    return h.redirect(constants.routes.SMELL_RECURRING)
  }
}

const buildAnswers = answerId => {
  return [{
    ...baseAnswer,
    answerId
  }]
}

const getContext = request => {
  const answers = request.yar.get(question.key)
  return {
    question,
    answers,
    ...serviceDetails
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select how you would describe the smell',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_DESCRIPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_DESCRIPTION,
    handler: handlers.post
  }
]
