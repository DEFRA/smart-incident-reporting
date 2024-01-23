import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.redirect(constants.routes.WATER_POLUTION)
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
