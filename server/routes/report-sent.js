import constants from '../utils/constants.js'
import { getServiceDetails } from '../utils/helpers.js'

const getOtherRarsLinks = problem => {
  return [
    { problem: 'dust', label: 'Dust', url: process.env.REGISTER_START_ROUTES === 'true' ? constants.routes.DUST_START : constants.urls.GOV_UK_DUST },
    { problem: 'litter', label: 'Litter', url: process.env.REGISTER_START_ROUTES === 'true' ? constants.routes.LITTER_START : constants.urls.GOV_UK_LITTER },
    { problem: 'mud', label: 'Mud', url: process.env.REGISTER_START_ROUTES === 'true' ? constants.routes.MUD_START : constants.urls.GOV_UK_MUD },
    { problem: 'noise', label: 'Noise', url: process.env.REGISTER_START_ROUTES === 'true' ? constants.routes.NOISE_START : constants.urls.GOV_UK_NOISE },
    { problem: 'smell', label: 'Smell', url: process.env.REGISTER_START_ROUTES === 'true' ? constants.routes.SMELL_START : constants.urls.GOV_UK_SMELL },
    { problem: 'vermin/pests', label: 'Vermin or pests', url: process.env.REGISTER_START_ROUTES === 'true' ? constants.routes.PESTS_START : constants.urls.GOV_UK_PESTS }
  ].filter(link => link.problem !== problem)
    .map(({ label, url }) => ({ label, url }))
}

const handlers = {
  get: async (request, h) => {
    const reportSentPageData = request.yar.get(constants.redisKeys.REPORT_SENT_PAGE_DATA)
    request.yar.reset()
    const context = getContext(reportSentPageData)

    return h.view(constants.views.REPORT_SENT, context)
  }
}

const getContext = (reportSentPageData) => {
  let serviceDetails

  // TODO: we should get service details for other journeys too as they default to
  // Report an environmental problem on the report sent page
  if (reportSentPageData?.problem) {
    serviceDetails = getServiceDetails(reportSentPageData.problem)
  }

  return {
    hideBackLink: true,
    photoUploadDetails: reportSentPageData,
    problem: reportSentPageData?.problem,
    otherRarsLinks: getOtherRarsLinks(reportSentPageData?.problem),
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
