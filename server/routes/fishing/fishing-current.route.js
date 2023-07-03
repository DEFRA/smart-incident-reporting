'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_CURRENT, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    if (request.payload.ongoing === 'yes') {
      return h.view(Views.FISHING_OTHERINFO, {
        ...context
      })
    } else if (request.payload.ongoing === 'no') {
      return h.view(Views.FISHING_WHEN, {
        ...context
      })
    } else if (request.payload.ongoing === 'dunno') {
      return h.view(Views.FISHING_WHEN, {
        ...context
      })
    }
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
    path: `${Paths.FISHING_CURRENT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_CURRENT_ANSWER}`,
    handler: handlers.post
  }
]
