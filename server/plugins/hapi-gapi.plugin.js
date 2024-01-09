import constants from '../utils/constants'

export default {
  plugin: require('@defra/hapi-gapi'),
  options: {
    propertySettings: [
      {
        id: 'testId',
        hitTypes: ['pageview', 'event']
      }
    ],
    // Would normally use the request object to retrieve the proper session identifier
    sessionIdProducer: async request => request.state[constants.SI_SESSION_KEY]
  }
}
