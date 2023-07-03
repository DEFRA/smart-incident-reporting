'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_TYPE_OF_FISH, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_NUMBER_OF_FISH, {
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
    path: `${Paths.FISHING_TYPE_OF_FISH}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_TYPE_OF_FISH_ANSWER}`,
    handler: handlers.post
  }
]
