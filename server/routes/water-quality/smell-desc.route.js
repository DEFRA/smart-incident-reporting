'use strict'

const { Paths, Views, RedisKeys } = require('../../utils/constants')
const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_SMELL_DESC, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    // const reported = request.payload.reported
    //
    // if (reported === 'yes') {
    //   return h.view(Views.WATER_TYPE_SMALL_DESC, { ...context })
    // } else if (reported === 'no') {
    //   return h.view(Views.WATER_TYPE_SMALL_DESC, { ...context })
    // }

    return h.view(Views.WATER_TYPE_SOURCE, {
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
    path: `${Paths.WATER_TYPE_SMELL_DESC}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_SMELL_DESC}`,
    handler: handlers.post
  }
]
