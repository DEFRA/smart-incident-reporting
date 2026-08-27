import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/smell-server.js'
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

const flatAddressApiResponse = {
  payload: {
    header: {
      uri: 'https://api.os.uk/search/places/v1/postcode?postcode=TE1%200ST&lr=EN&fq=logical_status_code%3A1%20logical_status_code%3A6&dataset=DPA&offset=0&maxresults=100',
      query: 'postcode=TE1 0ST',
      offset: 0,
      totalresults: 4,
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
          UPRN: '10001150010',
          ADDRESS: 'FLAT 10, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      },
      {
        DPA: {
          UPRN: '10001150002',
          ADDRESS: 'FLAT 2, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      },
      {
        DPA: {
          UPRN: '10001150001',
          ADDRESS: 'FLAT 1, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      },
      {
        DPA: {
          UPRN: '10001150011',
          ADDRESS: 'FLAT 11, TEST HOUSE, 5, EXAMPLE STREET, TESTTOWN, TE1 0ST',
          POSTCODE: 'TE1 0ST',
          X_COORDINATE: 543210.0,
          Y_COORDINATE: 182345.0
        }
      }
    ]
  }
}

const mixedStreetAddressApiResponse = {
  payload: {
    header: {
      uri: 'https://api.os.uk/search/places/v1/postcode?postcode=TE2%201LP&lr=EN&fq=logical_status_code%3A1%20logical_status_code%3A6&dataset=DPA&offset=0&maxresults=100',
      query: 'postcode=TE2 1LP',
      offset: 0,
      totalresults: 23,
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
      { DPA: { UPRN: '20001150001', ADDRESS: 'UNIT 1, 12, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150002', ADDRESS: 'N G J MANAGEMENT LTD, UNIT 3, 12, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150003', ADDRESS: 'LAKE LAW LLP, 12, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150004', ADDRESS: 'STONE MILL, 14, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150005', ADDRESS: 'FLAT 1, 30, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150006', ADDRESS: 'FLAT 2, 30, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150007', ADDRESS: 'FLAT 3, 30, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150008', ADDRESS: 'HUNGRY HIPPO, 38, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150009', ADDRESS: 'CLARK GROUP, GRANGE HOUSE, 42, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150010', ADDRESS: '1 MEADOW COURT, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150011', ADDRESS: 'C P L TESTVILLE LTD, 2 MEADOW COURT, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150012', ADDRESS: '26-28, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150013', ADDRESS: 'LONG LANE HOTEL, 29-31, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150014', ADDRESS: 'EDGE Q S LTD, 3 MEADOW COURT, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150015', ADDRESS: 'ROBERT MOORE DAVIES SOLICITORS, 32-36, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150016', ADDRESS: '34A, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150017', ADDRESS: '4-8 MEADOW COURT, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150018', ADDRESS: 'STRATEGY ADVISORS, THE OLD SCHOOL HOUSE, MEADOW COURT, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150019', ADDRESS: 'BESPOKE CARE AND SUPPORT LTD, CROWN HOUSE, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150020', ADDRESS: 'INTELLIGENT FINANCE LTD, CROWN HOUSE, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150021', ADDRESS: 'NATIONAL ARTS MUSEUM, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150022', ADDRESS: 'PITCHER AND LUTE, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } },
      { DPA: { UPRN: '20001150023', ADDRESS: 'ST. JOHNS IN THE LONG LANE, LONG LANE, TESTVILLE, TE2 1LP', POSTCODE: 'TE2 1LP', X_COORDINATE: 454321.0, Y_COORDINATE: 337654.0 } }
    ]
  }
}

const postSessionData1 = {
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

const postSessionData2 = {
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

const postSessionData3 = {
  'smell/choose-address': {
    resultsFound: true,
    buildingDetails: 'Broad Quay',
    postcode: 'BA1 1UB',
    showFullResults: false,
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

const cachedPostcodeDetails = {
  'smell-postcode-details': {
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

const selectedOption = {
  'smell/confirm-address': {
    selectedAddress: [
      {
        uprn: '10001142727',
        postcode: 'BA1 1UB',
        address: 'Horizon House, Broad Quay, Bath, BA1 1UB',
        x: 374999,
        y: 164393
      }
    ]
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
      expect(response.payload).toContain('<p class="govuk-body">1 address found for <b>32</b> and <b>BA1 1UB</b>.</p>')
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
      expect(response.payload).toContain('<p class="govuk-body">2 addresses found for <b>Carpenter House</b> and <b>BA1 1UB</b>.</p>')
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should return addresses for postcode only and omit building details text ${url}`, async () => {
      const sessionData = {
        'smell/find-address': {
          buildingDetails: '',
          postcode: 'BA1 1UB'
        }
      }
      findByPostcode.mockResolvedValueOnce(apiResponse)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toMatch(/<p class="govuk-body">\s*3 addresses found for <b>BA1 1UB<\/b>\.\s*<\/p>/)
      expect(response.payload).not.toContain('and <b>BA1 1UB</b>.')
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('Horizon House, Broad Quay, Bath, BA1 1UB')
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
      expect(response.payload).toContain('We could not find an address that matches <b>Capitol House</b> and <b>BA1 1UB</b>.')
      expect(response.payload).toMatch(/<p class="govuk-body">\s*3 addresses found for <b>BA1 1UB<\/b>\.\s*<\/p>/)
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('Horizon House, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should return success response and correct view with 1 matching address from the cached postcode details ${url}`, async () => {
      const answerData = {
        'smell/find-address': {
          buildingDetails: 'City Centre',
          postcode: 'BA1 1UB'
        }
      }
      const sessionData = { ...answerData, ...postSessionData2, ...cachedPostcodeDetails }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toContain('<p class="govuk-body">1 address found for <b>City Centre</b> and <b>BA1 1UB</b>.</p>')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should return success response and correct view with 2 matching addresses from the cached postcode details ${url}`, async () => {
      const answerData = {
        'smell/find-address': {
          buildingDetails: 'Carpenter House',
          postcode: 'BA1 1UB'
        }
      }
      const sessionData = { ...answerData, ...postSessionData2, ...cachedPostcodeDetails }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toContain('<p class="govuk-body">2 addresses found for <b>Carpenter House</b> and <b>BA1 1UB</b>.</p>')
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should return all the addresses for the postcode from the cached postcode details since there is no building name or number match ${url}`, async () => {
      const answerData = {
        'smell/find-address': {
          buildingDetails: 'House',
          postcode: 'BA1 1UB'
        }
      }
      const sessionData = { ...answerData, ...postSessionData2, ...cachedPostcodeDetails }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toContain('We could not find an address that matches <b>House</b> and <b>BA1 1UB</b>.')
      expect(response.payload).toMatch(/<p class="govuk-body">\s*3 addresses found for <b>BA1 1UB<\/b>\.\s*<\/p>/)
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('Horizon House, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should return success response and correct view with preselected radio option ${url}`, async () => {
      const answerData = {
        'smell/find-address': {
          buildingDetails: 'Broad Quay',
          postcode: 'BA1 1UB'
        }
      }
      const sessionData = { ...answerData, ...selectedOption, ...postSessionData3, ...cachedPostcodeDetails }
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)
      expect(response.payload).toContain('Choose an address')
      expect(response.payload).toContain('<p class="govuk-body">3 addresses found for <b>Broad Quay</b> and <b>BA1 1UB</b>.</p>')
      expect(response.payload).toContain('Carpenter House, 32, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('Carpenter House, Broad Quay, City Centre, Bath, Bath And North East Somerset, BA1 1UB')
      expect(response.payload).toContain('Horizon House, Broad Quay, Bath, BA1 1UB')
      expect(response.payload).toContain('<input class="govuk-radios__input" id="answerId-3" name="answerId" type="radio" value="10001142727" checked>')
      expect(response.payload).toContain('<a href="/smell/find-address" class="govuk-link">Change search</a>')
      expect(response.payload).toContain('<a href="/smell/location-address" class="govuk-link">Enter address manually</a>')
    })
    it(`Happy: Should order flat numbers numerically for matching addresses ${url}`, async () => {
      const sessionData = {
        'smell/find-address': {
          buildingDetails: 'Test House',
          postcode: 'TE1 0ST'
        }
      }

      findByPostcode.mockResolvedValueOnce(flatAddressApiResponse)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)

      const flat1Index = response.payload.indexOf('Flat 1, Test House, 5, Example Street, Testtown, TE1 0ST')
      const flat2Index = response.payload.indexOf('Flat 2, Test House, 5, Example Street, Testtown, TE1 0ST')
      const flat10Index = response.payload.indexOf('Flat 10, Test House, 5, Example Street, Testtown, TE1 0ST')
      const flat11Index = response.payload.indexOf('Flat 11, Test House, 5, Example Street, Testtown, TE1 0ST')

      expect(flat1Index).toBeGreaterThan(-1)
      expect(flat2Index).toBeGreaterThan(-1)
      expect(flat10Index).toBeGreaterThan(-1)
      expect(flat11Index).toBeGreaterThan(-1)
      expect(flat1Index).toBeLessThan(flat2Index)
      expect(flat2Index).toBeLessThan(flat10Index)
      expect(flat10Index).toBeLessThan(flat11Index)
    })
    it(`Happy: Should sort a mixed street of named and numbered addresses alphabetically with numeric ordering ${url}`, async () => {
      const sessionData = {
        'smell/find-address': {
          buildingDetails: '',
          postcode: 'TE2 1LP'
        }
      }

      findByPostcode.mockResolvedValueOnce(mixedStreetAddressApiResponse)
      const response = await submitGetRequest({ url }, header, constants.statusCodes.OK, sessionData)

      const addressOrder = [
        '1 Meadow Court, Long Lane, Testville, TE2 1LP',
        '4-8 Meadow Court, Long Lane, Testville, TE2 1LP',
        '26-28, Long Lane, Testville, TE2 1LP',
        '34a, Long Lane, Testville, TE2 1LP',
        'Bespoke Care And Support Ltd, Crown House, Long Lane, Testville, TE2 1LP',
        'C P L Testville Ltd, 2 Meadow Court, Long Lane, Testville, TE2 1LP',
        'Clark Group, Grange House, 42, Long Lane, Testville, TE2 1LP',
        'Edge Q S Ltd, 3 Meadow Court, Long Lane, Testville, TE2 1LP',
        'Flat 1, 30, Long Lane, Testville, TE2 1LP',
        'Flat 2, 30, Long Lane, Testville, TE2 1LP',
        'Flat 3, 30, Long Lane, Testville, TE2 1LP',
        'Hungry Hippo, 38, Long Lane, Testville, TE2 1LP',
        'Intelligent Finance Ltd, Crown House, Long Lane, Testville, TE2 1LP',
        'Lake Law Llp, 12, Long Lane, Testville, TE2 1LP',
        'Long Lane Hotel, 29-31, Long Lane, Testville, TE2 1LP',
        'N G J Management Ltd, Unit 3, 12, Long Lane, Testville, TE2 1LP',
        'National Arts Museum, Long Lane, Testville, TE2 1LP',
        'Pitcher And Lute, Long Lane, Testville, TE2 1LP',
        'Robert Moore Davies Solicitors, 32-36, Long Lane, Testville, TE2 1LP',
        'St. Johns In The Long Lane, Long Lane, Testville, TE2 1LP',
        'Stone Mill, 14, Long Lane, Testville, TE2 1LP',
        'Strategy Advisors, The Old School House, Meadow Court, Long Lane, Testville, TE2 1LP',
        'Unit 1, 12, Long Lane, Testville, TE2 1LP'
      ]

      const indices = addressOrder.map(addr => response.payload.indexOf(addr))

      indices.forEach(index => expect(index).toBeGreaterThan(-1))

      for (let i = 0; i < indices.length - 1; i++) {
        expect(indices[i]).toBeLessThan(indices[i + 1])
      }
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
      expect(response.payload).toContain('We could not find an address that matches <b>House</b> and <b>BA1 1UC</b>.')
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
      const response = await submitPostRequest(options, constants.statusCodes.OK, postSessionData1)
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
      const response = await submitPostRequest(options, 302, postSessionData1)
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
