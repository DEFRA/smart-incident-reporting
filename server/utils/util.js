
const wreck = require('@hapi/wreck').defaults({
  timeout: 10000
})

function request (method, url, options, ext = false) {
  return wreck[method](url, options)
    .then(response => {
      const res = response.res
      const payload = response.payload

      if (res.statusCode !== 200) {
        const err = (payload || new Error('Unknown error'))
        throw err
      }

      return payload
    })
}
function get (url, options, ext = false) {
  return request('get', url, options, ext)
}

function post (url, options) {
  return request('post', url, options)
}
function getJson (url, ext = false) {
  return get(url, { json: true }, ext)
}
module.exports = {
  get,
  post,
  getJson,
  request
}
