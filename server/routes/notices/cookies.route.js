'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.COOKIES, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: false
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.COOKIES}`,
    handler: handlers.get
  }
]
