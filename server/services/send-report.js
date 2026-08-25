import { sendMessage } from './service-bus.js'
import { validatePayload } from '../utils/helpers.js'
import { questionSets } from '../utils/question-sets.js'
import constants from '../utils/constants.js'

const mediaUploadBaseURL = '/media/upload-photo'

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

const buildDataForReportSentPage = (session) => {
  const questionSetID = session.get(constants.redisKeys.QUESTION_SET_ID)
  const journeyConfig = journeyConfigMap[questionSetID]

  const contactDetails = journeyConfig
    ? session.get(journeyConfig.contactDetailsKey)
    : null
  const imagesOrVideoAnswer = journeyConfig
    ? session.get(journeyConfig.imagesOrVideoKey)
    : null

  const reportersEmail = contactDetails?.reporterEmailAddress || ''
  const hasPhoneNumber = !!(contactDetails?.reporterPhoneNumber)
  const selectedAnswerIds = imagesOrVideoAnswer?.map(item => item.answerId) || []
  const userAgreedForVideos = journeyConfig
    ? selectedAnswerIds.includes(journeyConfig.imagesQuestion.answers.yesVideo.answerId)
    : false
  const userAgreedForImages = journeyConfig
    ? selectedAnswerIds.includes(journeyConfig.imagesQuestion.answers.yesPhotos.answerId)
    : false

  let mediaUploadLink

  if (userAgreedForImages) {
    mediaUploadLink = `${mediaUploadBaseURL}?sirid=${session.id}`
  }

  return {
    reportersEmail,
    hasPhoneNumber,
    userAgreedForVideos,
    userAgreedForImages,
    mediaUploadLink
  }
}

const sendReport = async (request, payload) => {
  if (!validatePayload(payload)) {
    throw new Error('Invalid payload')
  }

  const reportSentPageData = buildDataForReportSentPage(request.yar)
  request.yar.set(constants.redisKeys.REPORT_SENT_PAGE_DATA, reportSentPageData)

  const submissionTimestamp = request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP)
  const journey = journeyMap[request.yar.get(constants.redisKeys.QUESTION_SET_ID)]

  if (reportSentPageData.userAgreedForImages) {
    await request.server.app.mediaUploadCache.set(request.yar.id, {
      dateTime: submissionTimestamp,
      journey
    }, 0)

    request.logger.info(`send-report.js:sendReport: media upload cache set for session ${request.yar.id} with journey ${journey} and timestamp ${submissionTimestamp}`)
  }

  await sendMessage(request.logger, payload)
}

export {
  sendReport,
  buildDataForReportSentPage
}
