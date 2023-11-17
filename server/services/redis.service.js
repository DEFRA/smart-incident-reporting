'use strict'

const { SI_SESSION_KEY } = require('../utils/constants')

const config = require('../utils/config')

const REDIS_TTL_IN_SECONDS = config.cookieTimeout / 1000

module.exports = class RedisService {
  static async get(request, key) {
    const client = request.redis.client
    const redisValue = await client.get(
      `${request.state[SI_SESSION_KEY]}.${key}`
    )

    let parsedValue = redisValue

    if (_isBooleanString(redisValue)) {
      parsedValue = redisValue.toLowerCase() === 'true'
    } else if (_isJsonString(redisValue)) {
      try {
        parsedValue = JSON.parse(redisValue)
      } catch (e) {
        parsedValue = redisValue
      }
    }
    return parsedValue
  }

  static set(request, key, value) {
    const client = request.redis.client
    const keyWithSessionId = `${request.state[SI_SESSION_KEY]}.${key}`

    try {
      return client.setex(keyWithSessionId, REDIS_TTL_IN_SECONDS, value)
    } catch (err) {
      console.error(err.message)
      return false
    }
  }

  static delete(request, key) {
    const client = request.redis.client
    const keyWithSessionId = `${request.state[SI_SESSION_KEY]}.${key}`
    client.del(keyWithSessionId)
  }

  static async deleteSessionData(request) {
    const client = request.redis.client
    const keys = await _getMatchingRedisKeys(request)
    for (const key of keys) {
      client.del(key)
    }
  }
}

/**
 * Checks a string value to see if it looks like a Json object i.e. begins and ends with curly brackets
 * @param {*} value The string value to be chekced
 * @returns True if the string looks like a Json object, otherwise false
 */
const _isJsonString = (value) =>
  value &&
  value.length &&
  ((value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']')))

/**
 * Checks a string value to see if it contains a bolean i.e. 'true' or 'false'
 * @param {*} value The string value to be chekced
 * @returns True if the string contains a bolean, otherwise false
 */

const _isBooleanString = (value) =>
  value &&
  value.length &&
  (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')

/**
 * Scans the Redis cache for all keys matching the session key held in the session.
 * The Redis scan function returns a cursor and a set of results. The scan function
 * needs to be called repeatedly until the cursor is back to 0.
 * @param {*} request The request containing the Redis cache
 * @returns An array of Redis keys that are prefixed with the session key
 */
const _getMatchingRedisKeys = async (request) => {
  const client = request.redis.client
  const sessionKey = request.state[SI_SESSION_KEY]

  const keys = []

  let scanResult = await client.scan('0', 'MATCH', `${sessionKey}.*`)
  let cursor = scanResult[0]

  keys.push(...scanResult[1])

  while (cursor !== '0') {
    scanResult = await client.scan(cursor, 'MATCH', `${sessionKey}.*`)
    cursor = scanResult[0]
    keys.push(...scanResult[1])
  }

  return keys
}
