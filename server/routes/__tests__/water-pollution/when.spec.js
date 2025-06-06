import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_WHEN
const header = 'When did you see the pollution?'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
    it(`Should return success response and correct view when 'Now' is selected for ${url}`, async () => {
      const sessionData = {
        'date-time-option': 1
      }
      const response = await submitGetRequest({ url }, 'When did you see the pollution?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId" name="answerId" type="radio" value="1" checked>')
    })
    it(`Should return success response and correct view when 'Earlier today' is selected for ${url}`, async () => {
      const sessionData = {
        'date-time-option': 2
      }
      const response = await submitGetRequest({ url }, 'When did you see the pollution?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-2" name="answerId" type="radio" value="2" checked>')
    })
    it(`Should return success response and correct view when 'Yesterday' is selected for ${url}`, async () => {
      const sessionData = {
        'date-time-option': 3
      }
      const response = await submitGetRequest({ url }, 'When did you see the pollution?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-3" name="answerId" type="radio" value="3" checked>')
    })
    it(`Should return success response and correct view when 'Before yesterday' is selected for ${url}`, async () => {
      const sessionData = {
        'date-time-option': 4
      }
      const response = await submitGetRequest({ url }, 'When did you see the pollution?', constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-4" name="answerId" type="radio" value="4" checked>')
    })
  })
  describe('POST', () => {
    it('Happy: accepts valid answerId now and redirects to water-pollution/pollution-substance', async () => {
      const answerId = 1
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_POLLUTION_SUBSTANCE)
      expect(new Date(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_WHEN))).toBeInstanceOf(Date)
    })
    it('Happy: accepts valid answerId of earlier today and redirects to water-pollution/earlier-today', async () => {
      const answerId = 2
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_EARLIER_TODAY)
    })
    it('Happy: accepts valid answerId of yesterday and redirects to water-pollution/yesterday', async () => {
      const answerId = 3
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_YESTERDAY)
    })
    it('Happy: accepts valid answerId of before yesterday and redirects to water-pollution/date-before-yesterday', async () => {
      const answerId = 4
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options)
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_DATE_BEFORE_YESTERDAY)
    })
    it('Sad: errors on no answerId', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select when you saw the pollution')
    })
    it('Happy: For CYA journey, accepts valid answerID for now and redirects to water-pollution/check-your-answers', async () => {
      const answerId = 1
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
        referer: constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS
      })
      expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_CHECK_YOUR_ANSWERS)
      expect(new Date(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_WHEN))).toBeInstanceOf(Date)
    })
  })
})
