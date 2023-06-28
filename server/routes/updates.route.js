'use strict'

const { Paths, Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.UPDATES, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    if (request.payload.updates === 'yes') {
      return h.view(Views.SUCCESS, {
        ...context
      })
    } else if (request.payload.updates === 'no') {
      return h.view(Views.SUCCESS, {
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
    path: `${Paths.UPDATES}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.UPDATES_ANSWER}`,
    handler: handlers.post
  }
]
