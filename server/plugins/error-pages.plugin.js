/*
 * Add an `onPreResponse` listener to return error pages
 */

'use strict'

module.exports = {
  plugin: {
    name: 'error-pages',
    register: server => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          if (_canIgnoreError(request)) {
            return h.continue
          } else {
            const nextPath = _getErrorPagePath(request, response)
            if (nextPath) {
              return h.redirect(nextPath)
            }
          }
        }

        return h.continue
      })
    }
  }
}

/**
 * 404 errors can be ignored when favicon.ico can't be found
 * @param {*} request
 * @returns true if the error can be ignored, otherwise false
 */
const _canIgnoreError = request => request.path === '/favicon.ico'

