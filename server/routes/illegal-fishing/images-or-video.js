import constants from '../../utils/constants.js'
import { getErrorSummary, validateEmail } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_IMAGES_OR_VIDEO

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const emailRequired = checkAnswer(request)
    return h.view(constants.views.ILLEGAL_FISHING_IMAGES_OR_VIDEO, {
      ...getContext(request),
      emailRequired
    })
  },
  post: async (request, h) => {
    const emailRequired = checkAnswer(request)
    let { answerId } = request.payload

    // convert answerId to number
    answerId = Number(answerId)

    // validate payload
    const errorSummary = validatePayload(request, answerId, emailRequired)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.ILLEGAL_FISHING_IMAGES_OR_VIDEO, {
        ...getContext(request),
        errorSummary,
        emailRequired,
        yesChecked: answerId === question.answers.yes.answerId
      })
    }

    if (emailRequired && (answerId === question.answers.yes.answerId)) {
      const { reporterName, reporterPhoneNumber } = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS)
      request.yar.set(constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS, {
        reporterName,
        reporterPhoneNumber,
        reporterEmailAddress: request.payload.email
      })
    }

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO, buildAnswers(answerId))

    // handle redirects
    return h.redirect(constants.routes.ILLEGAL_FISHING_OTHER_INFORMATION)
  }
}

const getContext = (request) => {
  const { reporterEmailAddress } = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS)
  const answers = request.yar.get(question.key)

  return {
    question,
    answers,
    email: reporterEmailAddress
  }
}

const validatePayload = (answerId) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select whether you have any photos or videos to include',
      href: '#answerId'
    })
  }

  return errorSummary
}

const checkAnswer = request => {
  const { reporterEmailAddress } = request.yar.get(constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS)
  return reporterEmailAddress.length === 0
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
    path: constants.routes.ILLEGAL_FISHING_IMAGES_OR_VIDEO,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_IMAGES_OR_VIDEO,
    handler: handlers.post
  }
]
