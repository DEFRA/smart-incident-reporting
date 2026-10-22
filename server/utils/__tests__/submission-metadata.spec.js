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

  it('captures the full parsed user agent', () => {
    expect(getSubmissionMetadata(request).userAgent).toEqual(expect.objectContaining({
      ua: chromeDesktopUserAgent,
      browser: expect.objectContaining({ name: 'Chrome', version: '140.0.0.0', major: '140' }),
      os: expect.objectContaining({ name: 'macOS', version: '10.15.7' }),
      device: expect.objectContaining({ type: undefined }),
      engine: expect.objectContaining({ name: 'Blink', version: '140.0.0.0' }),
      cpu: expect.any(Object)
    }))
  })

  it('identifies a mobile Safari device', () => {
    const mobileRequest = {
      ...request,
      headers: {
        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
      }
    }

    expect(getSubmissionMetadata(mobileRequest).userAgent).toEqual(expect.objectContaining({
      browser: expect.objectContaining({ name: 'Mobile Safari', version: '18.0' }),
      os: expect.objectContaining({ name: 'iOS', version: '18.0' }),
      device: expect.objectContaining({ type: 'mobile', vendor: 'Apple', model: 'iPhone' })
    }))
  })

  it('uses the first forwarded IP address', () => {
    const forwardedRequest = {
      ...request,
      headers: {
        ...request.headers,
        'x-forwarded-for': '203.0.113.10, 192.0.2.2'
      }
    }

    expect(getSubmissionMetadata(forwardedRequest).ipAddress).toEqual('203.0.113.10')
  })

  it('falls back to the connection IP address when no forwarded IP is present', () => {
    expect(getSubmissionMetadata(request).ipAddress).toEqual('192.0.2.1')
  })

  it('records JavaScript as on when the page marker is true', () => {
    const javascriptRequest = {
      ...request,
      payload: { javascriptEnabled: 'true' }
    }

    expect(getSubmissionMetadata(javascriptRequest).javascriptStatus).toEqual('on')
  })

  it.each(['false', undefined, true])('records JavaScript as off when the marker is %s', (javascriptEnabled) => {
    expect(getSubmissionMetadata({
      ...request,
      payload: { javascriptEnabled }
    }).javascriptStatus).toEqual('off')
  })

  it('records JavaScript as off when the payload is missing', () => {
    expect(getSubmissionMetadata({ headers: request.headers }).javascriptStatus).toEqual('off')
  })

  it('defaults to an empty user agent when the header is missing', () => {
    const noUserAgentRequest = {
      ...request,
      headers: {}
    }

    expect(getSubmissionMetadata(noUserAgentRequest).userAgent).toEqual(expect.objectContaining({
      ua: '',
      browser: expect.objectContaining({ name: undefined }),
      device: expect.objectContaining({ type: undefined })
    }))
  })
})
