'use strict'

const {
  HOME_URL,
  Paths
} = require('../utils/constants')

const handlers = {
  get: async (request, h) => {
      return h.redirect(Paths.WELCOME)
  }
}

module.exports = [
  {
    method: 'GET',
    path: HOME_URL,
    handler: handlers.get
  }
]
