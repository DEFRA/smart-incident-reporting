import constants from '../../utils/constants.js'

const createExceededAttemptsRoutes = ({ route, locationAddressRoute }) => {
  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_EXCEEDED_ATTEMPTS, {
        enterAddress: locationAddressRoute
      })
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

export default createExceededAttemptsRoutes
