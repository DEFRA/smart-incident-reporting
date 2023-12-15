'use strict'

const { Paths, Views /** ,RedisKeys */ } = require('../../utils/constants')
// const RedisService = require('../../services/redis.service')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WATER_TYPE_CONTACT, {
      ...context
    })
  },
  post: (request, h) => {
    const context = _getContext()

    // const locationmapordesc = request.payload['location-map-or-desc']
    //
    // if (locationmapordesc === 'address') {
    //   return h.view(Views.WATER_TYPE, { ...context })
    // } else if (locationmapordesc === 'map') {
    //   return h.view(Views.WATER_TYPE, { ...context })
    // } else if (locationmapordesc === 'desc') {
    //   return h.view(Views.FISHING_LOCATION, { ...context })
    // }
    //
    return h.view(Views.WATER_TYPE_VOLUNTEER_MEDIA_CONTACT, {
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
    path: `${Paths.WATER_TYPE_CONTACT}`,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: `${Paths.WATER_TYPE_CONTACT}`,
    handler: handlers.post
  }
]
