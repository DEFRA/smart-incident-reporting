import constants from '../../utils/constants.js'
import { getErrorSummary, getServiceDetails } from '../../utils/helpers.js'
import { maxLength } from '../../utils/validation.js'
// import { getServiceDetails, validatePayload } from '../../utils/helpers.js'
// import { questionSets } from '../../utils/question-sets.js'
// import { sendMessage } from '../../services/service-bus.js'

const createOtherInformationRoutes = ({ problem, route, redirect }) => {
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

      // // Build the payload to send to service bus
      // const payload = buildPayload(request.yar)

      // // test the payload against the schema
      // if (!validatePayload(payload)) {
      //   throw new Error('Invalid payload')
      // }

      // await sendMessage(request.logger, payload)

      return h.redirect(redirect.reportSent)
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get },
    { method: 'POST', path: route, handler: handlers.post }
  ]
}

// const buildPayload = (session) => {
//   const reporter = session.get(constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS)
//   return {
//     reportingAnEnvironmentalProblem: {
//       sessionGuid: session.id,
//       reportType: questionSets.ILLEGAL_FISHING.questionSetId,
//       datetimeObserved: session.get(constants.redisKeys.ILLEGAL_FISHING_WHEN),
//       datetimeReported: session.get(constants.redisKeys.SUBMISSION_TIMESTAMP),
//       otherDetails: session.get(constants.redisKeys.ILLEGAL_FISHING_OTHER_INFORMATION),
//       questionSetId: questionSets.ILLEGAL_FISHING.questionSetId,
//       data: buildAnswerDataset(session, questionSets.ILLEGAL_FISHING),
//       ...reporter
//     }
//   }
// }

// const buildAnswerDataset = (session, questionSet) => {
//   const data = []
//   Object.keys(questionSet.questions).forEach(key => {
//     const answers = session.get(questionSet.questions[key].key)
//     answers?.forEach(item => {
//       data.push(item)
//     })
//   })
//   return data
// }

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
