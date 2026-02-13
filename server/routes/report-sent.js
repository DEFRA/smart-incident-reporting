import constants from '../utils/constants.js'

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
      images: constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO
    },
    200: {
      contact: constants.redisKeys.SMELL_CONTACT_DETAILS,
      images: constants.redisKeys.SMELL_IMAGES_OR_VIDEO
    },
    300: {
      contact: constants.redisKeys.BLOCKAGE_CONTACT_DETAILS,
      images: constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO
    },
    1800: {
      contact: constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS,
      images: constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO
    }
  }

  const keys = keyMap[questionSetID]

  if (!keys) {
    return {
      userAgreedForImages: false,
      reportersEmail: ''
    }
  }
  const reportersEmail =
    request.yar.get(keys.contact).reporterEmailAddress

  const userAgreedForImages =
    request.yar.get(keys.images)[0].questionResponse

  return { userAgreedForImages, reportersEmail }
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
