import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import imageChecker from '../../services/image-checker.js'

const url = constants.routes.SEND_PHOTOS
const header = 'Send photos'

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

    it('should render a post button to trigger photo checking', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK)
      expect(response.payload).toContain('Check photos')
    })
  })

  describe('POST', () => {
    it('should call image checker when thumbnails are present in session', async () => {
      const thumbnails = [
        {
          finalFilename: 'upload-id/photo1.jpg',
          thumbLoc: '/public/thumbnails/upload-id-photo1-thumbnail.jpg'
        }
      ]

      const response = await submitPostRequest({ url }, constants.statusCodes.REDIRECT, {
        thumbnails
      })

      expect(imageChecker.validate).toHaveBeenCalledWith(thumbnails)
    })

    it('should redirect to send-photos when thumbnails are present in session', async () => {
      const response = await submitPostRequest({ url }, constants.statusCodes.REDIRECT, {
        thumbnails: [
          {
            finalFilename: 'upload-id/photo1.jpg',
            thumbLoc: '/public/thumbnails/upload-id-photo1-thumbnail.jpg'
          }
        ]
      })

      expect(response.headers.location).toBe(constants.routes.SEND_PHOTOS)
    })

    it('should call image checker with empty list when no thumbnails exist in session', async () => {
      const response = await submitPostRequest({ url }, constants.statusCodes.REDIRECT)

      expect(imageChecker.validate).toHaveBeenCalledWith([])
    })

    it('should redirect to send-photos when no thumbnails exist in session', async () => {
      const response = await submitPostRequest({ url }, constants.statusCodes.REDIRECT)

      expect(response.headers.location).toBe(constants.routes.SEND_PHOTOS)
    })
  })
})
