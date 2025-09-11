let cache

function init (server) {
  cache = server.cache({
    cache: 'redis_cache',
    segment: 'media-upload', // name of the segment where were are storing values
    expiresIn: 7 * 24 * 60 * 60 * 1000 // milliseconds
  })
}

function set (key, value) {
  cache.set(key, value)
}

async function exists (key) {
  if (key === null || key === undefined) {
    return false
  }

  const val = await cache.get(key)
  return !(val === null)
}

function get (key) {
  return cache.get(key)
}

function drop (key) {
  cache.drop(key)
}

const mediaCache = {
  init,
  get,
  set,
  drop,
  exists
}

export default mediaCache
