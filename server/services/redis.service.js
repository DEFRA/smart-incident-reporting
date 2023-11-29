'use strict'

const { SI_SESSION_KEY } = require('../utils/constants')

const config = require('../utils/config')

const REDIS_TTL_IN_SECONDS = config.cookieTimeout / 1000

const getRedisClient = (request) => request.redis.client

const getSessionKey = (request) => request.state[SI_SESSION_KEY]

const get = async (request, key) => {
  const client = getRedisClient(request)

  try {
    const redisValue = await client.get(`${getSessionKey(request)}.${key}`)

    let parsedValue = redisValue

    if (isBooleanString(redisValue)) {
      parsedValue = redisValue.toLowerCase() === 'true'
    } else if (isJsonString(redisValue)) {
      try {
        parsedValue = JSON.parse(redisValue)
      } catch (e) {
        parsedValue = redisValue
      }
    }
    return parsedValue
  } catch (err) {
    console.error(err)
    return false
  }
}

const set = async (request, key, value) => {
  const client = getRedisClient(request)
  const keyWithSessionId = `${getSessionKey(request)}.${key}`

  try {
    return client.setex(keyWithSessionId, REDIS_TTL_IN_SECONDS, value)
  } catch (err) {
    console.error(err)
    return false
  }
}

const deleteItem = async (request, key) => {
  const client = getRedisClient(request)
  const keyWithSessionId = `${getSessionKey(request)}.${key}`

  try {
    await client.del(keyWithSessionId)
  } catch (err) {
    console.error(err)
    return false
  }
}

const deleteSessionData = async (request) => {
  const client = getRedisClient(request)
  const keys = await getMatchingRedisKeys(request)

  try {
    for (const key of keys) {
      await client.del(key)
    }
  } catch (err) {
    console.error(err)
    return false
  }
}
/**
 * Checks a string value to see if it looks like a Json object i.e. begins and ends with curly brackets
 * @param {*} value The string value to be chekced
 * @returns True if the string looks like a Json object, otherwise false
 */
const isJsonString = (value) =>
  value &&
  value.length &&
  ((value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']')))

/**
 * Checks a string value to see if it contains a bolean i.e. 'true' or 'false'
 * @param {*} value The string value to be chekced
 * @returns True if the string contains a bolean, otherwise false
 */

const isBooleanString = (value) =>
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
const getMatchingRedisKeys = async (request) => {
  const client = getRedisClient(request)
  const sessionKey = getSessionKey(request)

  const keys = []

  let scanResult = await client.scan('0', 'MATCH', `${sessionKey}.*`)
  let cursor = scanResult[0]

  keys.push(...scanResult[1]) //?

  while (cursor !== '0') {
    scanResult = await client.scan(cursor, 'MATCH', `${sessionKey}.*`)
    cursor = scanResult[0]
    keys.push(...scanResult[1])
  }

  return keys
}

module.exports = {
  get,
  set,
  delete: deleteItem,
  deleteSessionData,
  getMatchingRedisKeys,
  isJsonString,
  isBooleanString
}
