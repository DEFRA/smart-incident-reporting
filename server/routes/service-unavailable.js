import constants from '../utils/constants.js'
import isWorkingHours from '../utils/is-working-hours.js'

const handlers = {
  get: async (_request, h) => {
    // If we are in working hours then redirect to home page.
    if (await isWorkingHours()) {
      return h.redirect('/')
    } else {
      return h.view(constants.views.SERVICE_UNAVAILABLE)
    }
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SERVICE_UNAVAILABLE,
    handler: handlers.get,
    options: {
      auth: false
    }
  }
]
