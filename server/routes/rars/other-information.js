import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'
import { getSubmissionMetadata } from '../../utils/submission-metadata.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendReport } from '../../services/send-report.js'
import captchaCheck from '../../services/captchaCheck.js'
import config from '../../utils/config.js'

const getCaptchaContext = request => ({
  captchaEnabled: config.captchaEnabled,
  captchaSiteKey: config.captchaSiteKey,
  friendlyCaptchaCompleted: request.yar.get(constants.redisKeys.FRIENDLY_CAPTCHA_COMPLETED) === true
})

const createOtherInformationRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      return h.view(constants.views.RARS_OTHER_INFORMATION, {
        problem,
        ...getCaptchaContext(request),
        ...serviceDetails
      })
    },
    post: async (request, h) => {
      const { otherInfo } = request.payload
      const friendlyCaptchaCompleted = request.yar.get(constants.redisKeys.FRIENDLY_CAPTCHA_COMPLETED) === true

      const friendlyCaptchaStatus = await captchaCheck.validateSubmission(
        request.payload,
        friendlyCaptchaCompleted
      )
      const errorSummary = validateOtherInfo(otherInfo)
      if (errorSummary.errorList.length > 0) {
        return h.view(constants.views.RARS_OTHER_INFORMATION, {
          problem,
          ...getCaptchaContext(request),
          ...serviceDetails,
          answers: otherInfo,
          errorSummary
        })
      }

      request.yar.set(constants.redisKeys.RARS_OTHER_INFORMATION, otherInfo)
      request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

      // Build the payload to send to service bus
      const payload = buildPayload(
        request.yar,
        problem,
        friendlyCaptchaStatus,
        getSubmissionMetadata(request, friendlyCaptchaCompleted)
      )

      await sendReport(request, payload, problem)

      return h.redirect(constants.routes.REPORT_SENT)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

const buildPayload = (session, problem, friendlyCaptchaStatus, submissionMetadata) => {
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

  const data = buildAnswerDataset(session, questionSets.REPORT_REGULATED_SITE)

  return {
    reportingAnEnvironmentalProblem: {
      sessionGuid: session.id,
      datetimeObserved: session.get(constants.redisKeys.RARS_WHEN),
      datetimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
      otherDetails: session.get(constants.redisKeys.RARS_OTHER_INFORMATION),
      questionSetId: reportType,
      friendlyCaptchaStatus,
      ...submissionMetadata,
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
    answers?.forEach(item => {
      data.push(item)
    })
  })
  return data
}

const validateOtherInfo = (otherInfo) => {
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
