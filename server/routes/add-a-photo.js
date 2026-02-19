import constants from '../utils/constants.js'
import formidable from 'formidable'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { PassThrough } from 'node:stream'
import sharp from 'sharp'
import fs from 'node:fs'
import dirname from '../../dirname.cjs'
import path from 'node:path'

const containerName = 'sir-media-uploads'

async function initContainerClient() {
  if (!initContainerClient.cachedClient) {
    console.log('Creating Blob service client')
    const myBlob = new BlobServiceClient(
      process.env.AZURE_BLOB_SERVICE_URL,
      new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_ACCOUNT,
        process.env.AZURE_STORAGE_ACCESS_KEY
      )
    )
    console.log('Creating container client')
    initContainerClient.cachedClient = myBlob.getContainerClient(containerName)
    await initContainerClient.cachedClient.createIfNotExists()
  }
  return initContainerClient.cachedClient
}

// TODO: TTLs on thumbnails? https://www.npmjs.com/package/find-remove

async function createThumbnail(filename) {
  const containerClient = await initContainerClient()
  const blobClient = containerClient.getBlockBlobClient(filename)
  const imgBuf = await blobClient.downloadToBuffer()
  const thumbnail = await sharp(imgBuf).resize({ width: 200 }).toBuffer()

  const fileLocBits = filename.split('/')
  if (fileLocBits.length !== 2) {
    throw new Error(`createThumbnail: Unexpected filename format: ${filename}`)
  }
  const [folder, file] = fileLocBits
  const imgNameBits = file.split('.')
  if (imgNameBits.length !== 2) {
    throw new Error(`createThumbnail: Unexpected file name format: ${file}`)
  }
  const thumbName = `${imgNameBits[0]}-thumbnail.${imgNameBits[1]}`
  const thumbnailBlobClient = containerClient.getBlockBlobClient(`${folder}/${thumbName}`)
  await thumbnailBlobClient.uploadData(thumbnail)

  const localUploadLocation = `${folder}-${thumbName}`
  const thumbDir = path.join(dirname, 'server/public/build/thumbnails')
  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir, { recursive: true })
  }
  const thumbLocation = path.join(thumbDir, localUploadLocation)
  console.log(`Moving thumbnail to ${thumbLocation}`)
  fs.writeFileSync(thumbLocation, thumbnail)

  return localUploadLocation
}

async function handleFileUpload(request, uploadId) {
  const containerClient = await initContainerClient()
  return new Promise((resolve, reject) => {
    const state = { finalFilename: null, uploadPromise: null }
    const form = formidable({
      fileWriteStreamHandler: (file) => {
        const stream = new PassThrough()
          // Debug: log session and yar state
          try {
            console.log('handleFileUpload: request.yar keys:', Object.keys(request.yar && request.yar._store ? request.yar._store : {}))
          } catch (e) {
            console.log('handleFileUpload: could not read request.yar._store', e)
          }
          console.log('handleFileUpload: uploadId:', uploadId)
          console.log('handleFileUpload: file object:', file)
          if (!uploadId || !file.originalFilename) {
            console.error('handleFileUpload: uploadId or file.originalFilename missing', { uploadId, originalFilename: file.originalFilename })
            throw new Error('Upload ID or file name missing, cannot save file.')
          }
        state.finalFilename = `${uploadId}/${file.originalFilename}`
        const blockBlobClient = containerClient.getBlockBlobClient(state.finalFilename)
        state.uploadPromise = blockBlobClient.uploadStream(stream)
        state.uploadPromise.then(() => {
          request.yar.set('upload-location', state.finalFilename)
        })
        return stream
      }
    })

    form.parse(request.raw.req, async (error, fields, files) => {
      if (error) {
        reject(error)
        return
      }
      // Check if any file was uploaded
      const fileStreams = Object.values(files)
      if (!fileStreams.length || !fileStreams[0]) {
        reject(new Error('No file selected. Please upload a photo.'))
        return
      }
      const fileStream = Array.isArray(fileStreams[0]) ? fileStreams[0][0] : fileStreams[0]
      if (!fileStream || !fileStream.originalFilename) {
        reject(new Error('No file selected. Please upload a photo.'))
        return
      }
      if (!state.finalFilename || !state.uploadPromise) {
        reject(new Error('File upload failed to initialize.'))
        return
      }
      try {
        await state.uploadPromise
        resolve(state.finalFilename)
      } catch (err) {
        reject(err)
      }
    })
  })
}

const handlers = {
  get: (_request, h) => h.view(constants.views.ADD_A_PHOTO),
  post: async (request, h) => {
    await initContainerClient()
    const uploadId = request.yar.get('upload-id')
    const uploadedFilename = await handleFileUpload(request, uploadId)
    console.log(uploadedFilename)
    console.log('SO FORM AND BLOB DONE, NOW CREATE THUMBNAIL')
    try {
      const fileLoc = await createThumbnail(uploadedFilename)
      const thumbLoc = `/public/thumbnails/${fileLoc}`
      console.log(`Setting thumbnail location to session: ${thumbLoc}`)
      request.yar.set('thumbnail-location', thumbLoc)
      return h.redirect(constants.routes.YOUR_PHOTOS)
    } catch (err) {
      console.error('Thumbnail creation failed:', err)
      return h.response('Thumbnail creation failed').code(500)
    }
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.ADD_A_PHOTO,
    handler: handlers.get,
    options: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: constants.routes.ADD_A_PHOTO,
    handler: handlers.post,
    options: {
      payload: {
        maxBytes: 10 * 1024 * 1024,
        timeout: false,
        output: 'stream',
        parse: false,
        allow: 'multipart/form-data',
        failAction: (request, h, err) => {
          if (err.output.statusCode === 413) {
            console.log('FILE TOO BIG!!')
          }
          throw err
        }
      },
      auth: false
    }
  }
]