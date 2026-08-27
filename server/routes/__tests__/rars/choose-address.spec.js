import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import { findByPostcode } from '../../../services/find-location.js'

jest.mock('../../../services/find-location.js', () => ({
  findByPostcode: jest.fn()
}))

const apiResponse = {
  payload: {
    header: {
      uri: 'https://api.os.uk/search/places/v1/postcode?postcode=TE1%200ST',
      query: 'postcode=TE1 0ST',
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
          UPRN: '10001150001',
          ADDRESS: 'UNIT 1, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      },
      {
        DPA: {
          UPRN: '10001150002',
          ADDRESS: 'UNIT 2, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      }
    ]
  }
}

const noResultsApiResponse = {
  payload: {
    header: {
      uri: 'https://api.os.uk/search/places/v1/postcode?postcode=TE9%209ZZ',
      query: 'postcode=TE9 9ZZ',
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

const duplicateUprnsApiResponse = {
  payload: {
    header: {
      uri: 'https://api.os.uk/search/places/v1/postcode?postcode=TE1%200ST',
      query: 'postcode=TE1 0ST',
      offset: 0,
      totalresults: 3,
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
          UPRN: '10001150001',
          ADDRESS: 'UNIT 1, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      },
      {
        DPA: {
          UPRN: '10001150001',
          ADDRESS: 'UNIT 1, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      },
      {
        DPA: {
          UPRN: '10001150002',
          ADDRESS: 'UNIT 2, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      }
    ]
  }
}

const findAddressSession = {
  [constants.redisKeys.RARS_FIND_ADDRESS]: {
    buildingDetails: 'Test House',
    postcode: 'TE1 0ST'
  }
}

const chooseAddressSession = {
  [constants.redisKeys.RARS_CHOOSE_ADDRESS]: {
    resultsFound: true,
    buildingDetails: 'Test House',
    postcode: 'TE1 0ST',
    showFullResults: false,
    resultsData: [
      {
        uprn: '10001150001',
        postcode: 'TE1 0ST',
        address: 'Unit 1, Test House, 5, Example Street, Testtown, TE1 0ST',
        x: 543210.0,
        y: 182345.0
      },
      {
        uprn: '10001150002',
        postcode: 'TE1 0ST',
        address: 'Unit 2, Test House, 5, Example Street, Testtown, TE1 0ST',
        x: 543210.0,
        y: 182345.0
      }
    ],
    resultlength: 2
  }
}

const problems = [
  { problem: 'smell', url: constants.routes.SMELL_CHOOSE_ADDRESS, redirect: constants.routes.SMELL_CONFIRM_ADDRESS },
  { problem: 'noise', url: constants.routes.NOISE_CHOOSE_ADDRESS, redirect: constants.routes.NOISE_CONFIRM_ADDRESS },
  { problem: 'dust', url: constants.routes.DUST_CHOOSE_ADDRESS, redirect: constants.routes.DUST_CONFIRM_ADDRESS },
  { problem: 'litter', url: constants.routes.LITTER_CHOOSE_ADDRESS, redirect: constants.routes.LITTER_CONFIRM_ADDRESS },
  { problem: 'mud', url: constants.routes.MUD_CHOOSE_ADDRESS, redirect: constants.routes.MUD_CONFIRM_ADDRESS },
  { problem: 'vermin', url: constants.routes.VERMIN_CHOOSE_ADDRESS, redirect: constants.routes.VERMIN_CONFIRM_ADDRESS }
]

describe('RARS Choose Address Routes', () => {
  describe.each(problems)('$problem choose address', ({ url, redirect }) => {
    describe('GET', () => {
      it('Happy: Should return success response and display matching addresses', async () => {
        findByPostcode.mockResolvedValueOnce(apiResponse)
        const response = await submitGetRequest({ url }, 'Choose an address', constants.statusCodes.OK, findAddressSession)
        expect(response.payload).toContain('Unit 1, Test House, 5, Example Street, Testtown, TE1 0ST')
        expect(response.payload).toContain('Unit 2, Test House, 5, Example Street, Testtown, TE1 0ST')
        expect(response.payload).toContain('2 addresses found for')
      })

      it('Happy: Should deduplicate addresses with the same UPRN', async () => {
        findByPostcode.mockResolvedValueOnce(duplicateUprnsApiResponse)
        const response = await submitGetRequest({ url }, 'Choose an address', constants.statusCodes.OK, findAddressSession)
        const occurrences = (response.payload.match(/Unit 1, Test House/g) || []).length
        expect(occurrences).toBe(1)
        expect(response.payload).toContain('2 addresses found for')
        expect(response.payload).toContain('Unit 2, Test House, 5, Example Street, Testtown, TE1 0ST')
      })

      it('Sad: Should display no address found when postcode returns no results', async () => {
        const noResultsSession = {
          [constants.redisKeys.RARS_FIND_ADDRESS]: { buildingDetails: '', postcode: 'TE9 9ZZ' }
        }
        findByPostcode.mockResolvedValueOnce(noResultsApiResponse)
        const response = await submitGetRequest({ url }, 'No address found', constants.statusCodes.OK, noResultsSession)
        expect(response.payload).toContain('Check you have entered the correct postcode.')
      })

      it('Happy: Should return cached results when postcode and building details are unchanged', async () => {
        const session = {
          [constants.redisKeys.RARS_FIND_ADDRESS]: { buildingDetails: 'Test House', postcode: 'TE1 0ST' },
          [constants.redisKeys.RARS_CHOOSE_ADDRESS]: {
            ...chooseAddressSession[constants.redisKeys.RARS_CHOOSE_ADDRESS],
            buildingDetails: 'Test House',
            postcode: 'TE1 0ST'
          }
        }
        const response = await submitGetRequest({ url }, 'Choose an address', constants.statusCodes.OK, session)
        expect(response.payload).toContain('Unit 1, Test House, 5, Example Street, Testtown, TE1 0ST')
        expect(findByPostcode).not.toHaveBeenCalled()
      })

      it('Happy: Should show all results when building details do not match any address', async () => {
        findByPostcode.mockResolvedValueOnce(apiResponse)
        const session = {
          [constants.redisKeys.RARS_FIND_ADDRESS]: { buildingDetails: 'Nonexistent Building', postcode: 'TE1 0ST' }
        }
        const response = await submitGetRequest({ url }, 'Choose an address', constants.statusCodes.OK, session)
        expect(response.payload).toContain('We could not find an address that matches')
        expect(response.payload).toContain('Nonexistent Building')
      })

      it('Happy: Should use cached postcode data when only building details change', async () => {
        const postcodePayload = apiResponse.payload
        const session = {
          [constants.redisKeys.RARS_FIND_ADDRESS]: { buildingDetails: 'Unit 1', postcode: 'TE1 0ST' },
          [constants.redisKeys.RARS_CHOOSE_ADDRESS]: {
            ...chooseAddressSession[constants.redisKeys.RARS_CHOOSE_ADDRESS],
            buildingDetails: 'Test House',
            postcode: 'TE1 0ST'
          },
          'smell-postcode-details': postcodePayload,
          'noise-postcode-details': postcodePayload,
          'dust-postcode-details': postcodePayload,
          'litter-postcode-details': postcodePayload,
          'mud-postcode-details': postcodePayload,
          'vermin-postcode-details': postcodePayload
        }
        const response = await submitGetRequest({ url }, 'Choose an address', constants.statusCodes.OK, session)
        expect(response.payload).toContain('Unit 1, Test House, 5, Example Street, Testtown, TE1 0ST')
        expect(findByPostcode).not.toHaveBeenCalled()
      })

      it('Happy: Should preselect previously chosen address when returning to the page', async () => {
        const session = {
          [constants.redisKeys.RARS_FIND_ADDRESS]: { buildingDetails: 'Test House', postcode: 'TE1 0ST' },
          [constants.redisKeys.RARS_CHOOSE_ADDRESS]: {
            ...chooseAddressSession[constants.redisKeys.RARS_CHOOSE_ADDRESS],
            buildingDetails: 'Test House',
            postcode: 'TE1 0ST'
          },
          [constants.redisKeys.RARS_CONFIRM_ADDRESS]: {
            selectedAddress: [{ uprn: '10001150001', postcode: 'TE1 0ST', address: 'Unit 1, Test House, 5, Example Street, Testtown, TE1 0ST', x: 543210.0, y: 182345.0 }]
          }
        }
        const response = await submitGetRequest({ url }, 'Choose an address', constants.statusCodes.OK, session)
        expect(response.payload).toContain('value="10001150001" checked')
      })
    })

    describe('POST', () => {
      it('Happy: accepts valid selection and redirects to confirm address', async () => {
        const options = {
          url,
          payload: { answerId: '10001150001' }
        }
        const response = await submitPostRequest(options, constants.statusCodes.REDIRECT, {
          ...findAddressSession,
          ...chooseAddressSession
        })
        expect(response.headers.location).toEqual(redirect)
        const confirmed = response.request.yar.get(constants.redisKeys.RARS_CONFIRM_ADDRESS)
        expect(confirmed.selectedAddress[0].uprn).toEqual('10001150001')
      })

      it('Sad: errors when no address selected', async () => {
        const options = { url, payload: {} }
        const response = await submitPostRequest(options, constants.statusCodes.OK, {
          ...findAddressSession,
          ...chooseAddressSession
        })
        expect(response.payload).toContain('There is a problem')
        expect(response.payload).toContain('Select an address')
      })
    })
  })
})
