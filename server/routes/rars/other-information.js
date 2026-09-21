import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendReport } from '../../services/send-report.js'

const createOtherInformationRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_OTHER_INFORMATION, {
        problem,
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      const { otherInfo } = request.payload

      const errorSummary = validateOtherInfo(otherInfo)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_OTHER_INFORMATION, {
          problem,
          ...serviceDetails,
          answers: otherInfo,
          errorSummary
        })
      }

      request.yar.set(constants.redisKeys.RARS_OTHER_INFORMATION, otherInfo)
      request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

      // Build the payload to send to service bus
      const payload = buildPayload(request.yar, problem)

      await sendReport(request, payload, problem)

      return h.redirect(constants.routes.REPORT_SENT)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const buildPayload = (session, problem) => {
  const reporter = session.get(constants.redisKeys.RARS_CONTACT_DETAILS)

  let reportType
  if (problem === 'vermin/pests') {
    if (session.get(constants.redisKeys.PESTS_TYPE_SELECTED) === 'flies') {
      reportType = questionSets.REPORT_REGULATED_SITE.reportTypes.flies
    } else {
      reportType = questionSets.REPORT_REGULATED_SITE.reportTypes.vermin
    }
  } else {
    reportType = questionSets.REPORT_REGULATED_SITE.reportTypes[problem]
  }

  const data = buildAnswerDataset(session, questionSets.REPORT_REGULATED_SITE, problem)

  return {
    reportingAnEnvironmentalProblem: {
      sessionGuid: session.id,
      datetimeObserved: session.get(constants.redisKeys.RARS_WHEN),
      datetimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
      otherDetails: session.get(constants.redisKeys.RARS_OTHER_INFORMATION),
      questionSetId: reportType,
      data,
      reportType,
      ...reporter
    }
  }
}

const buildAnswerDataset = (session, questionSet) => {
  const data = []
  Object.keys(questionSet.questions).forEach(key => {
    const answers = session.get(questionSet.questions[key].key)
    console.log(`${key}: ${questionSet.questions[key].key}`)
    console.log(answers)
    answers?.forEach(item => {
      data.push(item)
    })
  })
  return data
}

const validateOtherInfo = otherInfo => {
  const errorSummary = getErrorSummary()
  if (maxLength(otherInfo, constants.otherInformationCharacterLimit)) {
    errorSummary.errorList.push({
      text: `Anything else you'd like to add must be ${constants.otherInformationCharacterLimit} characters or less`,
      href: '#otherInfo'
    })
  }
  return errorSummary
}

export default createOtherInformationRoutes
