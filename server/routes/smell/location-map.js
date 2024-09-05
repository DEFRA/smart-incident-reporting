import constants from '../../utils/constants.js'

const handlers = {
  get: (_request, h) => {
    const context = _getContext()
    return 'hello world'
  }
}

const _getContext = () => {
  return {
    pageTitle: 'Report an environmental incident',
    hideBackLink: false
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_LOCATION_MAP,
    handler: handlers.get
  }
]
