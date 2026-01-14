import { submitGetRequest } from '../../__test-helpers__/server.js'
import constants from '../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.COOKIES

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, 'Cookies on the Report an environmental problem service')
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
})
