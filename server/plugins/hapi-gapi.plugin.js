'use strict'

const { SI_SESSION_KEY } = require('../utils/constants')

module.exports = {
  plugin: require('@defra/hapi-gapi'),
  options: {
    propertySettings: [
      {
        id: 'testId',
        hitTypes: ['pageview', 'event']
      }
    ],
    // Would normally use the request object to retrieve the proper session identifier
    sessionIdProducer: async request => request.state[SI_SESSION_KEY]
  }
}
