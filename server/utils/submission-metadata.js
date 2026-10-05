import { UAParser } from 'ua-parser-js'

const getSubmissionMetadata = (request, friendlyCaptchaCompleted = false) => {
  const forwardedFor = request.headers['x-forwarded-for']
  const ipAddress = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : request.info.remoteAddress
  const userAgent = request.headers['user-agent'] || ''
  const parsedUserAgent = UAParser(userAgent)

  return {
    ipAddress,
    browserType: parsedUserAgent.browser.name || 'Unknown',
    deviceType: parsedUserAgent.device.type || 'laptop',
    javascriptStatus: friendlyCaptchaCompleted || request.payload?.javascriptEnabled === 'true' ? 'on' : 'off'
  }
}

export { getSubmissionMetadata }
