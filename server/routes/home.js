import constants from '../utils/constants.js'
import isWorkingHours from '../utils/is-working-hours.js'

const handlers = {
  get: async (request, h) => {
    request.yar.reset()
    if (await isWorkingHours()) {
      return h.view(constants.views.HOME)
    } else {
      // request.logger.warn('Service unavailable outside of working hours')
      return h.redirect(constants.routes.SERVICE_UNAVAILABLE)
    }
  }
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
