import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendMessage } from '../../services/service-bus.js'
import { validatePayload } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_OTHER_INFORMATION, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherInfo } = request.payload

    request.yar.set(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION, otherInfo)
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())

    // Build the payload to send to service bus
    const payload = buildPayload(request.yar)

    // test the payload against the schema
    if (!validatePayload(payload)) {
      throw new Error('Invalid payload')
    }

    request.logger.info({ payload }, 'Sending blockage report to database')
    await sendMessage(request.logger, payload)

    return h.redirect(constants.routes.REPORT_SENT)
  }
}

const getContext = request => {
  const data = request.yar.get(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION)
  const otherInformation = data || ''

  return {
    otherInformation
  }
}

const buildPayload = (session) => {
  const reporter = session.get(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS)
  const riverData = session.get(constants.redisKeys.BLOCKAGE_RIVER)
  return {
    reportingAnEnvironmentalProblem: {
      sessionGuid: session.id,
      reportType: questionSets.BLOCKAGE.questionSetId,
      datetimeObserved: session.get(constants.redisKeys.BLOCKAGE_WHEN),
      datetimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
      otherDetails: session.get(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION),
      questionSetId: questionSets.BLOCKAGE.questionSetId,
      data: buildAnswerDataset(session, questionSets.BLOCKAGE),
      isBlockageInRiver: riverData,
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
    path: constants.routes.BLOCKAGE_OTHER_INFORMATION,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.BLOCKAGE_OTHER_INFORMATION,
    handler: handlers.post
  }
]
