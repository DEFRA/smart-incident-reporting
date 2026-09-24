import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'

const createContactLocalCouncilRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_CONTACT_LOCAL_COUNCIL, {
        problem,
        ...serviceDetails
      })
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

export default createContactLocalCouncilRoutes
