import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_LOCATION_ADDRESS
const { postcodeRegExp } = constants

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createLocationAddressRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)
  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_LOCATION_ADDRESS, {
        ...serviceDetails,
        question
      })
    },
    post: async (request, h) => {
      if (request.payload.postcode) {
        request.payload.postcode = request.payload.postcode.replace(/[^\w\s]/gi, '')
      }

      const errorSummary = validatePayload(request.payload)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_LOCATION_ADDRESS, {
          question,
          errorSummary,
          ...serviceDetails,
          ...request.payload
        })
      }

      request.yar.set(constants.redisKeys.RARS_LOCATION_ADDRESS, buildAnswers(request.payload))

      if (problem === 'vermin') {
        return h.redirect(redirect.recurring)
      }
      return h.redirect(redirect.description)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  if (!payload.addressLine1) {
    errorSummary.errorList.push({
      text: 'Enter the first line of the address, for example house number and street',
      href: '#addressLine1'
    })
  }
  if (!payload.townOrCity) {
    errorSummary.errorList.push({
      text: 'Enter a town or city',
      href: '#townOrCity'
    })
  }
  if (!payload.postcode) {
    errorSummary.errorList.push({
      text: 'Enter a postcode',
      href: '#postcode'
    })
  } else if (!postcodeRegExp.test(payload.postcode)) {
    errorSummary.errorList.push({
      text: 'Enter a full postcode, for example W1 8QS',
      href: '#postcode'
    })
  } else {
    // do nothing
  }
  return errorSummary
}

const buildAnswers = payload => {
  const answers = []
  Object.keys(payload).forEach(key => {
    answers.push({
      ...baseAnswer,
      answerId: question.answers[key].answerId,
      otherDetails: payload[key]
    })
  })
  return answers
}

export default createLocationAddressRoutes
