import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_SOURCE_DETAILS,
    handler: (_request, h) => h.redirect(constants.routes.SMELL_SOURCE)
  }
]
