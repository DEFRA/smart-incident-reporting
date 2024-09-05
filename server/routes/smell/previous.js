import constants from '../../utils/constants.js'

const handlers = {
  get: (_request, _h) => {
    return 'hello world'
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_PREVIOUS,
    handler: handlers.get
  }
]
