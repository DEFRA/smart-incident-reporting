import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const sharedYesNo = 'shared/yes-no'
const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_CONTACT

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(sharedYesNo, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(sharedYesNo, {
        ...getContext(),
        errorSummary
      })
    }
    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.WATER_POLLUTION_CONTACT, buildAnswers(answerId))

    // handle redirects
    if (answerId === question.answers.yes.answerId) {
      return h.redirect(constants.routes.WATER_POLLUTION_CONTACT_DETAILS)
    } else {
      request.yar.clear(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS)
      request.yar.set(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS, {
        reporterName: '',
        reporterPhoneNumber: '',
        reporterEmailAddress: ''
      })
      return h.redirect(constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO)
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
      text: 'Select yes if we can contact you',
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
    path: constants.routes.WATER_POLLUTION_CONTACT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_CONTACT,
    handler: handlers.post
  }
]
