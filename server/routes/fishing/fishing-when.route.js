'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_WHEN, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    return h.view(Views.FISHING_OTHERINFO, {
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
    path: `${Paths.FISHING_WHEN}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_WHEN_ANSWER}`,
    handler: handlers.post
  }
]
