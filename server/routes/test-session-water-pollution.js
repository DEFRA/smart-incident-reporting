import constants from '../utils/constants.js'
import { populateSession } from '../utils/session-mock-water.js'

const handlers = {
  get: (request, h) => {
    populateSession(request.yar)
    return h.redirect(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.TEST_SESSION_WATER_POLLUTION,
    handler: handlers.get
  }
]
