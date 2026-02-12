import constants from '../utils/constants.js'
import { returnFormattedDate } from '../utils/date-helpers.js'

// TODO : variable 'Journey' should be done once the upload photo initial screen is designed
const handlers = {
  get: async (_request, h) => h.view(constants.views.UPLOAD_PHOTO, { journey: 'water pollution', dateTime: returnFormattedDate() })
}

export default [
  {
    method: 'GET',
    path: constants.routes.UPLOAD_PHOTO,
    handler: handlers.get
  }
]
