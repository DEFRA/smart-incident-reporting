'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_NUMBER_OF_ANGLERS, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_CURRENT, {
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
    path: `${Paths.FISHING_NUMBER_OF_ANGLERS}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_NUMBER_OF_ANGLERS_ANSWER}`,
    handler: handlers.post
  }
]
