import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.COOKIES

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Cookies on the Report an environmental problem service')
      expect(response.headers['content-security-policy']).toContain("script-src 'self' 'nonce-")
      expect(response.payload).toMatch(/<script type="module" nonce="[^"]+">/)
      expect(response.payload).toContain('<form action="/cookies" method="post"')
      expect(response.payload).toContain('name="analytics"')
    })

    it(`Should show the correct service name and link for an overarching service page on ${url}`, async () => {
      process.env.REGISTER_START_ROUTES = 'false'
      const response = await submitGetRequest({ url })
      const html = parse(response.payload)
      const serviceNameLink = html.querySelector('.govuk-service-navigation__link')
      expect(html.querySelector('.govuk-service-navigation__service-name').textContent).toContain(constants.serviceNames.DEFAULT)
      expect(serviceNameLink.getAttribute('href')).toBe(constants.urls.GOV_UK_SERVICE_HOME)
      process.env.REGISTER_START_ROUTES = 'true'
    })
  })

  describe('POST', () => {
    it('stores an accepted analytics preference and redirects back to the supplied page', async () => {
      const response = await submitPostRequest({
        url,
        payload: {
          analytics: 'true',
          returnUrl: '/home'
        }
      })

      expect(response.headers.location).toBe('/home')
      expect(response.headers['set-cookie'].join(';')).toContain('cookies_settings')
    })

    it('rejects an invalid analytics preference', async () => {
      await submitPostRequest({
        url,
        payload: {
          analytics: 'maybe',
          returnUrl: ''
        }
      }, 400)
    })

    it('redirects to the preferences page when no return page is supplied', async () => {
      const response = await submitPostRequest({
        url,
        payload: {
          analytics: 'false',
          returnUrl: ''
        }
      })

      expect(response.headers.location).toBe('/cookies?updated=true')
    })
  })
})
