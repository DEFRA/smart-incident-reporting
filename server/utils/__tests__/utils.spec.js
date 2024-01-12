import { get, post, getJson, makeRequest } from '../util.js'
import wreck from '@hapi/wreck'
jest.mock('@hapi/wreck')

const mockResponseSuccess = {
  res: { statusCode: 200 },
  payload: { data: 'test' }
}
const mockResponseError = {
  res: { statusCode: 404 },
  payload: { error: 'not found' }
}

describe('utils', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get', () => {
    it('get should return a successful request', async () => {
      wreck.get.mockResolvedValueOnce(mockResponseSuccess)
      const url = 'https://example.com/get'
      const result = await get(url)

      expect(result).toEqual({ data: 'test' })
      expect(wreck.get).toHaveBeenCalledWith(url, undefined)
    })
  })

  describe('post', () => {
    it('post should return a successful request', async () => {
      wreck.post.mockResolvedValueOnce(mockResponseSuccess)
      const url = 'https://example.com/post'
      const data = { payload: 'test' }
      const result = await post(url, data)

      expect(result).toEqual({ data: 'test' })
      expect(wreck.post).toHaveBeenCalledWith(url, data)
    })
  })

  describe('getJson', () => {
    it('getJson should return a successful request', async () => {
      wreck.get.mockResolvedValueOnce(mockResponseSuccess)
      const url = 'https://example.com/getJson'
      const result = await getJson(url)

      expect(result).toEqual({ data: 'test' })
      expect(wreck.get).toHaveBeenCalledWith(url, { json: true })
    })
  })

  describe('makeRequest', () => {
    it('makeRequest should return a successful request', async () => {
      // Mock the wreck[method] call to resolve with a successful response
      wreck.get = jest.fn().mockResolvedValue(mockResponseSuccess)

      const url = 'https://example.com/success'
      const result = await makeRequest('get', url)

      expect(result).toEqual({ data: 'test' })
      expect(wreck.get).toHaveBeenCalledWith(url, undefined)
    })

    it('makeRequest should return a failed request', async () => {
      // Mock the wreck[method] call to resolve with an error response
      wreck.get = jest.fn().mockResolvedValue(mockResponseError)

      const url = 'https://example.com/failure'
      await expect(makeRequest('get', url)).rejects.toEqual(
        mockResponseError.payload
      )

      expect(wreck.get).toHaveBeenCalledWith(url, undefined)
    })

    it('makeRequest should return a failed request with Unknown error if no payload', async () => {
      // Mock the wreck[method] call to resolve with an error response
      wreck.get = jest.fn().mockResolvedValue({
        res: {
          statusCode: 500
        }
      })

      const url = 'https://example.com/failure'
      await expect(makeRequest('get', url)).rejects.toEqual(new Error('Unknown error'))

      expect(wreck.get).toHaveBeenCalledWith(url, undefined)
    })
  })
})
