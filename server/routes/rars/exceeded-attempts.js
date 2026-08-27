import constants from '../../utils/constants.js'

const createExceededAttemptsRoutes = ({ route, redirect }) => {
  const handlers = {
    get: async (_request, h) => {
      return h.view(constants.views.RARS_EXCEEDED_ATTEMPTS, {
        enterAddress: redirect.locationAddress
      })
    }
  }

  return [
    { method: 'GET', path: route, handler: handlers.get }
  ]
}

export default createExceededAttemptsRoutes
