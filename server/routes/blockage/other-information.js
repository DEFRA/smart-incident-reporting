import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { sendMessage } from '../../services/service-bus.js'
import { getErrorSummary, validatePayload } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.BLOCKAGE_OTHER_INFORMATION, {
      ...getContext(request)
    })
  },
  post: async (request, h) => {
    const { otherInfo } = request.payload

    const errorSummary = validateOtherInfo(otherInfo)
    if (errorSummary.errorList.length > 0) {
      return h.view(constants.views.BLOCKAGE_OTHER_INFORMATION, {
        answers: otherInfo,
        errorSummary
      })
    }

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
  const answers = request.yar.get(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION) || ''

  return {
    answers
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
