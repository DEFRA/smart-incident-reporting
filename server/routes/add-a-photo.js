import constants from '../utils/constants.js'
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import fs from 'node:fs'
import path from 'node:path'
import dirname from '../../dirname.cjs'
import crypto from 'node:crypto'
import { getUploadContainerClient } from '../services/blob-storage.js'

const MAX_IMAGE_RESIZE_DEPTH = 5
const MAX_SELECTED_FILES = 5
const MIN_RESIZE_WIDTH = 320
const QUALITY_LEVELS = [80, 70, 60, 50, 40, 30]
const RESIZE_WIDTH_RATIO = 0.8
const PAYLOAD_MAX_BYTES = 10 * 1024 * 1024
const UPLOAD_MAX_BYTES = 4 * 1024 * 1024 // 4MB

export function streamToBuffer (stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

async function createThumbnail (filename) {
  try {
    const containerClient = await getUploadContainerClient()
    const blobClient = containerClient.getBlockBlobClient(filename)
    const imgBuf = await blobClient.downloadToBuffer()
    const thumbnail = await sharp(imgBuf)
      .resize({ width: 200 })
      .toBuffer()
    const [folder, file] = filename.split('/')
    const [name, ext] = file.split('.')

    const thumbName = `${name}-thumbnail.${ext}`
    const thumbBlobClient = containerClient.getBlockBlobClient(`${folder}/${thumbName}`)
    await thumbBlobClient.uploadData(thumbnail)

    const localUploadLocation = `${folder}-${thumbName}`

    const thumbDir = path.join(dirname, 'server/public/build/thumbnails')
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(thumbDir, localUploadLocation),
      thumbnail
    )

    return localUploadLocation
  } catch (err) {
    const newErr = new Error('Unexpected upload failure', { cause: err })
    newErr.code = 'UPLOAD_FAILED'
    throw newErr
  }
}

export async function convertImageType (fileBuffer, file) {
  // AI content checker allows: JPEG, PNG, GIF, BMP, TIFF, or WEBP
  try {
    const metadata = await sharp(fileBuffer).metadata()

    if (metadata.format === 'jpeg') {
      return { buffer: fileBuffer, extension: '.jpg' }
    }

    if (metadata.format === 'png') {
      return { buffer: fileBuffer, extension: '.png' }
    }

    if (metadata.hasAlpha) {
      const alphaConvertedBuffer = await sharp(fileBuffer).png().toBuffer()
      return { buffer: alphaConvertedBuffer, extension: '.png' }
    }

    const convertedBuffer = await sharp(fileBuffer).jpeg({ quality: 85 }).toBuffer()
    return { buffer: convertedBuffer, extension: '.jpg' }
  } catch (sharpError) {
    const filename = file?.hapi?.filename || ''
    const fileExtension = path.extname(filename).toLowerCase()
    const contentType = (file?.hapi?.headers?.['content-type'] || '').toLowerCase()
    const isHeicUpload = ['.heic', '.heif'].includes(fileExtension) || contentType.includes('heic') || contentType.includes('heif')

    if (isHeicUpload) {
      try {
        const convertedHeic = await heicConvert({
          buffer: fileBuffer,
          format: 'JPEG',
          quality: 0.85
        })

        const convertedBuffer = Buffer.isBuffer(convertedHeic)
          ? convertedHeic
          : Buffer.from(convertedHeic)

        return { buffer: convertedBuffer, extension: '.jpg' }
      } catch (heicError) {
        const invalidImageError = new Error('Invalid or unsupported image format', { cause: heicError })
        invalidImageError.code = 'INVALID_IMAGE'
        throw invalidImageError
      }
    }

    const err = new Error('Invalid or unsupported image format', { cause: sharpError })
    err.code = 'INVALID_IMAGE'
    throw err
  }
}

export async function convertImageSize (fileBuffer, extension, depth = 0) {
  if (fileBuffer.length <= UPLOAD_MAX_BYTES) {
    return { buffer: fileBuffer, extension }
  }

  if (depth >= MAX_IMAGE_RESIZE_DEPTH) {
    const err = new Error('Image file is too large after processing')
    err.code = 'FILE_TOO_LARGE'
    throw err
  }

  const tryJpegQuality = async (index) => {
    if (index >= QUALITY_LEVELS.length) {
      return null
    }

    const convertedBuffer = await sharp(fileBuffer)
      .jpeg({ quality: QUALITY_LEVELS[index] })
      .toBuffer()

    if (convertedBuffer.length <= UPLOAD_MAX_BYTES) {
      return { buffer: convertedBuffer, extension: '.jpg' }
    }

    return tryJpegQuality(index + 1)
  }

  const qualityResult = await tryJpegQuality(0)
  if (qualityResult) {
    return qualityResult
  }

  const metadata = await sharp(fileBuffer).metadata()
  if (!metadata.width || metadata.width <= MIN_RESIZE_WIDTH) {
    const fallbackBuffer = await sharp(fileBuffer).jpeg({ quality: 30 }).toBuffer()

    if (fallbackBuffer.length > UPLOAD_MAX_BYTES) {
      const err = new Error('Image file is too large after processing')
      err.code = 'FILE_TOO_LARGE'
      throw err
    }

    return { buffer: fallbackBuffer, extension: '.jpg' }
  }

  const resizedBuffer = await sharp(fileBuffer)
    .resize({
      width: Math.max(MIN_RESIZE_WIDTH, Math.floor(metadata.width * RESIZE_WIDTH_RATIO)),
      withoutEnlargement: true
    })
    .jpeg({ quality: 30 })
    .toBuffer()

  return convertImageSize(resizedBuffer, '.jpg', depth + 1)
}

async function handleFileUpload (request, uploadId) {
  const file = request.payload.fileUpload1

  if (!file) {
    const err = new Error('No file provided')
    err.code = 'NO_FILE'
    throw err
  }

  if (!file.hapi?.filename) {
    const err = new Error('Missing original filename')
    err.code = 'NO_FILE'
    throw err
  }

  const fileBuffer = await streamToBuffer(file)
  const { buffer: uploadBuffer, extension } = await convertImageType(fileBuffer, file)
  const { buffer: maxSizedBuffer, extension: maxSizedExtension } = await convertImageSize(uploadBuffer, extension)

  const originalName = path.parse(file.hapi.filename).name || 'upload'
  const finalFilename = `${uploadId}/${originalName}${maxSizedExtension}`
  const containerClient = await getUploadContainerClient()

  await containerClient
    .getBlockBlobClient(finalFilename)
    .uploadData(maxSizedBuffer)

  return finalFilename
}

const handlers = {
  get: (request, h) => {
    if (!request.yar.get('upload-id')) {
      request.yar.set('upload-id', crypto.randomUUID())
    }

    return h.view(constants.views.ADD_A_PHOTO, {
      maxSelectedFiles: false
    })
  },

  post: async (request, h) => {
    const uploadId = request.yar.get('upload-id')
    const thumbnails = request.yar.get('thumbnails') || []

    if (thumbnails.length >= MAX_SELECTED_FILES) {
      return h.view(constants.views.ADD_A_PHOTO, {
        maxSelectedFiles: true
      })
    }

    try {
      const finalFilename = await handleFileUpload(request, uploadId)
      const fileLoc = await createThumbnail(finalFilename)

      const thumbLoc = `/public/thumbnails/${fileLoc}`
      thumbnails.push({ finalFilename, thumbLoc })

      request.yar.set('thumbnails', thumbnails)

      return h.redirect(constants.routes.YOUR_PHOTOS)
    } catch (err) {
      console.log('Upload error:', err)
      switch (err.code) {
        case 'NO_FILE':
          return h.view(constants.views.ADD_A_PHOTO, {
            maxSelectedFiles: false,
            errorMessage: 'Select a file'
          })

        case 'INVALID_IMAGE':
          return h.view(constants.views.ADD_A_PHOTO, {
            maxSelectedFiles: false,
            errorMessage: 'Select a file in a different image format, for example JPEG or PNG'
          })

        case 'FILE_TOO_LARGE':
          return h.view(constants.views.ADD_A_PHOTO, {
            maxSelectedFiles: false,
            errorMessage: 'The selected file must be smaller than 4MB'
          })

        default:
          return h.view(constants.views.ADD_A_PHOTO, {
            maxSelectedFiles: false,
            errorMessage: 'The selected file could not be uploaded – try again'
          })
      }
    }
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.ADD_A_PHOTO,
    handler: handlers.get,
    options: { auth: false }
  },
  {
    method: 'POST',
    path: constants.routes.ADD_A_PHOTO,
    handler: handlers.post,
    options: {
      auth: false,
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        allow: 'multipart/form-data',
        maxBytes: PAYLOAD_MAX_BYTES
      }
    }
  }
]
