import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.SMELL_SMELL_STRENGTH

describe(url, () => {
  describe('GET', () => {
    it(`Should return success response and the dummy page title for ${url}`, async () => {
      const response = await submitGetRequest({ url }, 'SMELL STRENGTH')
      expect(response.payload).toContain('SMELL STRENGTH')
    })
  })

  describe('POST', () => {
    it('Should return an error when the answer is missing', async () => {
      const response = await submitPostRequest({ url, payload: {} }, constants.statusCodes.OK)
      expect(response.payload).toContain('Select how strong the smell is')
      expect(response.payload).toContain('href="#answerId"')
    })

    it('Should store the answer and redirect to the location description page', async () => {
      const response = await submitPostRequest({ url, payload: { answerId: '1' } })
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe(constants.routes.SMELL_LOCATION_DESCRIPTION)
      expect(response.request.yar.get(constants.redisKeys.SMELL_SMELL_STRENGTH)).toBe(1)
    })
  })
})
