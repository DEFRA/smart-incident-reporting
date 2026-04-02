import constants from '../utils/constants.js'
import config from '../utils/config.js'
import { formattedDate } from '../utils/date-helpers.js'

const handlers = {
  get: async (request, h) => {
    const questionSetID = request.yar.get(constants.redisKeys.QUESTION_SET_ID)
    const photoUploadDetails = getPhotoUploadDetails(request, questionSetID)
    request.yar.reset()
    const context = _getContext()
    return h.view(constants.views.REPORT_SENT, {
      ...context, photoUploadDetails
    })
  }
}

function getPhotoUploadDetails (request, questionSetID) {
  const keyMap = {
    100: {
      contact: constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS,
      images: constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO,
      journey: 'water pollution'
    },
    200: {
      contact: constants.redisKeys.SMELL_CONTACT_DETAILS,
      images: constants.redisKeys.SMELL_IMAGES_OR_VIDEO,
      journey: 'smell'
    },
    300: {
      contact: constants.redisKeys.BLOCKAGE_CONTACT_DETAILS,
      images: constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO,
      journey: 'blockage'
    },
    1800: {
      contact: constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS,
      images: constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO,
      journey: 'illegal fishing'
    }
  }

  const keys = keyMap[questionSetID]

  if (!keys) {
    return {
      userAgreedForImages: false,
      reportersEmail: '',
      photoUploadLink: null
    }
  }

  const submissionTimestamp = request.yar.get(constants.redisKeys.SUBMISSION_TIMESTAMP)
  const reportersEmail =
    request.yar.get(keys.contact).reporterEmailAddress

  const userAgreedForImages =
    request.yar.get(keys.images)[0].questionResponse

  const photoUploadLink = getPhotoUploadLink(keys.journey, submissionTimestamp)

  return { userAgreedForImages, reportersEmail, photoUploadLink }
}

function getPhotoUploadLink (journey, submissionTimestamp) {
  const mediaUploadUrl = new URL(config.mediaUploadBaseUrl)
  mediaUploadUrl.searchParams.set('journey', journey)
  mediaUploadUrl.searchParams.set('dateTime', formattedDate(submissionTimestamp))

  return mediaUploadUrl.toString()
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
