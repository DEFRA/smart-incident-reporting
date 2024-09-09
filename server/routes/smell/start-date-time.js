import constants from '../../utils/constants.js'

const handlers = {
  get: (_request, _h) => {
    return 'smell start date time'
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.SMELL_START_DATE_TIME,
    handler: handlers.get
  }
]
