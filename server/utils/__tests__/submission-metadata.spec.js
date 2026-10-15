import { getSubmissionMetadata } from '../submission-metadata.js'

describe('getSubmissionMetadata', () => {
  const chromeDesktopUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
  const request = {
    headers: {
      'user-agent': chromeDesktopUserAgent
    },
    info: {
      remoteAddress: '192.0.2.1'
    },
    payload: {}
  }

  it('captures the remote IP address, browser, device and disabled JavaScript status', () => {
    expect(getSubmissionMetadata(request)).toEqual({
      ipAddress: '192.0.2.1',
      browserType: 'Chrome',
      deviceType: 'laptop',
      javascriptStatus: 'off'
    })
  })

  it('identifies a mobile Safari device', () => {
    const mobileRequest = {
      ...request,
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
      }
    }

    expect(getSubmissionMetadata(mobileRequest)).toEqual(expect.objectContaining({
      browserType: 'Mobile Safari',
      deviceType: 'mobile'
    }))
  })

  it('uses the originating forwarded IP address', () => {
    const forwardedRequest = {
      ...request,
      headers: {
        ...request.headers,
        'x-forwarded-for': '203.0.113.10, 192.0.2.2'
      }
    }

    expect(getSubmissionMetadata(forwardedRequest).ipAddress).toEqual('203.0.113.10')
  })

  it('records JavaScript as on when the page marker is posted', () => {
    const javascriptRequest = {
      ...request,
      payload: { javascriptEnabled: 'true' }
    }

    expect(getSubmissionMetadata(javascriptRequest).javascriptStatus).toEqual('on')
  })

  it('records JavaScript as on when captcha was completed earlier', () => {
    expect(getSubmissionMetadata(request, true).javascriptStatus).toEqual('on')
  })

  it('defaults to an empty user agent when the header is missing', () => {
    const noUserAgentRequest = {
      ...request,
      headers: {}
    }

    expect(getSubmissionMetadata(noUserAgentRequest)).toEqual(expect.objectContaining({
      browserType: 'Unknown',
      deviceType: 'laptop'
    }))
  })
})
