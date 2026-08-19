import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'

const createLocationDescriptionOptionalRoutes = ({ problem, route }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_LOCATION_DESCRIPTION_OPTIONAL, {
        problem,
        ...serviceDetails
      })
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

export default createLocationDescriptionOptionalRoutes
