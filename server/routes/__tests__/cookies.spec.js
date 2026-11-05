import { submitGetRequest, submitPostRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.COOKIES
const encodeCookie = value => Buffer.from(encodeURIComponent(value)).toString('base64')

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'Cookies on the Report an environmental problem service')
      expect(response.payload).toContain('<form action="/cookies" method="post">')
      expect(response.payload).not.toContain('class="defra-js-show" hidden')
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
