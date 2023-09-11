'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_REPORTED, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    const reported = request.payload.reported

    if (reported === 'yes') {
      return h.view(Views.WATER_TYPE_WHEN, { ...context })
    } else if (reported === 'no') {
      return h.view(Views.WATER_TYPE_RECURRING, { ...context })
    }

    return h.view(Views.WATER_TYPE_REPORTED, {
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
    path: `${Paths.WATER_TYPE_REPORTED}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_REPORTED}`,
    handler: handlers.post
  }
]
