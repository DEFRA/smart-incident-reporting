import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { SITE_FINDER_RESULT } from '../../utils/site-finder.js'
import { getServiceDetails, getErrorSummary, titleHelper } from '../../utils/helpers.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_SOURCE_DETAILS
const verminPestsQuestion = 'Do you know the site or business responsible for the {vermin/pests}?'
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
      const { title, pageTitle } = titleHelper(request, question.text, verminPestsQuestion, problem)
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
      const errorSummary = validatePayload(request.payload, problem)
      if (errorSummary.errorList.length > 0) {
        const { title, pageTitle } = titleHelper(request, question.text, verminPestsQuestion, problem)
        return h.view(constants.views.RARS_SOURCE_DETAILS, {
          question,
          problem,
          title,
          pageTitle,
          ...serviceDetails,
          errorSummary,
          ...request.payload,
          yesChecked: request.payload.answerId === 'yes'
        })
      }

      // handle redirects
      if (request.payload.answerId === 'yes') {
        // set answer in session
        request.yar.set(constants.redisKeys.RARS_SOURCE_DETAILS, buildAnswers(request.payload, siteFinderApiDown(request)))
        if (problem === 'vermin/pests') {
          return h.redirect(redirect.recurring)
        }
        return h.redirect(redirect.description)
      }

      return h.redirect(redirect.contactEnvironmentAgency)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const validatePayload = (payload, problem) => {
  const errorSummary = getErrorSummary()
  const verb = problem === 'vermin/pests' ? 'are' : 'is'
  if (!payload.answerId) {
    errorSummary.errorList.push({
      text: `Select 'yes' if you can give details about where the ${problem} ${verb} coming from`,
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

const siteFinderApiDown = request => request.yar.get(constants.redisKeys.RARS_SITE_FINDER_API_DOWN) === true

const buildAnswers = (payload, apiDown) => {
  return [{
    ...baseAnswer,
    answerId: question.answers.siteFinderUsed.answerId,
    otherDetails: apiDown ? SITE_FINDER_RESULT.API_DOWN : SITE_FINDER_RESULT.MANUAL
  }, {
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
