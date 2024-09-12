import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.SMELL.questions.SMELL_SOURCE

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_SOURCE, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    // get payload
    let { answerId } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_SOURCE, {
        ...getContext(),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    // set answer in session
    request.yar.set(constants.redisKeys.SMELL_SOURCE, buildAnswers(answerId))
    if (answerId === question.answers.wasteSite.answerId || answerId === question.answers.industry.answerId || answerId === question.answers.sewage.answerId || answerId === question.answers.wasteSpreading.answerId) {
      return h.redirect(constants.routes.SMELL_SOURCE_DETAILS)
    } else if (answerId === question.answers.local.answerId || answerId === question.answers.neighbour.answerId || answerId === question.answers.rubbish.answerId) {
      return h.redirect(constants.routes.SMELL_REPORT_LOCAL_COUNCIL)
    } else (answerId === question.answers.unknown.answerId) {
      return h.redirect(constants.routes.SMELL_CONTACT_LOCAL_COUNCIL)
    }
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
    question
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select a type of place or activity where the smell is coming from',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_SOURCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_SOURCE,
    handler: handlers.post
  }
]
