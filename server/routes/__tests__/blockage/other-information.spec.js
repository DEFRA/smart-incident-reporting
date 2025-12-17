import { submitGetRequest, submitPostRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.BLOCKAGE_OTHER_INFORMATION

const sessionData = {
  'blockage/other-information': {
    otherInformation: 'test information'
  }
}

describe(url, () => {
  describe('GET', () => {
    it('Should display other-information view with saved values', async () => {
      const response = await submitGetRequest({ url }, 'Is there anything else you\'d like to add?', constants.statusCodes.OK, sessionData)
      expect(response.result).toContain('test information')
    })

    it('Should display empty form when no session data', async () => {
      const response = await submitGetRequest({ url }, 'Is there anything else you\'d like to add?', constants.statusCodes.OK)
      expect(response.statusCode).toBe(constants.statusCodes.OK)
    })
  })

  describe('POST', () => {
    it.each([
      {
        description: 'with text',
        payload: { otherInformation: 'Additional details about the blockage' }
      },
      {
        description: 'with no text',
        payload: { otherInformation: '' }
      },
      {
        description: 'no payload',
        payload: undefined
      }
    ])('Accepts $description and redirects to BLOCKAGE_START', async ({ payload }) => {
      const options = { url, payload }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)
      expect(response.headers.location).toEqual(constants.routes.BLOCKAGE_START)
    })

    it.each([
      {
        description: 'with text',
        payload: { otherInformation: 'Additional details about the blockage' },
        expected: { otherInformation: 'Additional details about the blockage' }
      },
      {
        description: 'with no text',
        payload: { otherInformation: '' },
        expected: { otherInformation: '' }
      },
      {
        description: 'no payload',
        payload: undefined,
        expected: { otherInformation: '' }
      }
    ])('Saves $description to session', async ({ payload, expected }) => {
      const options = { url, payload }
      const response = await submitPostRequest(options, constants.statusCodes.REDIRECT)
      expect(response.request.yar.get(constants.redisKeys.BLOCKAGE_OTHER_INFORMATION)).toEqual(expected)
    })
  })
})
