import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'
const question = questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_ACTIVITY

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => h.view(constants.views.ILLEGAL_FISHING_ACTIVITY, {
    ...getContext(request)
  }),
  post: async (request, h) => {
    // get payload
    let { answerId, somethingElseDetails } = request.payload

    // validate payload for errors
    const errorSummary = validatePayload(answerId)
    if (errorSummary.errorList.length > 0) {
      request.yar.set(question.key, [])
      return h.view(constants.views.ILLEGAL_FISHING_ACTIVITY, {
        errorSummary,
        ...getContext(request)
      })
    }

    // Convert answer to array if only a single string answer
    if (!Array.isArray(answerId)) {
      answerId = [answerId]
    }

    // set answer in session
    request.yar.set(question.key, buildAnswers(answerId, somethingElseDetails))

    // handle redirects
    const selectedAnswers = answerId.map(Number)
    if (selectedAnswers.length === 1 && selectedAnswers[0] === question.answers.withoutPermission.answerId) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_CONTACT_OWNER_OR_POLICE)
    } else if (selectedAnswers.includes(question.answers.withoutRodLicense.answerId)) {
      return h.redirect(constants.routes.ILLEGAL_FISHING_ROD_LICENCE)
    } else {
      return h.redirect(constants.routes.ILLEGAL_FISHING_LOCATION_OPTION)
    }
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

  if (answerId.indexOf(question.answers.somethingElse.answerId.toString()) > -1 && somethingElseDetails) {
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
    answers
  }
}

const validatePayload = answerId => {
  const errorSummary = getErrorSummary()
  if (!answerId || answerId.length === 0) {
    errorSummary.errorList.push({
      text: 'Select the illegal activity you want to report',
      href: '#answerId'
    })
  }
  return errorSummary
}

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_ACTIVITY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_ACTIVITY,
    handler: handlers.post
  }
]
