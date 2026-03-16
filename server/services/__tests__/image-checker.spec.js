import imageChecker from '../image-checker.js'
import * as blobStorage from '../blob-storage.js'
import ContentSafetyClient, { isUnexpected } from '@azure-rest/ai-content-safety'
import { AzureKeyCredential } from '@azure/core-auth'

jest.mock('../blob-storage.js', () => ({
  getUploadContainerClient: jest.fn()
}))

jest.mock('@azure-rest/ai-content-safety', () => ({
  __esModule: true,
  default: jest.fn(),
  isUnexpected: jest.fn()
}))

jest.mock('@azure/core-auth', () => ({
  AzureKeyCredential: jest.fn()
}))

describe('image-checker', () => {
  const setupSuccessfulValidation = async () => {
    const mockPost = jest.fn().mockResolvedValue({ body: { status: 'ok' } })
    const mockPath = jest.fn().mockReturnValue({ post: mockPost })

    const imageBuffer = Buffer.from('image-data')
    const downloadToBuffer = jest.fn().mockResolvedValue(imageBuffer)
    const getBlobClient = jest.fn().mockReturnValue({ downloadToBuffer })

    ContentSafetyClient.mockReturnValue({ path: mockPath })
    isUnexpected.mockReturnValue(false)
    blobStorage.getUploadContainerClient.mockResolvedValue({ getBlobClient })

    const result = await imageChecker.validate([
      { finalFilename: 'upload-id/photo1.jpg' },
      { finalFilename: 'upload-id/photo2.jpg' }
    ])

    return {
      result,
      getBlobClient,
      imageBuffer,
      mockPath,
      mockPost
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    process.env.CONTENT_SAFETY_ENDPOINT = 'https://example.cognitiveservices.azure.com/'
    process.env.CONTENT_SAFETY_KEY = 'test-content-safety-key'
  })

  it.each([
    {
      label: 'none',
      categoriesAnalysis: [],
      expectedLog: 'Content Safety severity scores for upload-id/photo1.jpg: none'
    },
    {
      label: 'hate',
      categoriesAnalysis: [{ category: 'hate', severity: 2 }],
      expectedLog: 'Content Safety severity scores for upload-id/photo1.jpg: hate:2'
    },
    {
      label: 'sexual',
      categoriesAnalysis: [{ category: 'sexual', severity: 1 }],
      expectedLog: 'Content Safety severity scores for upload-id/photo1.jpg: sexual:1'
    },
    {
      label: 'violence',
      categoriesAnalysis: [{ category: 'violence', severity: 3 }],
      expectedLog: 'Content Safety severity scores for upload-id/photo1.jpg: violence:3'
    },
    {
      label: 'self harm',
      categoriesAnalysis: [{ category: 'self harm', severity: 4 }],
      expectedLog: 'Content Safety severity scores for upload-id/photo1.jpg: self harm:4'
    },
    {
      label: 'mixed categories',
      categoriesAnalysis: [
        { category: 'hate', severity: 2 },
        { category: 'sexual', severity: 1 },
        { category: 'violence', severity: 3 },
        { category: 'self harm', severity: 4 }
      ],
      expectedLog: 'Content Safety severity scores for upload-id/photo1.jpg: hate:2, sexual:1, violence:3, self harm:4'
    }
  ])('logs severity scores for $label', async ({ categoriesAnalysis, expectedLog }) => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const mockPost = jest.fn().mockResolvedValue({ body: { categoriesAnalysis } })
    const mockPath = jest.fn().mockReturnValue({ post: mockPost })
    const downloadToBuffer = jest.fn().mockResolvedValue(Buffer.from('image-data'))
    const getBlobClient = jest.fn().mockReturnValue({ downloadToBuffer })

    ContentSafetyClient.mockReturnValue({ path: mockPath })
    isUnexpected.mockReturnValue(false)
    blobStorage.getUploadContainerClient.mockResolvedValue({ getBlobClient })

    await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(consoleSpy).toHaveBeenCalledWith(expectedLog)
  })

  it('returns skipped result when no thumbnails are supplied', async () => {
    const result = await imageChecker.validate([])

    expect(result).toEqual({ success: true, skipped: true })
  })

  it('returns skipped result when thumbnails argument is omitted', async () => {
    const result = await imageChecker.validate()

    expect(result).toEqual({ success: true, skipped: true })
  })

  it('does not call post when no thumbnails are supplied', async () => {
    await imageChecker.validate([])

    expect(ContentSafetyClient).toHaveBeenCalledTimes(1)
  })

  it('returns skipped result when blob container client is unavailable', async () => {
    blobStorage.getUploadContainerClient.mockResolvedValue(null)

    const result = await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(result).toEqual({ success: true, skipped: true })
  })

  it.each([
    {
      label: 'endpoint is missing',
      endpoint: '',
      key: 'test-content-safety-key'
    },
    {
      label: 'key is missing',
      endpoint: 'https://example.cognitiveservices.azure.com/',
      key: ''
    }
  ])('returns skipped result when content safety config is incomplete: $label', async ({ endpoint, key }) => {
    process.env.CONTENT_SAFETY_ENDPOINT = endpoint
    process.env.CONTENT_SAFETY_KEY = key

    const result = await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(result).toEqual({ success: true, skipped: true })
  })

  it.each([
    {
      label: 'endpoint is missing',
      endpoint: '',
      key: 'test-content-safety-key'
    },
    {
      label: 'key is missing',
      endpoint: 'https://example.cognitiveservices.azure.com/',
      key: ''
    }
  ])('does not create content safety client when config is incomplete: $label', async ({ endpoint, key }) => {
    process.env.CONTENT_SAFETY_ENDPOINT = endpoint
    process.env.CONTENT_SAFETY_KEY = key

    await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(ContentSafetyClient).not.toHaveBeenCalled()
  })

  it.each([
    {
      label: 'endpoint is missing',
      endpoint: '',
      key: 'test-content-safety-key'
    },
    {
      label: 'key is missing',
      endpoint: 'https://example.cognitiveservices.azure.com/',
      key: ''
    }
  ])('does not fetch blob container when config is incomplete: $label', async ({ endpoint, key }) => {
    process.env.CONTENT_SAFETY_ENDPOINT = endpoint
    process.env.CONTENT_SAFETY_KEY = key

    await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(blobStorage.getUploadContainerClient).not.toHaveBeenCalled()
  })

  it('does not call post when blob container client is unavailable', async () => {
    blobStorage.getUploadContainerClient.mockResolvedValue(null)
    isUnexpected.mockReturnValue(false)
    ContentSafetyClient.mockReturnValue({ path: jest.fn() })

    await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(blobStorage.getUploadContainerClient).toHaveBeenCalledTimes(1)
  })

  it('sets result success true when validation succeeds', async () => {
    const { result } = await setupSuccessfulValidation()
    expect(result.success).toBe(true)
  })

  it('sets result skipped false when validation succeeds', async () => {
    const { result } = await setupSuccessfulValidation()
    expect(result.skipped).toBe(false)
  })

  it('requests blob client for each thumbnail', async () => {
    const { getBlobClient } = await setupSuccessfulValidation()
    expect(getBlobClient).toHaveBeenCalledTimes(2)
  })

  it('calls content safety post for each thumbnail', async () => {
    const { mockPost } = await setupSuccessfulValidation()
    expect(mockPost).toHaveBeenCalledTimes(2)
  })

  it('calls the expected content safety endpoint path', async () => {
    const { mockPath } = await setupSuccessfulValidation()
    expect(mockPath).toHaveBeenCalledWith('/image:analyze')
  })

  it('passes content safety api key header', async () => {
    await setupSuccessfulValidation()
    expect(AzureKeyCredential).toHaveBeenCalledWith('test-content-safety-key')
  })

  it('sends base64 image content payload', async () => {
    const { mockPost, imageBuffer } = await setupSuccessfulValidation()
    const requestOptions = mockPost.mock.calls[0][0]

    expect(requestOptions.body.image.content).toBe(imageBuffer.toString('base64'))
  })

  it('returns success when content safety post throws', async () => {
    const mockPost = jest.fn().mockRejectedValue(new Error('service unavailable'))
    const mockPath = jest.fn().mockReturnValue({ post: mockPost })
    const downloadToBuffer = jest.fn().mockResolvedValue(Buffer.from('image-data'))
    const getBlobClient = jest.fn().mockReturnValue({ downloadToBuffer })

    ContentSafetyClient.mockReturnValue({ path: mockPath })
    isUnexpected.mockReturnValue(false)
    blobStorage.getUploadContainerClient.mockResolvedValue({ getBlobClient })

    const result = await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(result).toEqual({ success: true, skipped: false })
  })

  it('returns success when content safety returns unexpected response', async () => {
    const mockPost = jest.fn().mockResolvedValue({ body: { error: 'bad request' } })
    const mockPath = jest.fn().mockReturnValue({ post: mockPost })
    const downloadToBuffer = jest.fn().mockResolvedValue(Buffer.from('image-data'))
    const getBlobClient = jest.fn().mockReturnValue({ downloadToBuffer })

    ContentSafetyClient.mockReturnValue({ path: mockPath })
    isUnexpected.mockReturnValue(true)
    blobStorage.getUploadContainerClient.mockResolvedValue({ getBlobClient })

    const result = await imageChecker.validate([{ finalFilename: 'upload-id/photo1.jpg' }])

    expect(result).toEqual({ success: true, skipped: false })
  })
})
