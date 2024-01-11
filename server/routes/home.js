import constants from '../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.redirect(constants.routes.WELCOME)
}

export default [
  {
    method: 'GET',
    path: '/',
    handler: handlers.get
  }
]
