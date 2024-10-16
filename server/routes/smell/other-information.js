import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendMessage } from '../../services/service-bus.js'
import { validatePayload } from '../../utils/helpers.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.SMELL_OTHER_INFORMATION),
  post: async (request, h) => {
    const { otherInfo } = request.payload

    request.yar.set(constants.redisKeys.SMELL_OTHER_INFORMATION, otherInfo)
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

    // Build the payload to send to service bus
    const payload = buildPayload(request.yar)

    // test the payload against the schema
    if (!validatePayload(payload)) {
      throw new Error('Invalid payload')
    }

    await sendMessage(request.logger, payload)

    return h.redirect(constants.routes.REPORT_SENT)
  }
}

const buildPayload = (session) => {
  const reporter = session.get(constants.redisKeys.HOME)
  return {
    reportingAnEnvironmentalProblem: {
      sessionGuid: session.id,
      reportType: questionSets.SMELL.questionSetId,
      datetimeObserved: session.get(constants.redisKeys.SMELL_START_DATE_TIME),
      datetimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
      otherDetails: session.get(constants.redisKeys.SMELL_OTHER_INFORMATION),
      questionSetId: questionSets.SMELL.questionSetId,
      data: buildAnswerDataset(session, questionSets.SMELL),
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
    path: constants.routes.SMELL_OTHER_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.SMELL_OTHER_INFORMATION,
    handler: handlers.post
  }
]
