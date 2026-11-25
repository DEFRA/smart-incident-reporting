import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { parse } from 'node-html-parser'
import { getServer } from '../../../.jest/setup.js'

const url = constants.routes.COOKIES
const encodeCookie = value => Buffer.from(encodeURIComponent(value)).toString('base64')

describe(url, () => {
  describe('GET', () => {
    it('remembers the journey page across cookie saves and updates it on re-entry', async () => {
      const server = getServer()
      const headers = { host: 'service.test', referer: 'http://service.test/smell/source?step=1' }
      const first = await server.inject({ method: 'GET', url, headers })
      const sessionCookie = first.headers['set-cookie'].find(cookie => cookie.startsWith('session=')).split(';')[0]
      const link = response => parse(response.payload).querySelector('#successBanner a').getAttribute('href')

      expect(link(first)).toBe('/smell/source?step=1')
      const saved = await server.inject({
        method: 'POST',
        url,
        headers: { host: 'service.test', cookie: sessionCookie },
        payload: { cookieConsent: 'No' }
      })
      expect(saved.headers.location).toBe('/cookies?updated=true')
      const confirmation = await server.inject({
        method: 'GET',
        url: saved.headers.location,
        headers: { host: 'service.test', cookie: sessionCookie, referer: 'http://service.test/cookies' }
      })
      expect(link(confirmation)).toBe('/smell/source?step=1')
      const reentry = await server.inject({
        method: 'GET',
        url,
        headers: { host: 'service.test', cookie: sessionCookie, referer: 'http://service.test/noise/when' }
      })
      expect(link(reentry)).toBe('/noise/when')
    })

    it('uses the previous page path from the referer', async () => {
      const referer = 'http://service.test/smell/source'
      const expectedPath = '/smell/source'
      const response = await submitGetRequest({ url, headers: { host: 'service.test', referer } })
      const link = parse(response.payload).querySelector('#successBanner a')

      expect(link.getAttribute('href')).toBe(expectedPath)
    })

    it('falls back to the service page for an invalid referrer', async () => {
      const referer = 'invalid'
      const response = await submitGetRequest({ url, headers: { host: 'service.test', referer } })
      const link = parse(response.payload).querySelector('#successBanner a')

      expect(link.getAttribute('href')).toBe(constants.urls.GOV_UK_SERVICE_HOME)
    })

    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Cookies on the Report an environmental problem service')
      expect(response.payload).toContain('<form action="/cookies" method="post">')
      expect(response.payload).not.toContain('class="defra-js-show" hidden')
    })

    it('shows confirmation only after preferences are updated', async () => {
      const initial = parse((await submitGetRequest({ url })).payload)
      const updated = parse((await submitGetRequest({ url: `${url}?updated=true` })).payload)

      expect(initial.querySelector('#successBanner').hasAttribute('hidden')).toBe(true)
      expect(updated.querySelector('#successBanner').hasAttribute('hidden')).toBe(false)
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
    it.each(['Yes', 'No'])('accepts the native form choice %s and shows confirmation', async choice => {
      const response = await submitPostRequest({
        url,
        payload: `cookieConsent=${choice}`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      })

      expect(response.headers.location).toBe(`${url}?updated=true`)
      const page = parse((await submitGetRequest({ url: response.headers.location })).payload)
      expect(page.querySelector('#successBanner').hasAttribute('hidden')).toBe(false)
    })

    it('saves an analytics opt-out and redirects to the confirmation page', async () => {
      const response = await submitPostRequest({
        url,
        payload: { analytics: 'No' },
        headers: { cookie: '_ga=value' }
      })

      expect(response.headers.location).toBe(`${url}?updated=true`)
      expect(response.headers['set-cookie'].join(';')).toContain('_ga=; Max-Age=0')
      expect(response.headers['set-cookie'].join(';')).toContain('cookies_settings')
    })

    it('rejects an invalid preference', async () => {
      await submitPostRequest({ url, payload: { analytics: 'maybe' } }, 400)
    })

    it('expires GA cookies on later requests with a saved opt-out', async () => {
      const response = await submitGetRequest({
        url,
        headers: {
          cookie: `_ga=value; cookies_preferences_set=${encodeCookie('true')}; cookies_settings=${encodeCookie(JSON.stringify({ analytics: 'off' }))}`
        }
      })

      expect(response.headers['set-cookie'].join(';')).toContain('_ga=; Max-Age=0')
    })
  })
})
