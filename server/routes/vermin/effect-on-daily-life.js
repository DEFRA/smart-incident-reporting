import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => h.view(constants.views.RARS_EFFECT_ON_DAILY_LIFE),
  post: async (request, h) => h.redirect(constants.routes.VERMIN_LOCATION_DESCRIPTION)
}

export default [
  {
    method: 'GET',
    path: constants.routes.RARS_EFFECT_ON_DAILY_LIFE,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.RARS_EFFECT_ON_DAILY_LIFE,
    handler: handlers.post
  }
]
