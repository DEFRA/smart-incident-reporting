'use strict'

const { Paths, Views } = require('../../utils/constants')

const handlers = {
  get: async (request, h) => {
    const context = _getContext()
    return h.view(Views.PROBLEM_WITH_SERVICE, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Sorry, there is a problem with the service'
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.PROBLEM_WITH_SERVICE}`,
    handler: handlers.get
  }
]
