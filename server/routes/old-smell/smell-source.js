import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

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
    // validate payload
    const errorSummary = validatePayload(request.payload)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_SOURCE, {
        ...getContext(),
        errorSummary,
        ...request.payload
      })
    }

    request.yar.set(constants.redisKeys.SMELL_SOURCE, buildAnswers(request.payload))

    return h.redirect(constants.routes.SMELL_DESCRIPTION)
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  if (!payload.smellSource) {
    errorSummary.errorList.push({
      text: 'Select yes if you know where the smell is coming from',
      href: '#smellSource'
    })
  } else if (payload.smellSource === 'yes' && payload.yesDetails === '') {
    errorSummary.errorList.push({
      text: 'Give details about the source of the smell',
      href: '#yesDetails'
    })
  } else {
    // do nothing
  }

  return errorSummary
}

const buildAnswers = payload => {
  const answers = [{
    ...baseAnswer,
    answerId: payload.smellSource === 'yes' ? question.answers.yes.answerId : question.answers.no.answerId
  }]
  if (payload.smellSource === 'yes') {
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
    path: constants.routes.SMELL_SOURCE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_SOURCE,
    handler: handlers.post
  }
]
