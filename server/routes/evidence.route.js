'use strict'

const { Paths, Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.EVIDENCE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    return h.view(Views.ANONYMOUS, {
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
    path: `${Paths.EVIDENCE}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.EVIDENCE_ANSWER}`,
    handler: handlers.post
  }
]
