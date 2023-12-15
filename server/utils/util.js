const wreck = require('@hapi/wreck').defaults({
  timeout: 10000
})

const makeRequest = async (method, url, options, _ext = false) => {
  const response = await wreck[method](url, options)
  const { res, payload } = response
  if (res.statusCode !== 200) {
    if (payload) {
      throw payload
    }
    throw new Error('Unknown error')
  }
  return payload
}

const get = async (url, options, ext = false) =>
  makeRequest('get', url, options, ext)

const post = async (url, options) => makeRequest('post', url, options)

const getJson = async (url, ext = false) => get(url, { json: true }, ext)

module.exports = {
  get,
  post,
  getJson,
  makeRequest
}
