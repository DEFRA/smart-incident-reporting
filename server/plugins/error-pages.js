const errorPages = {
  name: 'error-pages',
  register: server => {
    server.ext('onPreResponse', (request, h) => {
      const { response } = request
      if (response.isBoom) {
        // An error was raised during
        // processing the request
        const statusCode = response.output.statusCode

        // In the event of 404
        // return the `404` view
        if (statusCode === 404) {
          return h.view('404').code(statusCode)
        }

        // Log the error
        request.log('error', {
          statusCode,
          message: response.message,
          stack: response.data ? response.data.stack : response.stack
        })

        // The return the `500` view
        return h.view('500').code(statusCode)
      }
      return h.continue
    })
  }
}

export default errorPages
