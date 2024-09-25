import constants from '../../utils/constants.js'
import { getErrorSummary } from '../../utils/helpers.js'
import { questionSets } from '../../utils/question-sets.js'

const question = questionSets.SMELL.questions.SMELL_SOURCE_DETAILS
const postcodeRegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?\d[A-Za-z0-9]? ?\d[A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/ // https://stackoverflow.com/a/51885364

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.SMELL_SOURCE_DETAILS, {
      ...getContext()
    })
  },
  post: async (request, h) => {
    // cleanse postcode for special characters https://design-system.service.gov.uk/patterns/addresses/#allow-different-postcode-formats
    if (request.payload.sourcePostcode) {
      request.payload.sourcePostcode = request.payload.sourcePostcode.replace(/[^\w\s]/gi, '')
    }

    // validate payload for errors
    const errorSummary = validatePayload(request.payload)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.SMELL_SOURCE_DETAILS, {
        ...getContext(),
        errorSummary,
        ...request.payload,
        yesChecked: request.payload.answerId === 'yes'
      })
    }

    // handle redirects
    if (request.payload.answerId === 'yes') {
      // set answer in session
      request.yar.set(constants.redisKeys.SMELL_SOURCE_DETAILS, buildAnswers(request.payload))
      return h.redirect(constants.routes.SMELL_LOCATION_HOME)
    } else if (request.payload.answerId === 'no') {
      return h.redirect(constants.routes.SMELL_CONTACT_LOCAL_COUNCIL)
    } else {
      // do nothing
    }

    return null
  }
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = payload => {
  const errorSummary = getErrorSummary()
  if (!payload.answerId) {
    errorSummary.errorList.push({
      text: 'Answer yes if you can give details about where the smell is coming from',
      href: '#answerId'
    })
  } else if (payload.answerId === 'yes') {
    if (!payload.siteName) {
      errorSummary.errorList.push({
        text: 'Enter a name',
        href: '#siteName'
      })
    }
    if (!payload.sourceTown) {
      errorSummary.errorList.push({
        text: 'Enter a town or city',
        href: '#sourceTown'
      })
    }
    if ((payload.sourcePostcode.length > 0) && (!postcodeRegExp.test(payload.sourcePostcode))) {
      errorSummary.errorList.push({
        text: 'Enter a full UK postcode',
        href: '#sourcePostcode'
      })
    }
  } else {
    // do nothing
  }

  return errorSummary
}

const buildAnswers = payload => {
  return [{
    ...baseAnswer,
    answerId: question.answers.siteName.answerId,
    otherDetails: payload.siteName
  }, {
    ...baseAnswer,
    answerId: question.answers.sourceAddress.answerId,
    otherDetails: payload.sourceAddress
  }, {
    ...baseAnswer,
    answerId: question.answers.sourceTown.answerId,
    otherDetails: payload.sourceTown
  },
  {
    ...baseAnswer,
    answerId: question.answers.sourcePostcode.answerId,
    otherDetails: payload.sourcePostcode
  }]
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_SOURCE_DETAILS,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_SOURCE_DETAILS,
    handler: handlers.post
  }
]
