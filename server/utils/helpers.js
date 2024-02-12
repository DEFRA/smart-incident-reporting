import constants from './constants.js'

const getErrorSummary = () => {
  return JSON.parse(JSON.stringify(constants.errorSummary))
}

export {
  getErrorSummary
}
