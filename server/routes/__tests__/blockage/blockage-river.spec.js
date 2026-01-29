import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { parse } from 'node-html-parser'

const url = constants.routes.BLOCKAGE_RIVER

const sessionData = {
  [constants.redisKeys.BLOCKAGE_RIVER]: 'no'
}

describe(url, () => {
  describe('GET', () => {
    it('Should display contact-details view with saved values', async () => {
      const response = await submitGetRequest({ url }, 'Is the blockage in a river?', constants.statusCodes.OK, sessionData)
      expect(response.result).toContain('value="no" checked')
    })
    it('Should display empty form when no session data', async () => {
      const response = await submitGetRequest({ url }, 'Is the blockage in a river?', constants.statusCodes.OK)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
    it(`Should show the correct service name and link for a blockage in a water course service page on ${url}`, async () => {
      process.env.REGISTER_START_ROUTES = 'false'
      const response = await submitGetRequest({ url })
      const html = parse(response.payload)
      const serviceNameLink = html.querySelector('.govuk-service-navigation__link')
      expect(html.querySelector('.govuk-service-navigation__service-name').textContent).toContain(constants.serviceNames.BLOCKAGE)
      expect(serviceNameLink.getAttribute('href')).toBe(constants.urls.GOV_UK_BLOCKAGE)
      process.env.REGISTER_START_ROUTES = 'true'
    })
  })
  describe('POST', () => {
    it('Should accept yes option and redirect to blockage/river-name', async () => {
      const options = {
        url,
        payload: {
          isRiver: 'yes'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_RIVER_NAME)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_RIVER)).toEqual('yes')
    })
    it('Should accept no option and redirect to blockage/report-local-council', async () => {
      const options = {
        url,
        payload: {
          isRiver: 'no'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_REPORT_DIRECTLY)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_RIVER)).toEqual('no')
    })
    it('Should accept not sure option and redirect to blockage/report-local-council', async () => {
      const options = {
        url,
        payload: {
          isRiver: 'notSure'
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_REPORT_DIRECTLY)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_RIVER)).toEqual('notSure')
    })
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select \'yes\' if the blockage is in a river')
    })
  })
})
