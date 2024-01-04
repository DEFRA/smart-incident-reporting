const {
  get,
  set,
  delete: deleteItem,
  deleteSessionData,
  isJsonString,
  isBooleanString
} = require('../../../server/services/redis.service.js')
const { SI_SESSION_KEY } = require('../../../server/utils/constants.js')

// Mock Redis client
let tempKeys = []

const mockClient = {
  async get (key) {
    // Mock Redis get method
    return tempKeys[key]
  },
  async setex (key, _ttl, value) {
    // Mock Redis setex method
    tempKeys[key] = value
  },
  async del (key) {
    // Mock Redis del method
    tempKeys = tempKeys.filter(x => x !== key)
  },
  async scan (cursor, _match, sessionKey) {
    // Mock Redis scan method
    const keys = Object.keys(tempKeys).filter(k => k.match(sessionKey))
    const cursorIndex = keys.indexOf(cursor)
    const nextKeys = keys.slice(cursorIndex + 1)
    const nextCursor = nextKeys.length > 0 ? nextKeys[0] : '0'
    const results = keys.slice(0, 10) // Simulating a limit of 10 keys per scan

    return [nextCursor, results]
  }
}

// Mock request object
const mockRequest = {
  redis: {
    client: mockClient
  },
  state: {
    [SI_SESSION_KEY]: 'session_key'
  }
}

// Mock data
const mockValue = 'mockValue'
const mockTTLValue = 100
const mockTestKey = 'session_key.testKey'

describe('RedisService', () => {
  afterEach(() => {
    tempKeys = []
  })

  describe('get', () => {
    it('should get value from Redis', async () => {
      await mockClient.setex(mockTestKey, mockTTLValue, mockValue)

      const result = await get(mockRequest, 'testKey')

      expect(result).toEqual(mockValue)
    })
  })

  describe('set', () => {
    it('should set value in Redis', async () => {
      await set(mockRequest, 'testKey', mockValue)

      const result = await mockClient.get(mockTestKey)

      expect(result).toEqual(mockValue)
    })
  })

  describe('delete', () => {
    it('should delete value from Redis', async () => {
      await mockClient.setex(mockTestKey, mockTTLValue, mockValue)

      await deleteItem(mockRequest, 'testKey')

      const result = await mockClient.get(mockTestKey) // ?

      expect(result).toBe(undefined)
    })
  })

  describe('deleteSessionData', () => {
    it('should delete all session data from Redis', async () => {
      await mockClient.setex(`${mockTestKey}1`, mockTTLValue, mockValue)
      await mockClient.setex(`${mockTestKey}2`, mockTTLValue, mockValue)

      await deleteSessionData(mockRequest)

      const result1 = await mockClient.get(`${mockTestKey}1`)
      const result2 = await mockClient.get(`${mockTestKey}2`)

      expect(result1).toBe(undefined)
      expect(result2).toBe(undefined)
    })
  })

  describe('isJsonString', () => {
    it('should correctly identify JSON strings', () => {
      expect(isJsonString('{"key": "value"}')).toBe(true)
      expect(isJsonString('["value1", "value2"]')).toBe(true)
      expect(isJsonString('not a JSON string')).toBe(false)
      expect(isJsonString('123')).toBe(false)
      // expect(isJsonString('')).toBe(false)
    })
  })

  describe('isBooleanString', () => {
    it('should correctly identify boolean strings', () => {
      expect(isBooleanString('true')).toBe(true)
      expect(isBooleanString('false')).toBe(true)
      expect(isBooleanString('True')).toBe(true)
      expect(isBooleanString('False')).toBe(true)
      expect(isBooleanString('not a boolean')).toBe(false)
      // expect(isBooleanString('')).toBe(false)
    })
  })
})
