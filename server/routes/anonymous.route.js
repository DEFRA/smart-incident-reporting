'use strict'

const { Paths, Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.ANONYMOUS, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    if (request.payload.anonymous === 'yes') {
      return h.view(Views.SUCCESS, {
        ...context
      })
    } else if (request.payload.anonymous === 'no') {
      return h.view(Views.UPDATES, {
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
    path: `${Paths.ANONYMOUS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.ANONYMOUS_ANSWER}`,
    handler: handlers.post
  }
]
