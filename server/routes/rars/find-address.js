import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'

const createFindAddressRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_FIND_ADDRESS, {
        problem,
        ...serviceDetails
      })
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

export default createFindAddressRoutes
