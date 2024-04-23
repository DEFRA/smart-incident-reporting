import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_LOCATION_ADDRESS
const postcodeRegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?\d[A-Za-z0-9]? ?\d[A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/ // https://stackoverflow.com/a/51885364

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_LOCATION_ADDRESS, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    // validate payload
    const errorSummary = validatePayload(request.payload)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_LOCATION_ADDRESS, {
        ...getContext(),
        errorSummary,
        ...request.payload
      })
    }

    request.yar.set(constants.redisKeys.SMELL_LOCATION_ADDRESS, buildAnswers(request.payload))

    return h.redirect(constants.routes.SMELL_SOURCE)
  }
}

const getContext = () => {
  return {
    question
  }
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
      text: 'Enter the town or city',
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
  }
  return errorSummary
}

const buildAnswers = payload => {
  const answers = []
  Object.keys(payload).forEach(key => {
    if (key !== 'homeAddress') {
      answers.push({
        ...baseAnswer,
        answerId: question.answers[key].answerId,
        otherDetails: payload[key]
      })
    } else {
      answers.push({
        ...baseAnswer,
        answerId: question.answers[key].answerId
      })
    }
  })

  return answers
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_LOCATION_ADDRESS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_LOCATION_ADDRESS,
    handler: handlers.post
  }
]
