'use strict'

const { Paths, Views } = require('../utils/constants')

const handlers = {
  get: (request, h) => {
    const context = _getContext()
    return h.view(Views.WELCOME, {
      ...context
    })
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Welcome to smart incident reporting',
    hideBackLink: true
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${Paths.WELCOME}`,
    handler: handlers.get
  }
]
