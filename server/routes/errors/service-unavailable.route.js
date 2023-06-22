'use strict'


const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: async (request, h) => {
    const context = _getContext()
    return h.view(Views.SERVICE_UNAVAILABLE, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Sorry, the service is unavailable'
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.SERVICE_UNAVAILABLE}`,
    handler: handlers.get
  }
]
