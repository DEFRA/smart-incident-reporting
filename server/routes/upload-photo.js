import constants from '../utils/constants.js'
import { returnFormattedDate } from '../utils/date-helpers.js'

// TODO : variable 'Journey' should be done once the upload photo initial screen is designed
const handlers = {
  get: async (_request, h) => h.view(constants.views.UPLOAD_PHOTO, { journey: 'water pollution', dateTime: returnFormattedDate() }),
  post: async (_request, h) => h.redirect(constants.routes.ADD_A_PHOTO)
}

export default [
  {
    method: 'GET',
    path: constants.routes.UPLOAD_PHOTO,
    handler: handlers.get,
    options: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: constants.routes.UPLOAD_PHOTO,
    handler: handlers.post,
    options: {
      auth: false
    }
  }
]
