import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.BLOCKAGE.questions.BLOCKAGE_HISTORY

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_HISTORY, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId, yesDetails } = request.payload

    // convert answerId to number
    answerId = Number(answerId)

    // validate payload
    const errorSummary = validatePayload(answerId, yesDetails)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_HISTORY, {
        ...getContext(request),
        errorSummary,
        yesChecked: answerId === question.answers.yes.answerId
      })
    }
    request.yar.set(question.key, buildAnswers(answerId, yesDetails))
    // handle redirects
    return h.redirect(constants.routes.BLOCKAGE_EXTENT)
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
      text: 'Select whether the blockage has been here for some time or \'you do not know\'',
      href: '#answerId'
    })
  } else if (Number(answerId) === question.answers.yes.answerId && !yesDetails) {
    errorSummary.errorList.push({
      text: 'Enter details about how long the blockage has been here',
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
    path: constants.routes.BLOCKAGE_HISTORY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_HISTORY,
    handler: handlers.post
  }
]
