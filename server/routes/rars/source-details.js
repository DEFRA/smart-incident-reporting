import constants from '../../utils/constants.js'
import questionSets from '../../utils/question-sets.js'
import { getServiceDetails, getErrorSummary, titleHelper } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE_DETAILS
const verminQuestion = 'Do you know the site or business responsible for the {vermin}?'
const postcodeRegExp = /^([A-Za-z][A-Ha-hJ-Yj-y]?\d[A-Za-z0-9]? ?\d[A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/ // https://stackoverflow.com/a/51885364

const baseAnswer = {
  questionId: question.questionId,
  questionAsked: question.text,
  questionResponse: true
}

const createSourceDetailsRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const { title, pageTitle } = titleHelper(request, question.text, verminQuestion, problem)
      return h.view(constants.views.RARS_SOURCE_DETAILS, {
        question,
        problem,
        title,
        pageTitle,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
    // cleanse postcode for special characters https://design-system.service.gov.uk/patterns/addresses/#allow-different-postcode-formats
    if (request.payload.sourcePostcode) {
      request.payload.sourcePostcode = request.payload.sourcePostcode.replaceAll(/[^\w\s]/gi, '')
    }

    // validate payload for errors
    const errorSummary = validatePayload(request.payload)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.RARS_SOURCE_DETAILS, {
        ...getContext(),
        errorSummary,
        ...request.payload,
        yesChecked: request.payload.answerId === 'yes'
      })
    }

    // handle redirects
    if (request.payload.answerId === 'yes') {
      // set answer in session
      request.yar.set(constants.redisKeys.RARS_SOURCE_DETAILS, buildAnswers(request.payload))
      return h.redirect(redirect.locationHome)
    } else if (request.payload.answerId === 'no') {
      return h.redirect(redirect.contactLocalCouncil)
    } else {
      // do nothing
    }

    return null
  }
}

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const getContext = () => {
  return {
    question
  }
}

const validatePayload = (payload, problem) => {
  const errorSummary = getErrorSummary()
  if (!payload.answerId) {
    errorSummary.errorList.push({
      text: `Select 'yes' if you can give details about where the ${problem} is coming from`,
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
    if ((payload.sourcePostcode?.length > 0) && (!postcodeRegExp.test(payload.sourcePostcode))) {
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

export default createSourceDetailsRoutes

