import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendMessage } from '../../services/service-bus.js'
import { getErrorSummary } from '../../utils/helpers.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION),
  post: async (request, h) => {
    const { otherInfo } = request.payload
    if (!otherInfo) {
      const errorSummary = getErrorSummary()
      errorSummary.errorList.push({
        text: 'Enter a description of the pollution',
        href: '#otherInfo'
      })
      return h.view(constants.views.WATER_POLLUTION_OTHER_INFORMATION, {
        errorSummary
      })
    }
    request.yar.set(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION, otherInfo)
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

    // Build the payload to send to service bus
    const payload = buildPayload(request.yar)

    // test the payload against the schema

    // Need to transform this data using a schema, but for now just submit raw
    await sendMessage(payload)

    return h.redirect(constants.routes.REPORT_SENT)
  }
}

const buildPayload = (session) => {
  return {
    reportingAnEnvironmentalProblem: {
      sessionGuid: session.id,
      reportType: questionSets.WATER_POLLUTION.questionSetId,
      dateTimeObserved: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
      dateTimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP), // This is not yet captured, so defaulting to submission timestamp
      otherDetails: session.get(constants.redisKeys.WATER_POLLUTION_OTHER_INFORMATION),
      questionSetId: questionSets.WATER_POLLUTION.questionSetId, // duplication?
      data: buildAnswerDataset(session, questionSets.WATER_POLLUTION)
    }
  }
}

const buildAnswerDataset = (session, questionSet) => {
  const data = []
  Object.keys(questionSet.questions).forEach(key => {
    const answers = session.get(questionSet.questions[key].key)
    answers.forEach(item => {
      data.push(item)
    })
  })
  return data
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_OTHER_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.WATER_POLLUTION_OTHER_INFORMATION,
    handler: handlers.post
  }
]
