'use strict'

const { Paths, Views } = require('../utils/constants')
// const ASBService = require('../services/send')

const handlers = {
  get: async (request, h) => {
    // await ASBService.sendMessageToQueue().then(r => console.log('Message is sent...'))
    const context = _getContext()
    return h.view(Views.WELCOME, {
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
    path: `${Paths.WELCOME}`,
    handler: handlers.get
  }
]
