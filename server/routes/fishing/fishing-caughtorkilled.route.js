'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.FISHING_CAUGHTORKILLED, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    if (request.payload.fishtaken === 'yes') {
      return h.view(Views.FISHING_TYPE_OF_FISH, {
        ...context
      })
    } else if (request.payload.fishtaken === 'no') {
      return h.view(Views.FISHING_NUMBER_OF_ANGLERS, {
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
    path: `${Paths.FISHING_CAUGHTORKILLED}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.FISHING_CAUGHTORKILLED_ANSWER}`,
    handler: handlers.post
  }
]
