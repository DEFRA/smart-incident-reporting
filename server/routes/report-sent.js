import constants from '../utils/constants.js'
import { getServiceDetails } from '../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const reportSentPageData = request.yar.get(constants.redisKeys.REPORT_SENT_PAGE_DATA)
    request.yar.reset()
    const context = getContext(reportSentPageData)

    return h.view(constants.views.REPORT_SENT, context)
  }
}

const getContext = (photoUploadDetails) => {
  let serviceDetails

  // TODO: we should get service details for other journeys too as they default to
  // Report an environmental problem on the report sent page
  if (photoUploadDetails?.problem) {
    serviceDetails = getServiceDetails(photoUploadDetails.problem)
  }

  return {
    hideBackLink: true,
    photoUploadDetails,
    problem: photoUploadDetails?.problem,
    ...serviceDetails
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_SENT,
    handler: handlers.get
  }
]
