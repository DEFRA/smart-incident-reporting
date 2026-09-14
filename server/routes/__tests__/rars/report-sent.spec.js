import { submitGetRequest } from '../../../__test-helpers__/server.js'
import { parse } from 'node-html-parser'
import constants from '../../../utils/constants.js'
import { questionSets } from '../../../utils/question-sets.js'
import createReportSentRoutes from '../../rars/report-sent.js'

const question = questionSets.REPORT_REGULATED_SITE.questions.RARS_IMAGES_OR_VIDEO
const submissionTimestamp = '2026-04-09T09:00:00.000Z'
const sessionId = 'test-session-id'
const expectedMediaUploadLink = `/media/upload-photo?sirid=${sessionId}`
const expectedCacheTtlMs = 168 * 60 * 60 * 1000

const problems = [
  {
    problem: 'smell',
    url: constants.routes.SMELL_REPORT_SENT
  },
  {
    problem: 'noise',
    url: constants.routes.NOISE_REPORT_SENT
  },
  {
    problem: 'dust',
    url: constants.routes.DUST_REPORT_SENT
  },
  {
    problem: 'litter',
    url: constants.routes.LITTER_REPORT_SENT
  },
  {
    problem: 'mud',
    url: constants.routes.MUD_REPORT_SENT
  },
  {
    problem: 'vermin',
    url: constants.routes.VERMIN_REPORT_SENT
  }
]

const handler = async (problem, overrides = {}) => {
  const set = jest.fn()
  const view = jest.fn()
  const reset = jest.fn()

  const contactDetails = overrides.contactDetails !== undefined
    ? overrides.contactDetails
    : { reporterEmailAddress: `${problem}@test.com` }
  const imagesOrVideo = overrides.imagesOrVideo !== undefined
    ? overrides.imagesOrVideo
    : [{ answerId: question.answers.yesPhotos.answerId }, { answerId: question.answers.noVideo.answerId }]

  await createReportSentRoutes({ problem, route: `/test-${problem}-report-sent` })[0].handler({
    yar: {
      get: jest.fn(key => ({
        [constants.redisKeys.SUBMISSION_TIMESTAMP]: submissionTimestamp,
        [constants.redisKeys.RARS_CONTACT_DETAILS]: contactDetails,
        [constants.redisKeys.RARS_IMAGES_OR_VIDEO]: imagesOrVideo
      }[key])),
      id: sessionId,
      reset
    },
    server: {
      app: {
        mediaUploadCache: { set }
      }
    }
  }, { view })

  return { reset, set, view }
}

describe('RARS report sent routes', () => {
  describe.each(problems)('$problem report-sent', ({ url }) => {
    describe('GET', () => {
      it('Should return success response and correct view', async () => {
        await submitGetRequest({ url }, 'Report sent')
      })

      it('should render a blue panel when the user agreed to upload photos', async () => {
        const response = await submitGetRequest({ url }, 'Report sent', constants.statusCodes.OK, {
          [constants.redisKeys.SUBMISSION_TIMESTAMP]: submissionTimestamp,
          [constants.redisKeys.RARS_CONTACT_DETAILS]: { reporterEmailAddress: 'smell@test.com' },
          [constants.redisKeys.RARS_IMAGES_OR_VIDEO]: [
            { answerId: question.answers.yesPhotos.answerId },
            { answerId: question.answers.noVideo.answerId }
          ]
        })
        const html = parse(response.payload)

        expect(html.querySelector('.govuk-panel').classList.contains('govuk-panel--blue')).toBe(true)
      })

      it('should render the default confirmation panel when the user has no photos', async () => {
        const response = await submitGetRequest({ url }, 'Report sent', constants.statusCodes.OK, {
          [constants.redisKeys.SUBMISSION_TIMESTAMP]: submissionTimestamp,
          [constants.redisKeys.RARS_CONTACT_DETAILS]: { reporterEmailAddress: 'smell@test.com' },
          [constants.redisKeys.RARS_IMAGES_OR_VIDEO]: [
            { answerId: question.answers.noPhotos.answerId },
            { answerId: question.answers.noVideo.answerId }
          ]
        })
        const html = parse(response.payload)
        const panel = html.querySelector('.govuk-panel')

        expect(panel.classList.contains('govuk-panel--confirmation')).toBe(true)
        expect(panel.classList.contains('govuk-panel--blue')).toBe(false)
      })
    })
  })

  describe.each(problems)('$problem report-sent handler', ({ problem }) => {
    it('should cache the problem journey when the user agreed to upload photos', async () => {
      const { set } = await handler(problem)

      expect(set).toHaveBeenCalledWith(sessionId, {
        journey: problem,
        dateTime: submissionTimestamp
      }, expectedCacheTtlMs)
    })

    it('should pass photo upload details to the shared report-sent view', async () => {
      const { view } = await handler(problem)

      expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
        problem,
        photoUploadDetails: {
          mediaUploadLink: expectedMediaUploadLink,
          reportersEmail: `${problem}@test.com`,
          hasPhoneNumber: false,
          userAgreedForVideos: false,
          userAgreedForImages: true
        }
      }))
    })
  })

  it('should set hasPhoneNumber when a phone number was provided', async () => {
    const { view } = await handler('smell', {
      contactDetails: {
        reporterEmailAddress: 'smell@test.com',
        reporterPhoneNumber: '01234567890'
      }
    })

    expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
      photoUploadDetails: expect.objectContaining({
        hasPhoneNumber: true
      })
    }))
  })

  it.each([
    {
      scenario: 'noPhotos/yesVideo',
      imageAnswers: [question.answers.noPhotos.answerId, question.answers.yesVideo.answerId],
      expectedVideos: true,
      expectedImages: false
    },
    {
      scenario: 'yesPhotos/noVideo',
      imageAnswers: [question.answers.yesPhotos.answerId, question.answers.noVideo.answerId],
      expectedVideos: false,
      expectedImages: true
    },
    {
      scenario: 'yesPhotos/yesVideo',
      imageAnswers: [question.answers.yesPhotos.answerId, question.answers.yesVideo.answerId],
      expectedVideos: true,
      expectedImages: true
    },
    {
      scenario: 'noPhotos/noVideo',
      imageAnswers: [question.answers.noPhotos.answerId, question.answers.noVideo.answerId],
      expectedVideos: false,
      expectedImages: false
    }
  ])('should set media flags correctly when $scenario provided', async ({ imageAnswers, expectedVideos, expectedImages }) => {
    const { set, view } = await handler('smell', {
      imagesOrVideo: imageAnswers.map(answerId => ({ answerId }))
    })

    if (expectedImages) {
      expect(set).toHaveBeenCalledWith(sessionId, expect.objectContaining({ journey: 'smell' }), expectedCacheTtlMs)
    } else {
      expect(set).not.toHaveBeenCalled()
    }
    expect(view).toHaveBeenCalledWith(constants.views.REPORT_SENT, expect.objectContaining({
      photoUploadDetails: expect.objectContaining({
        userAgreedForVideos: expectedVideos,
        userAgreedForImages: expectedImages
      })
    }))
  })

  it('should default photo upload details when contact details and image answer are missing', async () => {
    const { reset, set, view } = await handler('smell', {
      contactDetails: null,
      imagesOrVideo: null
    })

    expect(set).not.toHaveBeenCalled()
    expect(reset).toHaveBeenCalledTimes(1)
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
})
