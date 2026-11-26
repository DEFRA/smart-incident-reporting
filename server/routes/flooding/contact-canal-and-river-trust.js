import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.FLOOD_CONTACT_CANAL_AND_RIVER_TRUST)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FLOOD_CONTACT_CANAL_AND_RIVER_TRUST,
    handler: handlers.get
  }
]
