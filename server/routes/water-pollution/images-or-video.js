import constants from '../../utils/constants.js'
import { getErrorSummary, validateEmail } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO
const contactQuestion = questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_CONTACT

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    let { answerId } = request.payload

    // validate payload
    const errorSummary = validatePayload(request, answerId)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.WATER_POLLUTION_IMAGES_OR_VIDEO, {
        ...getContext(request),
        errorSummary
      })
    }

    // convert answerId to number
    answerId = Number(answerId)

    request.yar.set(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO, buildAnswers(answerId))

    // handle redirects
    return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.WATER_POLLUTION_OTHER_INFORMATION)
  }
}

const getContext = (request) => {
  const contactAnswer = request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT)
  let emailRequired = false
  if (contactAnswer[0].answerId === contactQuestion.answers.no.answerId) {
    emailRequired = true
  }
  const contactDetailsAnswer = request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS)
  let email
  if (contactDetailsAnswer) {
    console.log('Data for contactDetailsAnswer', contactDetailsAnswer)
    email = contactDetailsAnswer.reporterEmailAddress
  }
  return {
    question,
    emailRequired,
    email
  }
}

const validatePayload = (request, answerId) => {
  const contactAnswer = request.yar.get(constants.redisKeys.WATER_POLLUTION_CONTACT)
  let emailRequired = false
  if (contactAnswer[0].answerId === contactQuestion.answers.no.answerId) {
    emailRequired = true
  }
  const errorSummary = getErrorSummary()
  if (!answerId) {
    errorSummary.errorList.push({
      text: 'Select yes if you want to send us any images or videos',
      href: '#answerId'
    })
  }

  if (emailRequired) {
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
