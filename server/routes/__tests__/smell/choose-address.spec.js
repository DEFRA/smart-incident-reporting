import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { findByPostcode } from '../../../services/find-location.js'

const url = constants.routes.SMELL_CHOOSE_ADDRESS
const header = 'Choose an address'

const apiResponse = {
  payload: {
    header: {
      uri: 'https://api.os.uk/search/places/v1/postcode?postcode=BA1%201UB&lr=EN&fq=logical_status_code%3A1%20logical_status_code%3A6&dataset=DPA&offset=0&maxresults=100',
      query: 'postcode=BA1 1UB',
      offset: 0,
      totalresults: 2,
      format: 'JSON',
      dataset: 'DPA',
      lr: 'EN',
      maxresults: 100,
      epoch: '115',
      lastupdate: '2025-03-12',
      filter: 'fq=logical_status_code:1 logical_status_code:6',
      output_srs: 'EPSG:27700'
    },
    results: [
      {
        DPA: {
          UPRN: '10001142725',
          ADDRESS: 'CARPENTER HOUSE, 32, BROAD QUAY, BATH, BA1 1UB',
          POSTCODE: 'BA1 1UB',
          X_COORDINATE: 374999.0,
          Y_COORDINATE: 164393.0
        }
      },
      {
        DPA: {
          UPRN: '10001142726',
          ADDRESS: 'CARPENTER HOUSE, BROAD QUAY, CITY CENTRE, BATH, BATH AND NORTH EAST SOMERSET, BA1 1UB',
          POSTCODE: 'BA1 1UB',
          X_COORDINATE: 374999.0,
          Y_COORDINATE: 164393.0
        }
      },
      {
        DPA: {
          UPRN: '10001142727',
          ADDRESS: 'HORIZON HOUSE, BROAD QUAY, BATH, BA1 1UB',
          POSTCODE: 'BA1 1UB',
          X_COORDINATE: 374999.0,
          Y_COORDINATE: 164393.0
        }
      }
    ]
  }
}

const incorrectPostcodeResponse = {
  payload: {
    header: {
      uri: 'https://api.os.uk/search/places/v1/postcode?postcode=BA1%201UC&lr=EN&fq=logical_status_code%3A1%20logical_status_code%3A6&dataset=DPA&offset=0&maxresults=100',
      query: 'postcode=BA1 1UC',
      offset: 0,
      totalresults: 0,
      format: 'JSON',
      dataset: 'DPA',
      lr: 'EN',
      maxresults: 100,
      epoch: '115',
      lastupdate: '2025-03-12',
      filter: 'fq=logical_status_code:1 logical_status_code:6',
      output_srs: 'EPSG:27700'
    }
  }
}

const postSessionData = {
  'smell/choose-address': {
    resultsFound: true,
    buildingDetails: 'Capitol House',
    postcode: 'BA1 1UB',
    showFullResults: true,
    resultsData: [
      {
        uprn: '10001142725',
        postcode: 'BA1 1UB',
        address: 'Carpenter House, 32, Broad Quay, Bath, BA1 1UB',
        x: 374999,
        y: 164393
      },
      {
        uprn: '10001142726',
        postcode: 'BA1 1UB',
        address: 'Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB',
        x: 374999,
        y: 164393
      },
      {
        uprn: '10001142727',
        postcode: 'BA1 1UB',
        address: 'Horizon House, Broad Quay, Bath, BA1 1UB',
        x: 374999,
        y: 164393
      }
    ],
    resultlength: 3
  }
}

jest.mock('../../../services/find-location', () => ({
  findByPostcode: jest.fn()
}))

describe(url, () => {
  describe('GET', () => {
    it(`Happy: Should return success response and correct view with 1 matching address from the postcode ${url}`, async () => {
      const sessionData = {
        'smell/find-address': {
          buildingDetails: '32',
          postcode: 'BA1 1UB'
        }
      }
      findByPostcode.mockResolvedValueOnce(apiResponse)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toContain('1 address found for <b>32</b> and <b>BA1 1UB</b>')
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should return success response and correct view with 2 matching addresses from the postcode ${url}`, async () => {
      const sessionData = {
        'smell/find-address': {
          buildingDetails: 'Carpenter House',
          postcode: 'BA1 1UB'
        }
      }
      findByPostcode.mockResolvedValueOnce(apiResponse)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toContain('2 addresses found for <b>Carpenter House</b> and <b>BA1 1UB</b>')
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should return all the addresses for the postcode since there is no building name or number match ${url}`, async () => {
      const sessionData = {
        'smell/find-address': {
          buildingDetails: 'Capitol House',
          postcode: 'BA1 1UB'
        }
      }
      findByPostcode.mockResolvedValueOnce(apiResponse)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toContain('We could not find an address that matches <b>Capitol House</b> and <b>BA1 1UB</b>')
      expect(response.payload).toContain('3 addresses found for <b>BA1 1UB</b>')
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('Horizon House, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Sad: Should return No address found message for incorrect postcode ${url}`, async () => {
      const sessionData = {
        'smell/find-address': {
          buildingDetails: 'House',
          postcode: 'BA1 1UC'
        }
      }
      const header = 'No address found'
      findByPostcode.mockResolvedValueOnce(incorrectPostcodeResponse)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('No address found')
      expect(response.payload).toContain('We could not find an address that matches <b>House</b> and <b>BA1 1UC</b>')
      expect(response.payload).toContain('Check you have entered the correct postcode.')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
  })
  describe('POST', () => {
    it('Sad: no radio selected, returns error state', async () => {
      const options = {
        url,
        payload: {}
      }
      const response = await submitPostRequest(options, constants.statusCodes.OK, postSessionData)
      expect(response.payload).toContain('There is a problem')
      expect(response.payload).toContain('Select an address')
    })
    it('Happy: accepts valid answerId and redirects to SMELL_CONFIRM_ADDRESS', async () => {
      const answerId = 10001142725
      const options = {
        url,
        payload: {
          answerId
        }
      }
      const response = await submitPostRequest(options, 302, postSessionData)
      expect(response.headers.location).toEqual(constants.routes.SMELL_CONFIRM_ADDRESS)
      expect(response.request.yar.get(constants.redisKeys.SMELL_CONFIRM_ADDRESS)).toEqual({
        selectedAddress: [
          {
            uprn: '10001142725',
            postcode: 'BA1 1UB',
            address: 'Carpenter House, 32, Broad Quay, Bath, BA1 1UB',
            x: 374999,
            y: 164393
          }
        ]
      })
    })
  })
})
