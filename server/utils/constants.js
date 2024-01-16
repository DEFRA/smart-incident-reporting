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
const LOCATION_MAP = 'location-map'
const API_OS_API_TOKEN = 'api/os-api-token'
const API_LOCATION = 'api/location'

const REPORT_WATER_POLUTION = 'report-water-pollution'

const routes = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY,
  ERROR,
  PUBLIC,
  HOME,
  LOCATION_MAP,
  API_OS_API_TOKEN,
  API_LOCATION,
  REPORT_WATER_POLUTION
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
  UNAUTHORIZED: 401,
  PAGE_NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  PAYLOAD_TOO_LARGE: 413,
  PROBLEM_WITH_SERVICE: 500,
  SERVICE_UNAVAILABLE: 503
}

export default Object.freeze({
  routes,
  views,
  statusCodes,
  urls,
  redisKeys
})
