import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_REPORT_LOCAL_COUNCIL,
    handler: (_request, h) => h.redirect(constants.routes.SMELL_SOURCE)
  }
]
