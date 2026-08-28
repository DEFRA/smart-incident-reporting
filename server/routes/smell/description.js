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
    ...serviceDetails,
    ...getContext(request)
  }),
  post: async (request, h) => {
    let { answerId, somethingElseDetails } = request.payload

    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      request.yar.set(question.key, [])
      return h.view(constants.views.SMELL_DESCRIPTION, {
        errorSummary,
        ...serviceDetails,
        ...getContext(request)
      })
    }

    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    request.yar.set(question.key, buildAnswers(answerId, somethingElseDetails))

    return h.redirect(constants.routes.SMELL_RECURRING)
  }
}

const buildAnswers = (answerId, somethingElseDetails) => {
  const answers = []
  answerId.forEach(item => {
    answers.push({
      ...baseAnswer,
      answerId: Number(item)
    })
  })

  if (answerId.includes(question.answers.somethingElse.answerId.toString()) && somethingElseDetails) {
    answers.push({
      ...baseAnswer,
      answerId: question.answers.somethingElseDetails.answerId,
      otherDetails: somethingElseDetails
    })
  }

  return answers
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
  if (!answerId || answerId.length === 0) {
    errorSummary.errorList.push({
      text: 'Select the description of the smell',
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
