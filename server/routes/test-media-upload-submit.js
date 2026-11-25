import constants from '../utils/constants.js'

const journeyMap = {
  100: 'water pollution',
  300: 'blockage in a river',
  1800: 'illegal fishing',
  200: 'a smell',
  900: 'dust',
  1300: 'a vermin or pest problem',
  2200: 'litter',
  2300: 'mud',
  2500: 'noise',
  3100: 'a vermin or pest problem'
}

const handlers = {
  get: (_request, h) => {
    return h.view(constants.views.TEST_MEDIA_UPLOAD_SUBMIT)
  },
  post: async (request, h) => {
    const payload = request.payload
    const submissionTimestamp = (new Date()).toISOString()

    request.yar.reset()

    const mediaUploadLink = `/media/upload-photo?sirid=${request.yar.id}`

    request.yar.set(constants.redisKeys.REPORT_SENT_PAGE_DATA, {
      reportersEmail: 'not-a-real-email-address',
      hasPhoneNumber: false,
      userAgreedForVideos: false,
      userAgreedForImages: true,
      mediaUploadLink
    })

    await request.server.app.mediaUploadCache.set(request.yar.id, {
      dateTime: submissionTimestamp,
      journey: journeyMap[Number(payload.journey)]
    }, 0)

    return h.redirect(constants.routes.REPORT_SENT)
  }
}

export default [
  {
    method: 'GET',
    path: '/test-media-upload-submit',
    handler: handlers.get
  },
  {
    method: 'POST',
    path: '/test-media-upload-submit',
    handler: handlers.post
  }
]
