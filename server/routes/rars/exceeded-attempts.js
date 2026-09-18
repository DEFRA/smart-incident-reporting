import constants from '../../utils/constants.js'
import { getServiceDetails } from '../../utils/helpers.js'

const createExceededAttemptsRoutes = ({ problem, route, redirect }) => {
  const serviceDetails = getServiceDetails(problem)

  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_EXCEEDED_ATTEMPTS, {
        ...serviceDetails,
        enterAddress: redirect.locationAddress
      })
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

export default createExceededAttemptsRoutes
