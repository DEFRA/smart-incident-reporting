import { submitGetRequest } from '../../../__test-helpers__/server.js'
import constants from '../../../utils/constants.js'
import axios from 'axios'

jest.mock('axios', () => ({
  request: jest.fn()
}))

const url = constants.routes.API_OS_API_TOKEN

describe(url, () => {
  describe('GET', () => {
    it(`Should return top result from England ${url}`, async () => {
      axios.request.mockImplementation(() => {
        console.log('IN MOCK')
        return {
          data: 'TOKEN'
        }
      })
      const { result } = await submitGetRequest({ url })
      expect(result).toEqual('TOKEN')
    })
  })
})
