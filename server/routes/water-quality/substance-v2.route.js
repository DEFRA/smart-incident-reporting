'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_SUBSTANCE_V2, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_SMELL_DESC, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: true
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.WATER_TYPE_SUBSTANCE_V2}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_SUBSTANCE_V2}`,
    handler: handlers.post
  }
]
