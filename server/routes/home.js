import constants from '../utils/constants.js'

const handlers = {
  get: (request, h) => {
    if (process.env.REGISTER_START_ROUTES === 'true') {
      request.yar.reset()
      return h.view(constants.views.HOME)
    } else {
      return h.redirect(constants.urls.GOV_UK_SERVICE_HOME).permanent()
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
