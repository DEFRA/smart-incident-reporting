import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.REPORT_SENT
const header = 'Report sent'

const getUploadLink = async (userAgreedForImages) => {
  const sessionData = {
    [constants.redisKeys.QUESTION_SET_ID]: 100,
    [constants.redisKeys.SUBMISSION_TIMESTAMP]: '2026-04-01T10:30:00.000Z',
    [constants.redisKeys.WATER_POLLUTION_CONTACT_DETAILS]: {
      reporterEmailAddress: 'reporter@example.com'
    },
    [constants.redisKeys.WATER_POLLUTION_IMAGES_OR_VIDEO]: [{
      questionResponse: userAgreedForImages
    }]
  }

  const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
  const html = parse(response.payload)

  return html.querySelector(`a[href*="${process.env.MEDIA_UPLOAD_BASE_URL}"]`)
}

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })

    it('should render external upload link when user agreed to upload images', async () => {
      const uploadLink = await getUploadLink(true)

      expect(uploadLink).toBeTruthy()
    })

    it('should include journey query param in upload link', async () => {
      const uploadLink = await getUploadLink(true)

      expect(uploadLink.getAttribute('href')).toContain('journey=water+pollution')
    })

    it('should include dateTime query param in upload link', async () => {
      const uploadLink = await getUploadLink(true)

      expect(uploadLink.getAttribute('href')).toContain('dateTime=')
    })

    it('should not render upload link when user did not agree to upload images', async () => {
      const uploadLink = await getUploadLink(false)

      expect(uploadLink).toBeFalsy()
    })
  })
})
