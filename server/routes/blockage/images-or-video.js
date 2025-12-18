import constants from '../../utils/constants.js'
import { getErrorSummary, validateEmail } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const emailRequired = checkAnswer(request)
    return h.view(constants.views.BLOCKAGE_IMAGES_OR_VIDEO, {
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
      return h.view(constants.views.BLOCKAGE_IMAGES_OR_VIDEO, {
        ...getContext(request),
        errorSummary,
        emailRequired,
        yesChecked: answerId === question.answers.yes.answerId
      })
    }

    if (emailRequired && (answerId === question.answers.yes.answerId)) {
      const { detailsName, detailsPhone } = request.yar.get(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS)
      request.yar.set(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS, {
        detailsName,
        detailsPhone,
        detailsEmail: request.payload.email
      })
    }

    request.yar.set(constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO, buildAnswers(answerId))

    // update handle redirects
    return h.redirect(constants.routes.BLOCKAGE_START)
  }
}

const getContext = (request) => {
  const { detailsEmail } = request.yar.get(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS)
  const answers = request.yar.get(question.key)

  return {
    question,
    answers,
    email: detailsEmail
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

  if (answerId !== question.answers.yes.answerId || !emailRequired) {
    return errorSummary
  }

  const email = request.payload.email

  if (email) {
    if (!validateEmail(email)) {
      errorSummary.errorList.push({
        text: 'Enter an email address in the correct format, like name@example.com',
        href: '#email'
      })
    }
    return errorSummary
  }

  errorSummary.errorList.push({
    text: 'Enter an email address',
    href: '#email'
  })

  return errorSummary
}

const checkAnswer = request => {
  const { detailsEmail } = request.yar.get(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS)
  return detailsEmail.length === 0
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
    path: constants.routes.BLOCKAGE_IMAGES_OR_VIDEO,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_IMAGES_OR_VIDEO,
    handler: handlers.post
  }
]
