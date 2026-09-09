import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.RARS_DAYS_WHEN_WORSE),
  post: async (_request, h) => h.redirect(constants.routes.NOISE_LOCATION_DESCRIPTION)
}

export default [
  {
    method: 'GET',
    path: constants.routes.NOISE_DAYS_WHEN_WORSE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.NOISE_DAYS_WHEN_WORSE,
    handler: handlers.post
  }
]
