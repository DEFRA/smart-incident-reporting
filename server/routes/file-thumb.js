import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const thumbnailLocation = request.yar.get('thumbnail-location')
    console.log('SHOW THUMB')
    console.log(thumbnailLocation)

    const uploadLocation = request.yar.get('upload-location')

    return h.view(constants.views.FILE_THUMB, { thumbnailLocation, uploadLocation })
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FILE_THUMB,
    handler: handlers.get
  }
]
