'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_AQUATICLIFE, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    if (request.payload.deadfish === 'yes') {
      return h.view(Views.WATER_TYPE_AQUATICLIFE_TWO, {
        ...context
      })
    } else if (request.payload.deadfish === 'no') {
      return h.view(Views.ANONYMOUS, {
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
    path: `${Paths.WATER_TYPE_AQUATICLIFE}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_AQUATICLIFE_ANSWER}`,
    handler: handlers.post
  }
]
