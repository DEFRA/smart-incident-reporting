import constants from '../../utils/constants.js'
import { getErrorSummary, validateEmail } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const emailRequired = checkAnswer(request)
    return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
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
      return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
        ...getContext(request),
        errorSummary,
        emailRequired
      })
    }

    if (emailRequired && (answerId === question.answers.yes.answerId)) {
      request.yar.set(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS, {
        reporterName: '',
        reporterPhoneNumber: '',
        reporterEmailAddress: request.payload.email
      })
    } else if (emailRequired && (answerId === question.answers.no.answerId)) {
      request.yar.set(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS, {
        reporterName: '',
        reporterPhoneNumber: '',
        reporterEmailAddress: ''
      })
    } else {
      // do nothing
    }
    request.yar.set(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO, buildAnswers(answerId))

    // handle redirects
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
  }
}

const getContext = (request) => {
  const { reporterEmailAddress } = request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS)
  const answers = request.yar.get(question.key)

  return {
    question,
    answers,
    email: reporterEmailAddress
  }
}

const validatePayload = (request, answerId, emailRequired) => {
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select yes if you want to send us any images or videos',
      href: '#answerId'
    })
  }

  if ((answerId === question.answers.yes.answerId) && emailRequired) {
    if (!request.payload.email) {
      errorSummary.errorList.push({
        text: 'Enter an email address',
        href: '#email'
      })
    } else if (!validateEmail(request.payload.email)) {
      errorSummary.errorList.push({
        text: 'Enter an email address in the correct format, like name@example.com',
        href: '#email'
      })
    } else {
      // do nothing
    }
  }

  return errorSummary
}

const checkAnswer = request => {
  const contactQuestion = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_CONTACT
  const contactAnswerData = request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT)
  const contactAnswer = contactAnswerData ? contactAnswerData[0].answerId : ''
  return contactAnswer === contactQuestion.answers.no.answerId
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
    path: constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_IMAGES_OR_VIDEO,
    handler: handlers.post
  }
]
