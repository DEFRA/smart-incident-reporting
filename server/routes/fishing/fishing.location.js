'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_LOCATION, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_REPORTREASON, {
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
    path: `${Paths.FISHING_LOCATION}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_LOCATION_ANSWER}`,
    handler: handlers.post
  }
]
