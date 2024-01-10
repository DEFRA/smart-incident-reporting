import constants from '../utils/constants.js'
const { Paths, Views } = constants

const handlers = {
  get: async (request, h) => {
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

export default [
  {
    method: 'GET',
    path: `${Paths.WELCOME}`,
    handler: handlers.get
  }
]
