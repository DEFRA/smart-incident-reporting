import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_FIND_ADDRESS
const postcodeRegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?\d[A-Za-z0-9]? ?\d[A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/ // https://stackoverflow.com/a/51885364

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (request, h) => {
    const count = request.yar.get(constants.redisKeys.COUNTER)
    if (!count) {
      console.log('inside counter function')
      request.yar.set(constants.redisKeys.COUNTER, 0)
    }
    return h.view(constants.views.SMELL_FIND_ADDRESS, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    // cleanse postcode for special characters https://design-system.service.gov.uk/patterns/addresses/#allow-different-postcode-formats
    if (request.payload.postcode) {
      request.payload.postcode = request.payload.postcode.replace(/[^\w\s]/gi, '')
    }

    // validate payload
    const errorSummary = validatePayload(request.payload)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_FIND_ADDRESS, {
        ...getContext(),
        errorSummary,
        ...request.payload
      })
    }

    const count = request.yar.get(constants.redisKeys.COUNTER)
    request.yar.set(constants.redisKeys.COUNTER, count + 1)
    console.log('Data for count', count)

    if (count > 50) {
      return h.redirect(constants.routes.SMELL_EXCEEDED_ATTEMPTS)
    } else {
      request.yar.set(constants.redisKeys.SMELL_FIND_ADDRESS, buildAnswers(request.payload))
      return h.redirect(constants.routes.SMELL_CHOOSE_ADDRESS)
    }
  }
}

const getContext = () => {
  return {
    question,
    enterAddress: constants.routes.SMELL_LOCATION_ADDRESS
  }
}

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  if (!payload.buildingDetails) {
    errorSummary.errorList.push({
      text: 'Enter a building number or name',
      href: '#buildingDetails'
    })
  }

  if (!payload.postcode) {
    errorSummary.errorList.push({
      text: 'Enter an postcode',
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
  return [{
    ...baseAnswer,
    answerId: question.answers.buildingDetails.answerId,
    otherDetails: payload.buildingDetails
  },
  {
    ...baseAnswer,
    answerId: question.answers.postcode.answerId,
    otherDetails: payload.postcode
  },
  {
    searchCount: 1
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_FIND_ADDRESS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_FIND_ADDRESS,
    handler: handlers.post
  }
]
