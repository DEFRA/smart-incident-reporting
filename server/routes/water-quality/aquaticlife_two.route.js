'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_AQUATICLIFE_TWO, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()
    return h.view(Views.EVIDENCE, {
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
    path: `${Paths.WATER_TYPE_AQUATICLIFE_TWO}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_AQUATICLIFE_TWO_ANSWER}`,
    handler: handlers.post
  }
]
