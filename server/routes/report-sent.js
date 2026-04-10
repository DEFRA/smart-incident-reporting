import constants from '../utils/constants.js'
// import config from '../utils/config.js'

const expire = 72 * 60 * 60 * 1000

const journeyMap = {
  100: 'water pollution',
  200: 'smell',
  300: 'blockage',
  1800: 'illegal fishing'
}

const handlers = {
  get: async (request, h) => {
    const questionSetID = request.yar.get(constants.redisKeys.QUESTION_SET_ID)
    const submissionTimestamp = request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP)
    const journey = journeyMap[questionSetID]
    const sessionId = request.yar.id

    const mediaUploadCache = request.server.cache({
      cache: 'redis_cache',
      segment: 'media-upload',
      expiresIn: expire
    })

    await mediaUploadCache.set(sessionId, {
      journey,
      dateTime: submissionTimestamp
    })

    request.yar.reset()
    const context = _getContext()
    return h.view(constants.views.REPORT_SENT, {
      ...context,
      mediaUploadLink: 'https://sir-uploader-dev1.azure.defra.cloud/upload-photo'
      // mediaUploadLink: config.mediaUploadUrl
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
