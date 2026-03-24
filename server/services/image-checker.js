import ContentSafetyClient, { isUnexpected } from '@azure-rest/ai-content-safety'
import { AzureKeyCredential } from '@azure/core-auth'
import { getUploadContainerClient } from './blob-storage.js'

const contentSafetyApiVersion = '2023-10-01'

const getContentSafetyConfig = () => ({
  endpoint: process.env.CONTENT_SAFETY_ENDPOINT,
  key: process.env.CONTENT_SAFETY_KEY
})

const getContentSafetyClient = () => {
  const { endpoint, key } = getContentSafetyConfig()

  if (!endpoint || !key) {
    return null
  }

  return ContentSafetyClient(endpoint, new AzureKeyCredential(key), {
    apiVersion: contentSafetyApiVersion
  })
}

const validateSingleImage = async (containerClient, finalFilename, contentSafetyClient) => {
  const imageBuffer = await containerClient.getBlobClient(finalFilename).downloadToBuffer()

  const result = await contentSafetyClient.path('/image:analyze').post({
    body: {
      image: {
        content: imageBuffer.toString('base64')
      }
    }
  })

  if (isUnexpected(result)) {
    throw new Error('Unexpected response from Azure Content Safety API')
  }

  const categories = result.body?.categoriesAnalysis || []
  const scores = categories.map(({ category, severity }) => `${category}:${severity}`).join(', ')
  console.log(`Content Safety severity scores for ${finalFilename}: ${scores || 'none'}`)

  return result.body
}

const validate = async (thumbnails = []) => {
  const contentSafetyClient = getContentSafetyClient()

  if (!contentSafetyClient || thumbnails.length === 0) {
    return { success: true, skipped: true }
  }

  try {
    const containerClient = await getUploadContainerClient()

    if (!containerClient) {
      return { success: true, skipped: true }
    }

    const response = await Promise.all(
      thumbnails.map(({ finalFilename }) => validateSingleImage(containerClient, finalFilename, contentSafetyClient))
    )

    return {
      success: true,
      skipped: false,
      response
    }
  } catch (error) {
    // Do not block the journey if the checker API is unavailable.
    console.log('Error: failed to validate images against Azure Content Safety API')
    console.log(error)
    return { success: true, skipped: false }
  }
}

export default {
  validate
}
