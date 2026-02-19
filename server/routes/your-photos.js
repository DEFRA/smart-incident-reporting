import constants from '../utils/constants.js'

const handlers = {
  get: (_request, h) => h.view(constants.views.YOUR_PHOTOS)
}

export default [
  {
    method: 'GET',
    path: constants.routes.YOUR_PHOTOS,
    handler: handlers.get,
    options: {
      auth: false
    }
 }
]

// changing name from null
// const thumbLoc = request.yar.get('thumbnail-location')
