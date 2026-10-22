import { UAParser } from 'ua-parser-js'

const getSubmissionMetadata = (request) => {
  const forwardedFor = request.headers['x-forwarded-for']
  const ipAddress = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : request.info.remoteAddress
  const userAgent = request.headers['user-agent'] || ''

  return {
    ipAddress,
    javascriptStatus: request.payload?.javascriptEnabled === 'true' ? 'on' : 'off',
    userAgent: UAParser(userAgent)
  }
}

export { getSubmissionMetadata }
