import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import fs from 'node:fs'
import { getUploadContainerClient } from '../../services/blob-storage.js'

jest.mock('../../services/blob-storage.js', () => ({
  getUploadContainerClient: jest.fn()
}))

jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  existsSync: jest.fn(),
  unlinkSync: jest.fn()
}))

const url = constants.routes.YOUR_PHOTOS
const header = 'Your photos'

const mockThumbnails = [
  {
    finalFilename: 'upload-id/photo1.png',
    thumbLoc: '/public/thumbnails/upload-id-0.png'
  },
  {
    finalFilename: 'upload-id/photo2.jpg',
    thumbLoc: '/public/thumbnails/upload-id-1.jpg'
  }
]

describe(url, () => {
  let mockDeleteIfExists

  beforeEach(() => {
    mockDeleteIfExists = jest.fn().mockResolvedValue()

    getUploadContainerClient.mockResolvedValue({
      getBlockBlobClient: () => ({
        deleteIfExists: mockDeleteIfExists
      })
    })

    fs.existsSync.mockReturnValue(true)
    fs.unlinkSync.mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return success response and correct view', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK)
      expect(response.payload).toContain('Your photos')
    })

    it('should display correct header', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK)
      expect(response.payload).toContain('<h1 class="govuk-heading-l">Your photos</h1>')
    })

    it('should show correct message when no photos added (remainingPhotos = 5)', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {})
      expect(response.payload).toContain('You have no photos added.')
      expect(response.payload).toContain('You can add up to 5 photos.')
    })

    it('should show correct message when some photos added (remainingPhotos between 1-4)', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails: mockThumbnails
      })
      expect(response.payload).toContain('You can add 3 more photos.')
    })

    it('should show singular "photo" when remainingPhotos is 1', async () => {
      const thumbnails = Array.from({ length: 4 }, (_, index) => ({
        finalFilename: `upload-id/photo${index}.png`,
        thumbLoc: `/public/thumbnails/upload-id-${index}.png`
      }))

      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails
      })
      expect(response.payload).toContain('You can add 1 more photo.')
    })

    it('should show correct message when max photos reached (remainingPhotos = 0)', async () => {
      const thumbnails = Array.from({ length: 5 }, (_, index) => ({
        finalFilename: `upload-id/photo${index}.png`,
        thumbLoc: `/public/thumbnails/upload-id-${index}.png`
      }))

      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails
      })
      expect(response.payload).toContain('You have added the maximum number of photos allowed.')
    })

    it('should display thumbnails from session', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails: mockThumbnails
      })
      expect(response.payload).toContain('photo1.png')
      expect(response.payload).toContain('photo2.jpg')
      expect(response.payload).toContain('/public/thumbnails/upload-id-0.png')
      expect(response.payload).toContain('/public/thumbnails/upload-id-1.jpg')
    })

    it('should show "Add a photo" link when no photos added', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {})
      expect(response.payload).toContain('Add a photo')
      expect(response.payload).toContain('href="/add-a-photo"')
    })

    it('should show "Add another photo" link when some photos added', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails: mockThumbnails
      })
      expect(response.payload).toContain('Add another photo')
      expect(response.payload).toContain('href="/add-a-photo"')
    })

    it('should not show add photo link when max photos reached', async () => {
      const thumbnails = Array.from({ length: 5 }, (_, index) => ({
        finalFilename: `upload-id/photo${index}.png`,
        thumbLoc: `/public/thumbnails/upload-id-${index}.png`
      }))

      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails
      })
      expect(response.payload).not.toContain('Add another photo')
      expect(response.payload).not.toContain('Add a photo')
    })

    it('should show Continue button', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK)
      expect(response.payload).toContain('Continue')
    })

    it('should show Remove button for each photo', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails: mockThumbnails
      })
      expect(response.payload).toContain('Remove')
      expect(response.payload).toContain('govuk-visually-hidden')
      expect(response.payload).toContain('photo1.png')
      expect(response.payload).toContain('photo2.jpg')
    })

    it('should handle empty thumbnails array', async () => {
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, {
        thumbnails: []
      })
      expect(response.statusCode).toBe(constants.statusCodes.OK)
      expect(response.payload).toContain('Your photos')
    })
  })

  describe('POST', () => {
    it('should redirect to YOUR_PHOTOS after removing a photo', async () => {
      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, { thumbnails: [...mockThumbnails] })

      expect(response.headers.location).toBe(constants.routes.YOUR_PHOTOS)
    })

    it('should remove photo from session', async () => {
      const thumbnails = [...mockThumbnails]
      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, { thumbnails })

      const updatedThumbnails = response.request.yar.get('thumbnails')
      expect(updatedThumbnails.length).toBe(1)
      expect(updatedThumbnails[0].finalFilename).toBe('upload-id/photo2.jpg')
    })

    it('should delete photo from Azure Blob Storage', async () => {
      await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, { thumbnails: [...mockThumbnails] })

      expect(mockDeleteIfExists).toHaveBeenCalled()
    })

    it('should delete both original and thumbnail from blob storage', async () => {
      await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, { thumbnails: [...mockThumbnails] })

      // Should be called twice: once for original, once for thumbnail
      expect(mockDeleteIfExists).toHaveBeenCalledTimes(2)
    })

    it('should delete local thumbnail file', async () => {
      await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, { thumbnails: [...mockThumbnails] })

      expect(fs.existsSync).toHaveBeenCalled()
      expect(fs.unlinkSync).toHaveBeenCalled()
    })

    it('should handle invalid imageIndex gracefully', async () => {
      const thumbnails = [...mockThumbnails]
      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '999' }
      }, 302, { thumbnails })

      const updatedThumbnails = response.request.yar.get('thumbnails')
      expect(updatedThumbnails.length).toBe(2)
      expect(response.headers.location).toBe(constants.routes.YOUR_PHOTOS)
    })

    it('should handle negative imageIndex gracefully', async () => {
      const thumbnails = [...mockThumbnails]
      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '-1' }
      }, 302, { thumbnails })

      const updatedThumbnails = response.request.yar.get('thumbnails')
      expect(updatedThumbnails.length).toBe(2)
    })

    it('should handle non-numeric imageIndex gracefully', async () => {
      const thumbnails = [...mockThumbnails]
      const response = await submitPostRequest({
        url,
        payload: { imageIndex: 'invalid' }
      }, 302, { thumbnails })

      const updatedThumbnails = response.request.yar.get('thumbnails')
      expect(updatedThumbnails.length).toBe(2)
    })

    it('should handle missing thumbnails in session', async () => {
      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, {})

      expect(response.headers.location).toBe(constants.routes.YOUR_PHOTOS)
      expect(response.statusCode).toBe(302)
    })

    it('should handle errors during blob deletion gracefully', async () => {
      mockDeleteIfExists.mockRejectedValue(new Error('Blob deletion failed'))
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, { thumbnails: [...mockThumbnails] })

      expect(response.headers.location).toBe(constants.routes.YOUR_PHOTOS)
      expect(consoleSpy).toHaveBeenCalledWith('Error removing image:', expect.any(Error))

      consoleSpy.mockRestore()
    })

    it('should handle missing local thumbnail file gracefully', async () => {
      fs.existsSync.mockReturnValue(false)

      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '0' }
      }, 302, { thumbnails: [...mockThumbnails] })

      expect(response.headers.location).toBe(constants.routes.YOUR_PHOTOS)
      expect(fs.unlinkSync).not.toHaveBeenCalled()
    })

    it('should remove correct photo when removing middle item', async () => {
      const thumbnails = [
        { finalFilename: 'upload-id/photo1.png', thumbLoc: '/thumb-0.png' },
        { finalFilename: 'upload-id/photo2.png', thumbLoc: '/thumb-1.png' },
        { finalFilename: 'upload-id/photo3.png', thumbLoc: '/thumb-2.png' }
      ]

      const response = await submitPostRequest({
        url,
        payload: { imageIndex: '1' }
      }, 302, { thumbnails: [...thumbnails] })

      const updatedThumbnails = response.request.yar.get('thumbnails')
      expect(updatedThumbnails.length).toBe(2)
      expect(updatedThumbnails[0].finalFilename).toBe('upload-id/photo1.png')
      expect(updatedThumbnails[1].finalFilename).toBe('upload-id/photo3.png')
    })
  })
})
