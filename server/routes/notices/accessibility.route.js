'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.ACCESSIBILITY_STATEMENT, {
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
    path: `${Paths.ACCESSIBILITY_STATEMENT}`,
    handler: handlers.get
  }
]
