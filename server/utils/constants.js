const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

const phoneRegex = /^[\d-+()#]*$/

// Notices
const ACCESSIBILITY = 'notices/accessibility'
const COOKIES = 'notices/cookies'
const PRIVACY = 'notices/privacy'

const ERROR = 'error'
const PUBLIC = 'public'
const HOME = 'home'
const REPORT_SENT = 'report-sent'

const WATER_POLUTION = 'water-pollution'
const WATER_POLLUTION_OTHER_INFORMATION = 'water-pollution/other-information'

// Meta data
const SUBMISSION_TIMESTAMP = 'submission-timestamp'

const routes = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY,
  ERROR,
  PUBLIC,
  HOME,
  REPORT_SENT,
  WATER_POLUTION,
  WATER_POLLUTION_OTHER_INFORMATION
}

const views = {
  ...routes
}

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

const redisKeys = {
  ...routes,
  SUBMISSION_TIMESTAMP
}

const statusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  REDIRECT: 302,
  UNAUTHORIZED: 401,
  PAGE_NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  PAYLOAD_TOO_LARGE: 413,
  PROBLEM_WITH_SERVICE: 500,
  SERVICE_UNAVAILABLE: 503
}

const errors = {
  errorSummary: {
    titleText: 'There is a problem',
    errorList: []
  }
}

export default Object.freeze({
  routes,
  views,
  statusCodes,
  urls,
  redisKeys,
  errors,
  phoneRegex
})
