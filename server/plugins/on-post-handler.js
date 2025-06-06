import constants from '../utils/constants.js'

const onPostHandler = {
  plugin: {
    name: 'on-post-handler',
    register: (server, _options) => {
      server.ext('onPostHandler', async (request, h) => {
        if (request.response.variety === 'view' && request.method === 'get') {
          request.response.headers['cache-control'] = 'no-cache, no-store, must-revalidate'
          handleReferer(request)
        }
        return h.continue
      })
    }
  }
}

const handleReferer = request => {
  if (request.headers.referer) {
    // If referer was a check route then set the session referer
    // Route then decides whether to redirect to referer or not
    const setReferer = constants.setReferer.find(item => request.headers.referer.indexOf(item) > -1)
    const clearReferer = constants.clearReferer.find(item => request.headers.referer.indexOf(item) > -1)
    if (setReferer) {
      request.yar.set(constants.redisKeys.REFERER, `/${setReferer}`)
    } else if (clearReferer) {
      request.yar.clear(constants.redisKeys.REFERER)
    } else {
      // do nothing for sonarcloud
    }
  } else {
    // If no referer then clear referer key because user has broken the journey
    request.yar.clear(constants.redisKeys.REFERER)
  }
}

export default onPostHandler
