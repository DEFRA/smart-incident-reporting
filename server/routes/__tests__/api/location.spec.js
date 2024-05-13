import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import util from '../../../utils/util.js'

jest.mock('../../../utils/util.js', () => ({
  getJson: jest.fn()
}))

const url = constants.routes.API_LOCATION

describe(url, () => {
  describe('GET', () => {
    it(`Should return top result from England ${url}`, async () => {
      util.getJson.mockImplementation(() => {
        return {
          results: [{
            GAZETTEER_ENTRY: {
              ID: 'WA41HT',
              NAMES_URI: 'http://data.ordnancesurvey.co.uk/id/postcodeunit/WA41HT',
              NAME1: 'WA4 1HT',
              COUNTRY: 'England'
            }
          }, {
            GAZETTEER_ENTRY: {
              ID: 'WA41HT',
              NAMES_URI: 'http://data.ordnancesurvey.co.uk/id/postcodeunit/WA41HT',
              NAME1: 'WA4 1HT',
              COUNTRY: 'Wales'
            }
          }]
        }
      })
      const { result } = await submitGetRequest({ url: `${url}?location=WA4 1HT` })
      expect(result).toEqual({
        GAZETTEER_ENTRY: {
          ID: 'WA41HT',
          NAMES_URI: 'http://data.ordnancesurvey.co.uk/id/postcodeunit/WA41HT',
          NAME1: 'WA4 1HT',
          COUNTRY: 'England'
        }
      })
    })
    it(`Should return no results if none from England ${url}`, async () => {
      util.getJson.mockImplementation(() => {
        return {
          results: [{
            GAZETTEER_ENTRY: {
              ID: 'WA41HT',
              NAMES_URI: 'http://data.ordnancesurvey.co.uk/id/postcodeunit/WA41HT',
              NAME1: 'WA4 1HT',
              COUNTRY: 'Scotland'
            }
          }, {
            GAZETTEER_ENTRY: {
              ID: 'WA41HT',
              NAMES_URI: 'http://data.ordnancesurvey.co.uk/id/postcodeunit/WA41HT',
              NAME1: 'WA4 1HT',
              COUNTRY: 'Wales'
            }
          }]
        }
      })
      const { result } = await submitGetRequest({ url: `${url}?location=WA4 1HT` })
      expect(result).toEqual({})
    })
    it(`Should return no results if no search term ${url}`, async () => {
      util.getJson.mockImplementation(() => {
        return {
          results: [{
            GAZETTEER_ENTRY: {
              ID: 'WA41HT',
              NAMES_URI: 'http://data.ordnancesurvey.co.uk/id/postcodeunit/WA41HT',
              NAME1: 'WA4 1HT',
              COUNTRY: 'Scotland'
            }
          }, {
            GAZETTEER_ENTRY: {
              ID: 'WA41HT',
              NAMES_URI: 'http://data.ordnancesurvey.co.uk/id/postcodeunit/WA41HT',
              NAME1: 'WA4 1HT',
              COUNTRY: 'Wales'
            }
          }]
        }
      })
      const { result } = await submitGetRequest({ url: `${url}?location=` })
      expect(result).toEqual({})
    })
    it('Should return empty object if no results returned', async () => {
      util.getJson.mockImplementation(() => {
        return {}
      })
      const { result } = await submitGetRequest({ url: `${url}?location=test` })
      expect(result).toEqual({})
    })
    it('Should return empty object if empty array returned', async () => {
      util.getJson.mockImplementation(() => {
        return {
          results: []
        }
      })
      const { result } = await submitGetRequest({ url: `${url}?location=test` })
      expect(result).toEqual({})
    })
  })
})
