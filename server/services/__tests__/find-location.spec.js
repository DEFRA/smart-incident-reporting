import { findByPostcode } from '../find-location.js'
import util from '../../utils/util.js'

jest.mock('../../../server/utils/util', () => ({
  getJson: jest.fn()
}))

describe('OrdnanceService', () => {
  describe('findByPostcode', () => {
    it('should return the coordinates for a valid postcode', async () => {
      // Mock the util.getJson function
      util.getJson.mockResolvedValueOnce({
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
              ADDRESS: 'CARPENTER HOUSE, BROAD QUAY, BATH, BA1 1UB',
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
          }
        ]
      })

      // Call the function
      const result = await findByPostcode('BA1 1UB')

      const expectedResults = {
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
                ADDRESS: 'CARPENTER HOUSE, BROAD QUAY, BATH, BA1 1UB',
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
            }
          ]
        }
      }

      // Assert the result
      expect(result).toEqual(expectedResults)

      // Assert the util.getJson function call
      expect(util.getJson).toHaveBeenCalledTimes(1)
      expect(util.getJson).toHaveBeenCalledWith('https://api.os.uk/search/places/v1/postcode?postcode=BA1 1UB&key=testKey&lr=EN&fq=logical_status_code:1 logical_status_code:6&dataset=DPA&offset=0&maxresults=100', true)
    })

    it('should return default response for an invalid postcode', async () => {
      // Mock the util.getJson function to throw an error
      util.getJson.mockRejectedValueOnce(new Error('Invalid postcode'))

      // Call the function
      const result = await findByPostcode('invalid')

      const expectedResults = {
        payload: {
          header: {
            totalresults: 0
          }
        }
      }

      // Assert the result
      expect(result).toEqual(expectedResults)

      // Assert the util.getJson function call
      expect(util.getJson).toHaveBeenCalledTimes(1)
      expect(util.getJson).toHaveBeenNthCalledWith(1, 'https://api.os.uk/search/places/v1/postcode?postcode=invalid&key=testKey&lr=EN&fq=logical_status_code:1 logical_status_code:6&dataset=DPA&offset=0&maxresults=100', true)
    })
  })
})
