import { UAParser } from 'ua-parser-js'

const getSubmissionMetadata = (request) => {
  const userAgent = request.headers['user-agent'] || ''

  return {
    javascriptStatus: request.payload?.javascriptEnabled === 'true' ? 'on' : 'off',
    userAgent: UAParser(userAgent)
  }
}

export { getSubmissionMetadata }
