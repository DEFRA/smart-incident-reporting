import constants from '../utils/constants.js'
import config from '../utils/config.js'
const { SI_SESSION_KEY } = constants

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
    throw new Error('Failed to retrieve value from Redis')
  }
}

const set = async (request, key, value) => {
  const client = getRedisClient(request)
  const keyWithSessionId = `${getSessionKey(request)}.${key}`

  try {
    await client.setex(keyWithSessionId, REDIS_TTL_IN_SECONDS, value)

    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

const deleteItem = async (request, key) => {
  const client = getRedisClient(request)
  const keyWithSessionId = `${getSessionKey(request)}.${key}` // ?

  try {
    await client.del(keyWithSessionId)

    return true
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

    return true
  } catch (err) {
    console.error(err)

    throw new Error('Failed to delete session data from Redis')
  }
}

const isJsonString = (value) =>
  value &&
  value.length &&
  ((value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']')))

const isBooleanString = (value) =>
  value &&
  value.length &&
  (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')

const getMatchingRedisKeys = async (request) => {
  const client = getRedisClient(request)
  const sessionKey = getSessionKey(request)

  const keys = []

  try {
    let cursor = '0'
    do {
      const scanResult = await client.scan(cursor, 'MATCH', `${sessionKey}.*`)
      cursor = scanResult[0]
      keys.push(...scanResult[1])
    } while (cursor !== '0')
  } catch (err) {
    console.error(err)

    throw new Error('Failed to get matching Redis keys')
  }

  return keys
}

export default {
  get,
  set,
  delete: deleteItem,
  deleteSessionData,
  getMatchingRedisKeys,
  isJsonString,
  isBooleanString
}
