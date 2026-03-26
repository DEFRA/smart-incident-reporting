import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import imageChecker from '../../services/image-checker.js'

const url = constants.routes.SEND_PHOTOS
const header = 'Send photos'

const generateThumbnails = (count) =>
  Array.from({ length: count }, (_, i) => ({
    finalFilename: `upload-id/photo${i + 1}.jpg`,
    thumbLoc: `/public/thumbnails/upload-id-photo${i + 1}-thumbnail.jpg`
  }))

describe(url, () => {
  beforeEach(() => {
    jest.spyOn(imageChecker, 'validate').mockResolvedValue({ success: true, skipped: true })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK)
      expect(response.payload).toContain('Send photos')
    })

    it('should render a send photos submit button', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK)
      expect(response.payload).toContain('Send photos')
    })

    it.each([0, 1, 2, 3, 4, 5])('should display %i photos from the session', async (count) => {
      const thumbnails = generateThumbnails(count)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, { thumbnails })
      expect(response.payload).toContain(`You have added ${count} out of a maximum of 5.`)
    })
  })

  describe('POST', () => {
    it.each([0, 1, 2, 3, 4, 5])('should call image checker with %i thumbnails from the session', async (count) => {
      const thumbnails = generateThumbnails(count)
      await submitPostRequest({ url }, constants.statusCodes.REDIRECT, { thumbnails })
      expect(imageChecker.validate).toHaveBeenCalledWith(thumbnails)
    })

    it('should redirect to success when no thumbnails exist in session', async () => {
      const response = await submitPostRequest({ url }, constants.statusCodes.REDIRECT)
      expect(response.headers.location).toBe(constants.routes.SUCCESS)
    })
  })
})
