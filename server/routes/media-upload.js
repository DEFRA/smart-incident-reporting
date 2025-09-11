import constants from '../utils/constants.js'
import mediaCache from '../utils/media-id-cache.js'

const handlers = {
  get: async (request, h) => {
    console.log(`Upload session id: ${request.yar.id}`)
    // Check query string is valid within Redis cache
    const uploadId = request.query.uploadId
    console.log(`Checking ${uploadId}`)
    const idVerified = await mediaCache.exists(uploadId)

    // Is there: set id to session cache
    // pull out address and name from Redis

    if (idVerified) {
      const details = await mediaCache.get(uploadId)
      const location = details.address
      const when = new Date(details.dateTime)
      const dateTime = `${when.toTimeString()} ${when.toDateString()}`
      request.yar.set('upload-id', uploadId)

      return h.view(constants.views.MEDIA_UPLOAD, {
        idVerified,
        location,
        dateTime
      })
    }

    return h.view(constants.views.MEDIA_UPLOAD, { idVerified })
  },
  post: (request, h) => {
    return h.redirect(constants.routes.FILE_UPLOAD)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.MEDIA_UPLOAD,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.MEDIA_UPLOAD,
    handler: handlers.post
  }
]
