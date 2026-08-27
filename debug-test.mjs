import { submitPostRequest } from './server/__test-helpers__/server.js'
import constants from './server/utils/constants.js'

const url = constants.routes.SMELL_RECURRING
const response = await submitPostRequest(
  { url, payload: {} },
  constants.statusCodes.OK,
  {}
)

// Write part of the response that contains error text
const payload = response.payload
const errorIndex = payload.indexOf('There is a problem')
if (errorIndex > -1) {
  console.log('Found error summary, next 800 chars:')
  console.log(payload.substring(errorIndex, errorIndex + 800))
}

const selectIndex = payload.indexOf("Select 'yes'")
if (selectIndex > -1) {
  console.log('\nFound select yes text at index:', selectIndex)
} else {
  console.log("\n'Select yes' text not found - searching for 'Select':")
  const selectOnlyIndex = payload.indexOf('Select')
  if (selectOnlyIndex > -1) {
    console.log(payload.substring(selectOnlyIndex, selectOnlyIndex + 300))
  } else {
    console.log('Select not found either')
  }
}
