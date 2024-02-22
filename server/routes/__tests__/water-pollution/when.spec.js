import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.WATER_POLLUTION_WHEN
const header = 'When did you see the pollution?'

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and correct view for ${url}`, async () => {
      await submitGetRequest({ url }, header)
    })
  })

  // describe('POST', () => {
  //   it('Happy: accept and store a location description', async () => {
  //     const locationDescription = 'This is a description of the location of the water pollution'
  //     const options = {
  //       url,
  //       payload: {
  //         locationDescription
  //       }
  //     }
  //     const response = await submitPostRequest(options)
  //     expect(response.headers.location).toEqual(constants.routes.WATER_POLLUTION_WHEN)
  //     expect(response.request.yar.get(constants.redisKeys.WATER_POLLUTION_LOCATION_DESCRIPTION)).toEqual(locationDescription)
  //   })
  //   it('Sad: errors on no locationDescription provided', async () => {
  //     const options = {
  //       url,
  //       payload: {}
  //     }
  //     const response = await submitPostRequest(options, constants.statusCodes.OK)
  //     expect(response.payload).toContain('There is a problem')
  //     expect(response.payload).toContain('Enter a description of where the pollution is')
  //   })
  // })
})
