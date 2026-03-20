import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob'

const uploadContainerName = 'sir-media-uploads'

const getUploadContainerClient = async () => {
  if (getUploadContainerClient.cachedClient) {
    return getUploadContainerClient.cachedClient
  }

  const blobServiceUrl = process.env.AZURE_BLOB_SERVICE_URL
  const storageAccount = process.env.AZURE_STORAGE_ACCOUNT
  const storageAccessKey = process.env.AZURE_STORAGE_ACCESS_KEY

  if (!blobServiceUrl || !storageAccount || !storageAccessKey) {
    return null
  }

  const blobServiceClient = new BlobServiceClient(
    blobServiceUrl,
    new StorageSharedKeyCredential(storageAccount, storageAccessKey)
  )

  const containerClient = blobServiceClient.getContainerClient(uploadContainerName)
  await containerClient.createIfNotExists()
  getUploadContainerClient.cachedClient = containerClient

  return containerClient
}

export {
  getUploadContainerClient
}
