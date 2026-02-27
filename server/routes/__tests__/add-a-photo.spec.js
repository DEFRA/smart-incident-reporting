import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { BlobServiceClient } from '@azure/storage-blob'
import fs from 'node:fs'
import FormData from 'form-data'
import * as addPhoto from '../add-a-photo.js'

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: jest.fn(),
  StorageSharedKeyCredential: jest.fn()
}))

const mockValidPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+5e0AAAAASUVORK5CYII=',
  'base64'
)

const createForm = (filename = '', content = 'data', contentType = 'image/png') => {
  const form = new FormData()
  const fileBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
  form.append('fileUpload1', fileBuffer, { filename, contentType })
  return form
}

const url = constants.routes.ADD_A_PHOTO
const header = 'Add a photo'

describe(url, () => {
  beforeEach(() => {
    BlobServiceClient.mockImplementation(() => ({
      getContainerClient: () => ({
        createIfNotExists: () => Promise.resolve(),
        getBlockBlobClient: () => ({
          uploadData: () => Promise.resolve(),
          downloadToBuffer: () => Promise.resolve(mockValidPng)
        })
      })
    }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('GET', () => {
    it('should return correct view', async () => {
      const response = await submitGetRequest({ url }, header)
      expect(response.result).toContain(header)
    })

    it('should set upload-id if not present', async () => {
      const response = await submitGetRequest({ url }, header)
      expect(response.request.yar.get('upload-id')).toBeDefined()
    })

    it('should keep existing upload-id if already present', async () => {
      const existingUploadId = 'existing-upload-id'
      const response = await submitGetRequest({ url }, header, 200, { 'upload-id': existingUploadId })

      expect(response.request.yar.get('upload-id')).toBe(existingUploadId)
    })
  })

  describe('POST', () => {
    describe('empty file', () => {
      it('should return correct error message if no file provided', async () => {
        const form = new FormData()
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 200)

        expect(response.result).toContain('Select a file.')
      })

      it('should return correct error message if file missing original filename', async () => {
        const form = createForm('')
        form.append('fileUpload1', Buffer.from('data'), { filename: '' })
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 200)

        expect(response.result).toContain('Select a file.')
      })
    })

    it('should return size error if file is over 10MB', async () => {
      const form = createForm('big.png', Buffer.alloc(11 * 1024 * 1024), 'image/png')
      const response = await submitPostRequest({
        url,
        payload: form.getBuffer(),
        headers: form.getHeaders()
      }, 200)

      expect(response.result).toContain('The selected file must be smaller than 10MB.')
    })

    it('should show max selected files content when 5 files already exist', async () => {
      const form = createForm('valid.png', mockValidPng, 'image/png')
      const thumbnails = Array.from({ length: 5 }, (_, index) => ({
        finalFilename: `upload-id/${index}.png`,
        thumbLoc: `/public/thumbnails/upload-id-${index}.png`
      }))

      const response = await submitPostRequest({
        url,
        payload: form.getBuffer(),
        headers: form.getHeaders()
      }, 200, { thumbnails })

      expect(response.result).toContain('You have added the maximum number of photos allowed')
    })

    describe('upload failure', () => {
      it('should return default error if upload fails', async () => {
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
          throw new Error('fail')
        })

        const form = createForm('valid.png', mockValidPng, 'image/png')
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 200)

        expect(response.result).toContain('could not be uploaded')
      })
    })

    describe('successful upload', () => {
      beforeEach(() => {
        jest.spyOn(addPhoto, 'streamToBuffer').mockResolvedValue(mockValidPng)
      })

      it('should redirect on success', async () => {
        const form = createForm('valid.png', mockValidPng, 'image/png')
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 302)

        expect(response.headers.location).toBe(constants.routes.YOUR_PHOTOS)
      })

      it('should store thumbnails in session', async () => {
        const form = createForm('valid.png', mockValidPng, 'image/png')
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 302)

        const thumbnails = response.request.yar.get('thumbnails')

        expect(Array.isArray(thumbnails)).toBe(true)
      })

      it('should add at least one thumbnail to session on successful upload', async () => {
        const form = createForm('valid.png', mockValidPng, 'image/png')
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 302)

        const thumbnails = response.request.yar.get('thumbnails')

        expect(thumbnails.length).toBeGreaterThan(0)
      })

      it('should store thumbLoc in session thumbnail entry', async () => {
        const form = createForm('valid.png', mockValidPng, 'image/png')
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 302)

        const thumbnails = response.request.yar.get('thumbnails')

        expect(thumbnails[0]).toHaveProperty('thumbLoc')
      })

      it('should store finalFilename in session thumbnail entry', async () => {
        const form = createForm('valid.png', mockValidPng, 'image/png')
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 302)

        const thumbnails = response.request.yar.get('thumbnails')

        expect(thumbnails[0]).toHaveProperty('finalFilename')
      })
    })
  })
})
