import constants from '../utils/constants.js'
import { questionSets } from '../utils/question-sets.js'
// import config from '../utils/config.js'

const expire = 72 * 60 * 60 * 1000
const mediaUploadLink = 'https://sir-uploader-dev1.azure.defra.cloud/upload-photo'

const journeyMap = {
  100: 'water pollution',
  200: 'smell',
  300: 'blockage',
  1800: 'illegal fishing'
}

const journeyConfigMap = {
  100: {
    contactDetailsKey: constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO,
    imagesQuestion: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO
  },
  200: {
    contactDetailsKey: constants.redisKeys.SMELL_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.SMELL_IMAGES_OR_VIDEO,
    imagesQuestion: questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO
  },
  300: {
    contactDetailsKey: constants.redisKeys.BLOCKAGE_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO,
    imagesQuestion: questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO
  },
  1800: {
    contactDetailsKey: constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO,
    imagesQuestion: questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_IMAGES_OR_VIDEO
  }
}

const handlers = {
  get: async (request, h) => {
    const questionSetID = request.yar.get(constants.redisKeys.QUESTION_SET_ID)
    const submissionTimestamp = request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP)
    const journey = journeyMap[questionSetID]
    const sessionId = request.yar.id
    const journeyConfig = journeyConfigMap[questionSetID]

    const contactDetails = journeyConfig
      ? request.yar.get(journeyConfig.contactDetailsKey)
      : null
    const imagesOrVideoAnswer = journeyConfig
      ? request.yar.get(journeyConfig.imagesOrVideoKey)
      : null

    const reportersEmail = contactDetails?.reporterEmailAddress || ''
    const userAgreedForImages = journeyConfig
      ? imagesOrVideoAnswer?.[0]?.answerId === journeyConfig.imagesQuestion.answers.yes.answerId
      : false

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
    const context = _getContext({
      reportersEmail,
      userAgreedForImages,
      mediaUploadLink
      // mediaUploadLink: config.mediaUploadUrl
    })
    return h.view(constants.views.REPORT_SENT, context)
  }
}

const _getContext = (photoUploadDetails) => {
  return {
    hideBackLink: true,
    photoUploadDetails
    // mediaUploadLink: config.mediaUploadUrl
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.REPORT_SENT,
    handler: handlers.get
  }
]
