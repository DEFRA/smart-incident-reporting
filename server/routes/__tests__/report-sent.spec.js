import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { questionSets } from '../../utils/question-sets.js'
// import config from '../../utils/config.js'
import reportSentRoutes from '../report-sent.js'

const url = constants.routes.REPORT_SENT
const header = 'Report sent'
const submissionTimestamp = '2026-04-09T09:00:00.000Z'

const journeySessionData = {
  100: {
    contactDetails: {
      reporterEmailAddress: 'water@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.WATER_POLLUTION.questions.WATER_POLLUTION_IMAGES_OR_VIDEO.answers.yes.answerId
    }]
  },
  200: {
    contactDetails: {
      reporterEmailAddress: 'smell@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.SMELL.questions.SMELL_IMAGES_OR_VIDEO.answers.yes.answerId
    }]
  },
  300: {
    contactDetails: {
      reporterEmailAddress: 'blockage@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.BLOCKAGE.questions.BLOCKAGE_IMAGES_OR_VIDEO.answers.yes.answerId
    }]
  },
  1800: {
    contactDetails: {
      reporterEmailAddress: 'fishing@test.com'
    },
    imagesOrVideo: [{
      answerId: questionSets.ILLEGAL_FISHING.questions.ILLEGAL_FISHING_IMAGES_OR_VIDEO.answers.yes.answerId
    }]
  }
}

const handler = async (questionSetID, overrides = {}) => {
  const yarSet = jest.fn()
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

  await reportSentRoutes[0].handler({
    yar: {
      get: jest.fn(key => ({
        [constants.redisKeys.QUESTION_SET_ID]: questionSetID,
        [constants.redisKeys.SUBMISSION_TIMESTAMP]: submissionTimestamp,
        [journeyKeys.contactDetailsKey]: contactDetails,
        [journeyKeys.imagesOrVideoKey]: imagesOrVideo
      }[key])),
      set: yarSet,
      reset: jest.fn()
    },
    server: {
      cache: jest.fn()
    }
  }, { view })

  return { yarSet, view }
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })

    it.each([
      { questionSetID: 100, expectedJourney: 'water pollution' },
      { questionSetID: 200, expectedJourney: 'smell' },
      { questionSetID: 300, expectedJourney: 'blockage' },
      { questionSetID: 1800, expectedJourney: 'illegal fishing' }
    ])('should set journey "$expectedJourney" for questionSetID $questionSetID', async ({ questionSetID, expectedJourney }) => {
      const { yarSet } = await handler(questionSetID)

      expect(yarSet).toHaveBeenCalledWith('journey', expectedJourney)
      expect(yarSet).toHaveBeenCalledWith('dateTime', submissionTimestamp)
    })

    it('should pass mediaUploadLink in photoUploadDetails', async () => {
      const { view } = await handler(100)

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        photoUploadDetails: expect.objectContaining({
          mediaUploadLink: 'https://sir-uploader-dev1.azure.defra.cloud/upload-photo'
          // mediaUploadLink: config.mediaUploadUrl
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
          mediaUploadLink: 'https://sir-uploader-dev1.azure.defra.cloud/upload-photo',
          reportersEmail: email,
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
          mediaUploadLink: 'https://sir-uploader-dev1.azure.defra.cloud/upload-photo',
          reportersEmail: '',
          userAgreedForImages: false
        }
      }))
    })
  })
})
