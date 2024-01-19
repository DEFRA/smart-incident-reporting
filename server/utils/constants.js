const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

// Notices
const ACCESSIBILITY = 'notices/accessibility'
const COOKIES = 'notices/cookies'
const PRIVACY = 'notices/privacy'

const ERROR = 'error'
const PUBLIC = 'public'
const HOME = 'home'

const REPORT_WATER_POLUTION = 'report-water-pollution'
const WATER_QUALITY_DESCRIBE_THE_POLLUTION = 'waterquality/describe-the-pollution'

const routes = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY,
  ERROR,
  PUBLIC,
  HOME,
  REPORT_WATER_POLUTION,
  WATER_QUALITY_DESCRIBE_THE_POLLUTION
}

const views = {
  ...routes
}

for (const [key, value] of Object.entries(routes)) {
  routes[key] = `/${value}`
}

const redisKeys = {
  ...routes
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
  errors
})
