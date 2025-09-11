import constants from '../utils/constants.js'
import mediaCache from '../utils/media-id-cache.js'

const handlers = {
  get: async (request, h) => {
    const questionSetID = request.yar.get(constants.redisKeys.QUESTION_SET_ID)

    const hasPhotos = request.yar.get(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO)

    if (hasPhotos[0].questionResponse === true) {
      console.log('Has photos')
      const photoUploadDetails = {
        address: request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION)[0].otherDetails,
        dateTime: request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP)
      }

      console.log(photoUploadDetails)

      await mediaCache.set(request.yar.id, photoUploadDetails)
    } else {
      console.log('No photos')
    }

    const uploadURL = `http://localhost:8000/media-upload?uploadId=${request.yar.id}`

    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, questionSetID)
    const context = _getContext()
    return h.view(constants.views.REPORT_SENT, {
      ...context,
      uploadURL
    })
  }
}

const _getContext = () => {
  return {
    hideBackLink: true
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_SENT,
    handler: handlers.get
  }
]
