// Mocking the @hapi/wreck module
const mockWreck = {
  get: jest.fn(),
  post: jest.fn(),
  makeRequest: jest.fn()
}

jest.mock('@hapi/wreck', () => ({
  defaults: jest.fn(() => mockWreck)
}))

const {
  makeRequest,
  get,
  post,
  getJson
} = require('../../../server/utils/util')

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
      mockWreck.get.mockResolvedValueOnce(mockResponseSuccess)
      const url = 'https://example.com/get'

      const result = await get(url)

      expect(result).toEqual({ data: 'test' })
      expect(mockWreck.get).toHaveBeenCalledWith(url, undefined)
    })
  })

  describe('post', () => {
    it('post should return a successful request', async () => {
      mockWreck.post.mockResolvedValueOnce(mockResponseSuccess)
      const url = 'https://example.com/post'
      const data = { payload: 'test' }
      const result = await post(url, data)

      expect(result).toEqual({ data: 'test' })
      expect(mockWreck.post).toHaveBeenCalledWith(url, data)
    })
  })

  describe('getJson', () => {
    it('getJson should return a successful request', async () => {
      mockWreck.get.mockResolvedValueOnce(mockResponseSuccess)
      const url = 'https://example.com/getJson'
      const result = await getJson(url)

      expect(result).toEqual({ data: 'test' })
      expect(mockWreck.get).toHaveBeenCalledWith(url, { json: true })
    })
  })

  describe('makeRequest', () => {
    it('makeRequest should return a successful request', async () => {
      // Mock the wreck[method] call to resolve with a successful response
      mockWreck.get = jest.fn().mockResolvedValue(mockResponseSuccess)

      const url = 'https://example.com/success'
      const result = await makeRequest('get', url)

      expect(result).toEqual({ data: 'test' })
      expect(mockWreck.get).toHaveBeenCalledWith(url, undefined)
    })

    it('makeRequest should return a failed request', async () => {
      // Mock the wreck[method] call to resolve with an error response
      mockWreck.get = jest.fn().mockResolvedValue(mockResponseError)

      const url = 'https://example.com/failure'
      await expect(makeRequest('get', url)).rejects.toEqual(
        mockResponseError.payload
      )

      expect(mockWreck.get).toHaveBeenCalledWith(url, undefined)
    })
  })
})
