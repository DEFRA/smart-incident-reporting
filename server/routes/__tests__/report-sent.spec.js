import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
import { buildDataForReportSentPage } from '../../services/send-report.js'
import reportSentRoutes from '../report-sent.js'

const url = constants.routes.REPORT_SENT
const header = 'Report sent'
const submissionTimestamp = '2026-04-09T09:00:00.000Z'
const sessionId = 'test-session-id'
const expectedMediaUploadLink = `/media/upload-photo?sirid=${sessionId}`

const journeySessionData = {
  100: {
    contactDetails: {
      reporterEmailAddress: 'water@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yesPhotos.answerId
    },
    {
      answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.noVideo.answerId
    }]
  },
  200: {
    contactDetails: {
      reporterEmailAddress: 'smell@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO.answers.yesPhotos.answerId
    },
    {
      answerId: questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO.answers.noVideo.answerId
    }]
  },
  300: {
    contactDetails: {
      reporterEmailAddress: 'blockage@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO.answers.yesPhotos.answerId
    },
    {
      answerId: questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO.answers.noVideo.answerId
    }]
  },
  1800: {
    contactDetails: {
      reporterEmailAddress: 'fishing@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_IMAGES_OR_VIDEO.answers.yesPhotos.answerId
    },
    {
      answerId: questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_IMAGES_OR_VIDEO.answers.noVideo.answerId
    }]
  }
}

const handler = async (questionSetID, overrides = {}) => {
  const set = jest.fn()
  const view = jest.fn()

  const defaultJourneyData = journeySessionData[questionSetID] || {
    contactDetails: { reporterEmailAddress: '' },
    imagesOrVideo: []
  }

  const contactDetails = overrides.contactDetails !== undefined
    ? overrides.contactDetails
    : defaultJourneyData.contactDetails
  const imagesOrVideo = overrides.imagesOrVideo !== undefined
    ? overrides.imagesOrVideo
    : defaultJourneyData.imagesOrVideo

  const keyMap = {
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

  const journeyKeys = keyMap[questionSetID] || {}
  const reportSentPageData = buildDataForReportSentPage({
    id: sessionId,
    get: jest.fn(key => ({
      [constants.redisKeys.QUESTION_SET_ID]: questionSetID,
      [journeyKeys.contactDetailsKey]: contactDetails,
      [journeyKeys.imagesOrVideoKey]: imagesOrVideo
    }[key]))
  })

  await reportSentRoutes[0].handler({
    yar: {
      get: jest.fn(key => ({
        [constants.redisKeys.QUESTION_SET_ID]: questionSetID,
        [constants.redisKeys.SUBMISSION_TIMESTAMP]: submissionTimestamp,
        [constants.redisKeys.REPORT_SENT_PAGE_DATA]: reportSentPageData,
        [journeyKeys.contactDetailsKey]: contactDetails,
        [journeyKeys.imagesOrVideoKey]: imagesOrVideo
      }[key])),
      id: sessionId,
      reset: jest.fn()
    },
    server: {
      app: {
        mediaUploadCache: { set }
      }
    }
  }, { view })

  return { set, view }
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })

    it('should pass mediaUploadLink in photoUploadDetails', async () => {
      const { view } = await handler(100)

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        photoUploadDetails: expect.objectContaining({
          mediaUploadLink: expectedMediaUploadLink
        })
      }))
    })

    it.each([
      { questionSetID: 100, email: 'water@test.com' },
      { questionSetID: 200, email: 'smell@test.com' },
      { questionSetID: 300, email: 'blockage@test.com' },
      { questionSetID: 1800, email: 'fishing@test.com' }
    ])('should pass photo upload details for questionSetID $questionSetID', async ({ questionSetID, email }) => {
      const { view } = await handler(questionSetID)

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        photoUploadDetails: {
          mediaUploadLink: expectedMediaUploadLink,
          reportersEmail: email,
          hasPhoneNumber: false,
          userAgreedForVideos: false,
          userAgreedForImages: true
        }
      }))
    })

    it('should default photo upload details when contact details and image answer are missing', async () => {
      const { view } = await handler(100, {
        contactDetails: null,
        imagesOrVideo: null
      })

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        photoUploadDetails: {
          mediaUploadLink: undefined,
          reportersEmail: '',
          hasPhoneNumber: false,
          userAgreedForVideos: false,
          userAgreedForImages: false
        }
      }))
    })

    it.each([
      { hasPhone: true, expectedHasPhoneNumber: true, description: 'phone provided' },
      { hasPhone: false, expectedHasPhoneNumber: false, description: 'phone not provided' }
    ])('should set hasPhoneNumber correctly when $description', async ({ hasPhone, expectedHasPhoneNumber }) => {
      const contactDetails = {
        reporterEmailAddress: 'water@test.com'
      }
      if (hasPhone) {
        contactDetails.reporterPhoneNumber = '01234567890'
      }
      const { view } = await handler(100, { contactDetails })

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        photoUploadDetails: expect.objectContaining({
          hasPhoneNumber: expectedHasPhoneNumber
        })
      }))
    })

    it.each([
      {
        scenario: 'noPhotos/yesVideo',
        imageAnswers: [
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.noPhotos.answerId,
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yesVideo.answerId
        ],
        expectedVideos: true,
        expectedImages: false
      },
      {
        scenario: 'yesPhotos/noVideo',
        imageAnswers: [
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yesPhotos.answerId,
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.noVideo.answerId
        ],
        expectedVideos: false,
        expectedImages: true
      },
      {
        scenario: 'yesPhotos/yesVideo',
        imageAnswers: [
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yesPhotos.answerId,
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yesVideo.answerId
        ],
        expectedVideos: true,
        expectedImages: true
      },
      {
        scenario: 'noPhotos/noVideo',
        imageAnswers: [
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.noPhotos.answerId,
          questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.noVideo.answerId
        ],
        expectedVideos: false,
        expectedImages: false
      }
    ])('should set media flags correctly when $scenario provided', async ({ imageAnswers, expectedVideos, expectedImages }) => {
      const imagesOrVideo = imageAnswers ? imageAnswers.map(answerId => ({ answerId })) : null
      const { view } = await handler(100, { imagesOrVideo })

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        photoUploadDetails: expect.objectContaining({
          userAgreedForVideos: expectedVideos,
          userAgreedForImages: expectedImages
        })
      }))
    })
  })
})
