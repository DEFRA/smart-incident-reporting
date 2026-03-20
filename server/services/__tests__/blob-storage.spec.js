import { BlobServiceClient } from '@azure/storage-blob'
import { getUploadContainerClient } from '../blob-storage.js'

jest.mock('@azure/storage-blob', () => ({
  BlobServiceClient: jest.fn(),
  StorageSharedKeyCredential: jest.fn()
}))

describe('blob-storage', () => {
  const setupConfiguredClient = async () => {
    process.env.AZURE_BLOB_SERVICE_URL = 'https://blob-storage-url'
    process.env.AZURE_STORAGE_ACCOUNT = 'test-account'
    process.env.AZURE_STORAGE_ACCESS_KEY = 'test-key'

    const createIfNotExists = jest.fn().mockResolvedValue(undefined)
    const containerClient = { createIfNotExists }

    BlobServiceClient.mockImplementation(() => ({
      getContainerClient: jest.fn().mockReturnValue(containerClient)
    }))

    const firstResult = await getUploadContainerClient()
    const secondResult = await getUploadContainerClient()

    return {
      firstResult,
      secondResult,
      createIfNotExists,
      containerClient
    }
  }

  beforeEach(() => {
    delete getUploadContainerClient.cachedClient
    jest.clearAllMocks()
  })

  it('returns null when blob env vars are missing', async () => {
    const blobUrl = process.env.AZURE_BLOB_SERVICE_URL
    const sorageAccount = process.env.AZURE_STORAGE_ACCOUNT
    const accessKey = process.env.AZURE_STORAGE_ACCESS_KEY

    delete process.env.AZURE_BLOB_SERVICE_URL
    delete process.env.AZURE_STORAGE_ACCOUNT
    delete process.env.AZURE_STORAGE_ACCESS_KEY

    const result = await getUploadContainerClient()
    expect(result).toBeNull()

    process.env.AZURE_BLOB_SERVICE_URL = blobUrl
    process.env.AZURE_STORAGE_ACCOUNT = sorageAccount
    process.env.AZURE_STORAGE_ACCESS_KEY = accessKey
  })

  it('returns container client on first call', async () => {
    const { firstResult, containerClient } = await setupConfiguredClient()
    expect(firstResult).toBe(containerClient)
  })

  it('returns cached container client on second call', async () => {
    const { secondResult, containerClient } = await setupConfiguredClient()
    expect(secondResult).toBe(containerClient)
  })

  it('creates container once when using cached client', async () => {
    const { createIfNotExists } = await setupConfiguredClient()
    expect(createIfNotExists).toHaveBeenCalledTimes(1)
  })

  it('instantiates BlobServiceClient once when using cached client', async () => {
    await setupConfiguredClient()
    expect(BlobServiceClient).toHaveBeenCalledTimes(1)
  })
})
