/*
 * Add an `onPreResponse` listener to return error pages
 */

'use strict'

const { StatusCodes, Paths } = require('../utils/constants')
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

const _getErrorPagePath = (request, response) => {
  let path
  const statusCode = response.output.statusCode

  if (statusCode !== StatusCodes.UNAUTHORIZED) {
    _logError(request, response, statusCode)
  }

  if (statusCode === StatusCodes.PAGE_NOT_FOUND) {
    path = Paths.PAGE_NOT_FOUND
  } else if (statusCode === StatusCodes.SERVICE_UNAVAILABLE) {
    path = Paths.SERVICE_UNAVAILABLE
  } else if (statusCode !== StatusCodes.UNAUTHORIZED) {
    path = Paths.PROBLEM_WITH_SERVICE
  }
  return path
}

const _logError = (request, response, statusCode) => {
  request.log('error', {
    statusCode,
    message: response.message,
    stack: response.data ? response.data.stack : response.stack
  })
}
