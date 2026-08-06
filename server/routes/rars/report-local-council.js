import constants from '../../utils/constants.js'
import { getServiceDetails, titleHelper } from '../../utils/helpers.js'

const question = 'Report the {problem} to your local council'
const verminQuestion = 'Report the {vermin} to your local council'

const createReportLocalCouncilRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (request, h) => {
      const { title, pageTitle } = titleHelper(request, question, verminQuestion, problem)
      const issue = problem === 'vermin'
        ? request.yar.get(constants.redisKeys.VERMIN_TYPE_SELECTED)
        : problem
      return h.view(constants.views.RARS_REPORT_LOCAL_COUNCIL, {
        title,
        pageTitle,
        issue,
        ...serviceDetails
      })
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

export default createReportLocalCouncilRoutes
