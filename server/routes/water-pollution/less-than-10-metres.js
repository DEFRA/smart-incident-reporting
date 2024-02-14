import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.WATER_POLLUTION_LESS_THAN_10_METRES)
}

export default [
  {
    method: 'GET',
    path: constants.routes.WATER_POLLUTION_LESS_THAN_10_METRES,
    handler: handlers.get
  }
]
