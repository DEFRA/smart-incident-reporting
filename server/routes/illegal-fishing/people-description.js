import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { getErrorSummary } from '../../utils/helpers.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_PEOPLE_DESCRIPTION

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.ILLEGAL_FISHING_PEOPLE_DESCRIPTION, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_PEOPLE_DESCRIPTION, {
        ...getContext(),
        errorSummary
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_PEOPLE_DESCRIPTION, buildAnswers(answerId))
    if (answerId === question.answers.yes.answerId) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_DESCRIPTION_DETAILS)
    } else {
      return h.redirect(constants.routes.ILLEGAL_FISHING_ILLEGAL_EQUIPMENT)
    }
  }
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
      text: 'Select \'yes\' if you can describe anyone involved',
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
    path: constants.routes.ILLEGAL_FISHING_PEOPLE_DESCRIPTION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_PEOPLE_DESCRIPTION,
    handler: handlers.post
  }
]
