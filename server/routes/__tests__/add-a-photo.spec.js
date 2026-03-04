import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { BlobServiceClient } from '@azure/storage-blob'
import crypto from 'node:crypto'
import fs from 'node:fs'
import FormData from 'form-data'
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import * as addPhoto from '../add-a-photo.js'

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: jest.fn(),
  StorageSharedKeyCredential: jest.fn()
}))

jest.mock('heic-convert', () => jest.fn())

const mockValidPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+5e0AAAAASUVORK5CYII=',
  'base64'
)
const UPLOAD_MAX_BYTES = 4 * 1024 * 1024

const createForm = (filename = '', content = 'data', contentType = 'image/png') => {
  const form = new FormData()
  const fileBuffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
  form.append('fileUpload1', fileBuffer, { filename, contentType })
  return form
}

const createNoiseImageBuffer = async ({ width, height, format = 'png' }) => {
  const pixelCount = width * height * 3
  const raw = crypto.randomBytes(pixelCount)

  const pipeline = sharp(raw, {
    raw: { width, height, channels: 3 }
  })

  if (format === 'jpeg') {
    return pipeline.jpeg({ quality: 90 }).toBuffer()
  }

  return pipeline.png().toBuffer()
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
    describe('file type', () => {
      const makeUploadFile = (filename, contentType = 'image/jpeg') => ({
        hapi: {
          filename,
          headers: {
            'content-type': contentType
          }
        }
      })

      const createImageBuffer = (channels = 3, output = 'webp') => {
        const image = sharp({
          create: {
            width: 1,
            height: 1,
            channels,
            background: channels === 4
              ? { r: 0, g: 0, b: 0, alpha: 0.5 }
              : { r: 0, g: 0, b: 0 }
          }
        })

        if (output === 'jpeg') {
          return image.jpeg().toBuffer()
        }

        if (output === 'png') {
          return image.png().toBuffer()
        }

        return image.webp().toBuffer()
      }

      it.each([
        ['jpeg', '.jpg'],
        ['png', '.png']
      ])('returns original extension for %s success', async (format, expectedExtension) => {
        const inputBuffer = await createImageBuffer(3, format)
        const result = await addPhoto.convertImageType(inputBuffer, makeUploadFile(`file.${format}`))
        expect(result.extension).toBe(expectedExtension)
      })

      it.each([
        ['jpeg'],
        ['png']
      ])('returns original buffer for %s success', async (format) => {
        const inputBuffer = await createImageBuffer(3, format)
        const result = await addPhoto.convertImageType(inputBuffer, makeUploadFile(`file.${format}`))
        expect(result.buffer).toEqual(inputBuffer)
      })

      it('has alpha converted to png', async () => {
        const webpWithAlpha = await createImageBuffer(4, 'webp')
        const result = await addPhoto.convertImageType(webpWithAlpha, makeUploadFile('alpha.webp', 'image/webp'))
        expect(result.extension).toBe('.png')
      })

      it('no alpha converted to jpg', async () => {
        const webpNoAlpha = await createImageBuffer(3, 'webp')
        const result = await addPhoto.convertImageType(webpNoAlpha, makeUploadFile('plain.webp', 'image/webp'))
        expect(result.extension).toBe('.jpg')
      })

      it.each([
        ['photo.heic', 'image/heic'],
        ['photo.heif', 'image/heif']
      ])('sharp error and %s upload converts to jpg extension via heic-convert', async (filename, contentType) => {
        heicConvert.mockResolvedValueOnce(Buffer.from('converted-jpg'))
        const result = await addPhoto.convertImageType(
          Buffer.from('not-a-real-image'),
          makeUploadFile(filename, contentType)
        )
        expect(result.extension).toBe('.jpg')
      })

      it.each([
        ['photo.heic', 'image/heic'],
        ['photo.heif', 'image/heif']
      ])('sharp error and %s upload returns converted buffer via heic-convert', async (filename, contentType) => {
        const heicOutput = Buffer.from('converted-jpg')
        heicConvert.mockResolvedValueOnce(heicOutput)
        const result = await addPhoto.convertImageType(
          Buffer.from('not-a-real-image'),
          makeUploadFile(filename, contentType)
        )
        expect(result.buffer).toEqual(heicOutput)
      })

      it.each([
        ['photo.heic', 'image/heic'],
        ['photo.heif', 'image/heif']
      ])('sharp error and %s upload calls heic-convert once', async (filename, contentType) => {
        heicConvert.mockResolvedValueOnce(Buffer.from('converted-jpg'))
        await addPhoto.convertImageType(
          Buffer.from('not-a-real-image'),
          makeUploadFile(filename, contentType)
        )
        expect(heicConvert).toHaveBeenCalledTimes(1)
      })

      it('sharp error and heicError throws INVALID_IMAGE', async () => {
        heicConvert.mockRejectedValueOnce(new Error('heic convert failed'))
        await expect(
          addPhoto.convertImageType(
            Buffer.from('not-a-real-image'),
            makeUploadFile('photo.heic', 'image/heic')
          )
        ).rejects.toMatchObject({ code: 'INVALID_IMAGE' })
      })

      it('sharp error and not heic upload throws error', async () => {
        await expect(
          addPhoto.convertImageType(
            Buffer.from('not-a-real-image'),
            makeUploadFile('photo.txt', 'text/plain')
          )
        ).rejects.toThrow('Invalid or unsupported image format')
      })

      it('throws INVALID_IMAGE code', async () => {
        await expect(
          addPhoto.convertImageType(
            Buffer.from('not-a-real-image'),
            makeUploadFile('photo.txt', 'text/plain')
          )
        ).rejects.toMatchObject({ code: 'INVALID_IMAGE' })
      })
    })

    describe('empty file', () => {
      it('should return correct error message if no file provided', async () => {
        const form = new FormData()
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 200)
        expect(response.result).toContain('Select a file')
      })

      it('should return correct error message if file missing original filename', async () => {
        const form = createForm('')
        form.append('fileUpload1', Buffer.from('data'), { filename: '' })
        const response = await submitPostRequest({
          url,
          payload: form.getBuffer(),
          headers: form.getHeaders()
        }, 200)
        expect(response.result).toContain('Select a file')
      })
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

    describe('file size', () => {
      it('creates an oversized image for reduction scenario', async () => {
        const oversizedResizableImage = await createNoiseImageBuffer({
          width: 2400,
          height: 2000,
          format: 'png'
        })
        expect(oversizedResizableImage.length).toBeGreaterThan(UPLOAD_MAX_BYTES)
      })

      it('reduces oversized image to jpg format', async () => {
        const oversizedResizableImage = await createNoiseImageBuffer({
          width: 2400,
          height: 2000,
          format: 'png'
        })
        const reducedImageResult = await addPhoto.convertImageSize(oversizedResizableImage, '.png')
        expect(reducedImageResult.extension).toBe('.jpg')
      })

      it('reduces oversized image to within upload limit', async () => {
        const oversizedResizableImage = await createNoiseImageBuffer({
          width: 2400,
          height: 2000,
          format: 'png'
        })
        const reducedImageResult = await addPhoto.convertImageSize(oversizedResizableImage, '.png')
        expect(reducedImageResult.buffer.length).toBeLessThanOrEqual(UPLOAD_MAX_BYTES)
      })

      it('should throw FILE_TOO_LARGE at max processing depth when still oversized', async () => {
        const oversizedBuffer = Buffer.alloc(UPLOAD_MAX_BYTES + 1)
        await expect(addPhoto.convertImageSize(oversizedBuffer, '.png', 5)).rejects.toMatchObject({
          code: 'FILE_TOO_LARGE'
        })
      })
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
