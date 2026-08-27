import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { payload as validPayload } from '../../__mock-data__/session-water-pollution.js'
import { sendMessage } from '../service-bus.js'
import { buildDataForReportSentPage, sendReport } from '../send-report.js'

jest.mock('../service-bus.js', () => ({
  sendMessage: jest.fn()
}))

const journeyKeyMap = {
  100: {
    contactDetailsKey: constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO
  },
  200: {
    contactDetailsKey: constants.redisKeys.SMELL_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.SMELL_IMAGES_OR_VIDEO
  },
  300: {
    contactDetailsKey: constants.redisKeys.BLOCKAGE_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.BLOCKAGE_IMAGES_OR_VIDEO
  },
  1800: {
    contactDetailsKey: constants.redisKeys.ILLEGAL_FISHING_CONTACT_DETAILS,
    imagesOrVideoKey: constants.redisKeys.ILLEGAL_FISHING_IMAGES_OR_VIDEO
  }
}

const buildSession = ({ questionSetID = 100, contactDetails = null, imagesOrVideoAnswer = null } = {}) => {
  const keys = journeyKeyMap[questionSetID] || {}

  return {
    id: 'session-123',
    get: jest.fn((key) => {
      if (key === constants.redisKeys.QUESTION_SET_ID) {
        return questionSetID
      }

      if (key === keys.contactDetailsKey) {
        return contactDetails
      }

      if (key === keys.imagesOrVideoKey) {
        return imagesOrVideoAnswer
      }

      return undefined
    })
  }
}

describe('buildDataForReportSentPage', () => {
  it('returns empty defaults when there is no matching journey data', () => {
    const session = buildSession({ questionSetID: 999, contactDetails: null, imagesOrVideoAnswer: null })

    expect(buildDataForReportSentPage(session)).toEqual({
      reportersEmail: '',
      hasPhoneNumber: false,
      userAgreedForVideos: false,
      userAgreedForImages: false,
      mediaUploadLink: undefined
    })
  })

  it('builds photo upload metadata when the user agrees to photos', () => {
    const contactDetails = {
      reporterEmailAddress: 'water@test.com',
      reporterPhoneNumber: '01234567890'
    }
    const imagesOrVideoAnswer = [{
      answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yesPhotos.answerId
    }, {
      answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.noVideo.answerId
    }]

    expect(buildDataForReportSentPage(buildSession({
      questionSetID: 100,
      contactDetails,
      imagesOrVideoAnswer
    }))).toEqual({
      reportersEmail: 'water@test.com',
      hasPhoneNumber: true,
      userAgreedForVideos: false,
      userAgreedForImages: true,
      mediaUploadLink: '/media/upload-photo?sirid=session-123'
    })
  })

  it('marks video consent without creating a photo upload link when the user only agrees to video', () => {
    const contactDetails = {
      reporterEmailAddress: 'blockage@test.com'
    }
    const imagesOrVideoAnswer = [{
      answerId: questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO.answers.noPhotos.answerId
    }, {
      answerId: questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO.answers.yesVideo.answerId
    }]

    expect(buildDataForReportSentPage(buildSession({
      questionSetID: 300,
      contactDetails,
      imagesOrVideoAnswer
    }))).toEqual({
      reportersEmail: 'blockage@test.com',
      hasPhoneNumber: false,
      userAgreedForVideos: true,
      userAgreedForImages: false,
      mediaUploadLink: undefined
    })
  })
})

describe('sendReport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('throws when the payload is invalid', async () => {
    const request = {
      yar: {
        get: jest.fn(),
        set: jest.fn(),
        id: 'session-123'
      },
      logger: { info: jest.fn() },
      server: { app: { mediaUploadCache: { set: jest.fn() } } }
    }

    await expect(sendReport(request, {})).rejects.toThrow('Invalid payload')
    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('stores report sent data and media upload cache for photo uploads, then sends the payload', async () => {
    const submissionTimestamp = '2026-04-09T09:00:00.000Z'
    const mediaUploadCacheSet = jest.fn().mockResolvedValue(undefined)
    const request = {
      yar: {
        id: 'session-123',
        set: jest.fn(),
        get: jest.fn((key) => {
          if (key === constants.redisKeys.QUESTION_SET_ID) return 100
          if (key === constants.redisKeys.SUBMISSION_TIMESTAMP) return submissionTimestamp
          return undefined
        })
      },
      server: {
        app: {
          mediaUploadCache: { set: mediaUploadCacheSet }
        }
      },
      logger: { info: jest.fn() }
    }

    request.yar.get = jest.fn((key) => {
      if (key === constants.redisKeys.QUESTION_SET_ID) return 100
      if (key === constants.redisKeys.SUBMISSION_TIMESTAMP) return submissionTimestamp
      if (key === constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS) {
        return {
          reporterEmailAddress: 'water@test.com',
          reporterPhoneNumber: '01234567890'
        }
      }
      if (key === constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO) {
        return [{
          answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yesPhotos.answerId
        }, {
          answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.noVideo.answerId
        }]
      }
      return undefined
    })

    await sendReport(request, validPayload)

    expect(request.yar.set).toHaveBeenCalledWith(constants.redisKeys.REPORT_SENT_PAGE_DATA, {
      reportersEmail: 'water@test.com',
      hasPhoneNumber: true,
      userAgreedForVideos: false,
      userAgreedForImages: true,
      mediaUploadLink: '/media/upload-photo?sirid=session-123'
    })
    expect(mediaUploadCacheSet).toHaveBeenCalledWith('session-123', {
      dateTime: submissionTimestamp,
      journey: 'water pollution'
    }, 0)
    expect(sendMessage).toHaveBeenCalledWith(request.logger, validPayload)
  })
})
