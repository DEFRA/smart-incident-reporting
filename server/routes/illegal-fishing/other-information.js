import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendReport } from '../../services/send-report.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.ILLEGAL_FISHING_OTHER_INFORMATION),
  post: async (request, h) => {
    const { otherInfo } = request.payload

    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_OTHER_INFORMATION, otherInfo)
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

    // Build the payload to send to service bus
    const payload = buildPayload(request.yar)

    await sendReport(request, payload)

    return h.redirect(constants.routes.REPORT_SENT)
  }
}

const buildPayload = (session) => {
  const reporter = session.get(constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS)
  return {
    reportingAnEnvironmentalProblem: {
      sessionGuid: session.id,
      reportType: questionSets.ILLEGAL_FISHING.questionSetId,
      datetimeObserved: session.get(constants.redisKeys.ILLEGAL_FISHING_WHEN),
      datetimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
      otherDetails: session.get(constants.redisKeys.ILLEGAL_FISHING_OTHER_INFORMATION),
      questionSetId: questionSets.ILLEGAL_FISHING.questionSetId,
      data: buildAnswerDataset(session, questionSets.ILLEGAL_FISHING),
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

export default [
  {
    method: 'GET',
    path: constants.routes.ILLEGAL_FISHING_OTHER_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.ILLEGAL_FISHING_OTHER_INFORMATION,
    handler: handlers.post
  }
]
