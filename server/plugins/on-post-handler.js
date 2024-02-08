const onPostHandler = {
  plugin: {
    name: 'on-post-handler',
    register: (server, _options) => {
      server.ext('onPostHandler', async (request, h) => {
        if (request.response.variety === 'view' && request.method === 'get') {
          request.response.headers['cache-control'] = 'no-cache, no-store, must-revalidate'
        }
        return h.continue
      })
    }
  }
}

export default onPostHandler
