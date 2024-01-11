import { getServer } from '../../.jest/setup.js'
import onPreAuth from './on-pre-auth.js'

const submitGetRequest = async (options, expectedResponseCode = 200, sessionData = {}) => {
  if (Object.keys(sessionData).length > 0) {
    await addOnPreAuth(sessionData)
  }
  options.method = 'GET'
  return submitRequest(options, expectedResponseCode)
}

const submitPostRequest = async (options, expectedResponseCode = 302, sessionData = {}) => {
  if (Object.keys(sessionData).length > 0) {
    await addOnPreAuth(sessionData)
  }
  options.method = 'POST'
  return submitRequest(options, expectedResponseCode)
}

const submitRequest = async (options, expectedResponseCode) => {
  const response = await getServer().inject(options)
  expect(response.statusCode).toBe(expectedResponseCode)
  return response
}

const addOnPreAuth = async sessionData => {
  // Add session injection using on pre auth functionality.
  // This shoud be done using a pre handler but only one pre handler can be registered
  // with a Hapi.js server.
  // Using on pre auth functionaliy is acceptable for testing purposes.
  await getServer().register(onPreAuth(sessionData))
}

export {
  submitGetRequest,
  submitPostRequest
}
