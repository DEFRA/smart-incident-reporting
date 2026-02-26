import constants from '../utils/constants.js'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import dirname from '../../dirname.cjs'
import crypto from 'node:crypto'

const MAX_SELECTED_FILES = 5
const UPLOAD_MAX_BYTES = 10 * 1024 * 1024
const PAYLOAD_MAX_BYTES = 12 * 1024 * 1024
const containerName = 'sir-media-uploads'

async function initContainerClient () {
  if (!initContainerClient.cachedClient) {
    const blobServiceClient = new BlobServiceClient(
      process.env.AZURE_BLOB_SERVICE_URL,
      new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_ACCOUNT,
        process.env.AZURE_STORAGE_ACCESS_KEY
      )
    )

    const containerClient = blobServiceClient.getContainerClient(containerName)
    await containerClient.createIfNotExists()
    initContainerClient.cachedClient = containerClient
  }

  return initContainerClient.cachedClient
}

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
    const containerClient = await initContainerClient()
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
  if (fileBuffer.length > UPLOAD_MAX_BYTES) {
    const err = new Error('File too large')
    err.code = 'FILE_TOO_LARGE'
    throw err
  }

  try {
    await sharp(fileBuffer).metadata()
  } catch {
    // CONVERT IMAGE TYPE REMOVE ERROR
  }

  const finalFilename = `${uploadId}/${file.hapi.filename}`
  const containerClient = await initContainerClient()

  await containerClient
    .getBlockBlobClient(finalFilename)
    .uploadData(fileBuffer)

  return finalFilename
}

const handlers = {
  get: (request, h) => {
    if (!request.yar.get('upload-id')) {
      request.yar.set('upload-id', crypto.randomUUID())
    }

    return h.view(constants.views.ADD_A_PHOTO)
  },

  post: async (request, h) => {
    const uploadId = request.yar.get('upload-id')
    const thumbnails = request.yar.get('thumbnails') || []

    if (thumbnails.length >= MAX_SELECTED_FILES) {
      return h.view(constants.views.ADD_A_PHOTO, {
        errorMessage: 'You can only select up to 5 files at the same time.'
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
            errorMessage: 'Select a file.'
          })

        case 'FILE_TOO_LARGE':
          return h.view(constants.views.ADD_A_PHOTO, {
            errorMessage: 'The selected file must be smaller than 10MB.'
          })

        default:
          return h.view(constants.views.ADD_A_PHOTO, {
            errorMessage: 'The selected file could not be uploaded – try again.'
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
        maxBytes: PAYLOAD_MAX_BYTES,
        output: 'stream',
        parse: true,
        multipart: true,
        allow: 'multipart/form-data'
      }
    }
  }
]
