const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

// Notices
const ACCESSIBILITY = 'notices/accessibility'
const COOKIES = 'notices/cookies'
const PRIVACY = 'notices/privacy'

const PUBLIC = 'public'
const WELCOME = 'welcome'
const HOME = 'home'
const INCIDENT_TYPE = 'incident-type'
const WATER_TYPE = 'water-quality/water-type'

const routes = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY,
  PUBLIC,
  WELCOME,
  HOME,
  INCIDENT_TYPE,
  WATER_TYPE
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
