import constants from '../utils/constants.js'
import formidable from 'formidable'
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { PassThrough } from 'node:stream'
import imageThumbnail from 'image-thumbnail'
import fs from 'node:fs'
import dirname from '../../dirname.cjs'

console.log('Creating Blob service client')
const myBlob = new BlobServiceClient(
  process.env.AZURE_BLOB_SERVICE_URL,
  new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT,
    process.env.AZURE_STORAGE_ACCESS_KEY
  )
)

let filename
const containerName = 'media-upload-tests'
console.log('Creating container client')
const containerClient = await myBlob.getContainerClient(containerName)
await containerClient.createIfNotExists()

// TODO: TTLs on thumbnails? https://www.npmjs.com/package/find-remove
// TODO: consider https://www.npmjs.com/package/sharp

async function createThumbnail (filename) {
  try {
    const jjj = containerClient.getBlockBlobClient(filename)
    const imgBuf = await jjj.downloadToBuffer()
    const thumbnail = await imageThumbnail(imgBuf)

    const fileLocBits = filename.split('/')
    const folder = fileLocBits[0]
    const imgNameBits = fileLocBits[1].split('.')
    const thumbName = `${imgNameBits[0]}-thumbnail.${imgNameBits[1]}`

    console.log(folder)
    console.log(thumbName)

    const blockBlobClient = containerClient.getBlockBlobClient(`${folder}/${thumbName}`)
    await blockBlobClient.uploadData(thumbnail)

    const localUploadLocation = `${folder}-${thumbName}`
    const thumbLocation = `${dirname}/server/public/build/thumbnails/${localUploadLocation}`
    console.log(`Moving thumbnail to ${thumbLocation}`)
    fs.writeFileSync(thumbLocation, thumbnail)

    // const tags = await jjj.getTags()
    // console.log(tags)

    return localUploadLocation
  } catch (error) {
    console.log(error)
  }
}

function handleFileUpload (request, uploadId) {
  return new Promise((resolve, reject) => {
    filename = uploadId
    let blockBlobClient
    let qqq

    const form = formidable({
      fileWriteStreamHandler: (file) => {
        const stream = new PassThrough()
        console.log('Creating block blob client')
        filename = `${filename}/${file.originalFilename}`
        blockBlobClient = containerClient.getBlockBlobClient(filename)
        qqq = blockBlobClient.uploadStream(stream)
        qqq.then((res) => {
          console.log('BLOB CREATED')
          request.yar.set('upload-location', filename)
        })

        return stream
      }
    })

    form.parse(request.raw.req, async (error) => {
      if (error) {
        reject(error)
        return
      }
      await qqq
      resolve('HELLO, I have resolved!')
    })
  })
}

const handlers = {
  get: (request, h) => {
    console.log('HERE GET!!')
    return h.view(constants.views.FILE_UPLOAD)
  },
  post: async (request, h) => {
    console.log('HERE POST!!')
    const uploadId = request.yar.get('upload-id')
    const qqq = await handleFileUpload(request, uploadId)
    console.log(qqq)
    console.log('SO FORM AND BLOB DONE, NOW CREATE THUMBNAIL')
    const fileLoc = await createThumbnail(filename)
    const thumbLoc = `/public/thumbnails/${fileLoc}`
    console.log(`Setting thumbnail location to session: ${thumbLoc}`)
    request.yar.set('thumbnail-location', thumbLoc)
    return h.redirect(constants.routes.FILE_THUMB)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.FILE_UPLOAD,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.FILE_UPLOAD,
    handler: handlers.post,
    options: {
      // FIXME: work out what of the below I actually need
      payload: {
        maxBytes: 10 * 1024 * 1024,
        // multipart: true, // Possibly not if using formidable
        timeout: false, // Yes
        output: 'stream', // Yes
        parse: false, // Yes
        allow: 'multipart/form-data', // Yes
        failAction: (request, h, err) => {
          if (err.output.statusCode === 413) { // Request entity too large
            console.log('FILE TOO BIG!!')
          }

          throw err
        }
      }
    }
  }
]
