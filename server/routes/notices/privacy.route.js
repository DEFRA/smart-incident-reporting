'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.PRIVACY_STATEMENT, {
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
    path: `${Paths.PRIVACY_STATEMENT}`,
    handler: handlers.get
  }
]
