'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: async (request, h) => {
    const context = _getContext()
    return h.view(Views.PAGE_NOT_FOUND, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Page not found'
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.PAGE_NOT_FOUND}`,
    handler: handlers.get
  }
]
