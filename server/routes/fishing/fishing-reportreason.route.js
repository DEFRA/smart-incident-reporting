'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_REPORTREASON, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    if (request.payload.fishIllegality === 'location') {
      return h.view(Views.FISHING_CAUGHTORKILLED, {
        ...context
      })
    } else if (request.payload.fishIllegality === 'equipment') {
      return h.view(Views.FISHING_EQUIPMENT, {
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
    path: `${Paths.FISHING_REPORTREASON}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_REPORTREASON_ANSWER}`,
    handler: handlers.post
  }
]
