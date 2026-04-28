import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'

const testEmail = 'not-a-real-email-address'

const handlers = {
  get: (request, h) => {
    return h.view(constants.views.TEST_MEDIA_UPLOAD_SUBMIT)
  },
  post: async (request, h) => {
    const payload = request.payload
    console.log('Payload received:', payload)

    request.yar.reset()
    request.yar.set(constants.redisKeys.QUESTION_SET_ID, Number(payload.journey))
    request.yar.set(constants.redisKeys.SUBMISSION_TIMESTAMP, (new Date()).toISOString())
    request.yar.set(constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS, { reporterEmailAddress: testEmail })
    request.yar.set(constants.redisKeys.SMELL_CONTACT_DETAILS, { reporterEmailAddress: testEmail })
    request.yar.set(constants.redisKeys.BLOCKAGE_CONTACT_DETAILS, { reporterEmailAddress: testEmail })
    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS, { reporterEmailAddress: testEmail })
    request.yar.set(constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO, [{
      answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yes.answerId
    }])
    request.yar.set(constants.redisKeys.SMELL_IMAGES_OR_VIDEO, [{
      answerId: questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO.answers.yes.answerId
    }])
    request.yar.set(constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO, [{
      answerId: questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO.answers.yes.answerId
    }])
    request.yar.set(constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO, [{
      answerId: questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_IMAGES_OR_VIDEO.answers.yes.answerId
    }])

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
