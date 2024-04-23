const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

const phoneRegex = /^[\d-+()#]*$/

// Notices
const ACCESSIBILITY = 'accessibility'
const COOKIES = 'cookies'
const PRIVACY_NOTICE = 'privacy-notice'

const ERROR = 'error'
const PUBLIC = 'public'
const HOME = 'home'
const SERVICE_UNAVAILABLE = 'service-unavailable'
const REPORT_SENT = 'report-sent'
const FEEDBACK = 'feedback'
const FEEDBACK_SUCCESS = 'feedback-success'

const WATER_POLUTION = 'water-pollution'
const WATER_POLLUTION_WATER_FEATURE = 'water-pollution/water-feature'
const WATER_POLLUTION_LOCATION_DESCRIPTION = 'water-pollution/location-description'
const WATER_POLLUTION_WHEN = 'water-pollution/when'
const WATER_POLLUTION_POLLUTION_APPEARANCE = 'water-pollution/pollution-appearance'
const WATER_POLLUTION_LESS_THAN_10_METRES = 'water-pollution/less-than-10-metres'
const WATER_POLLUTION_LESS_THAN_100_SQ_METRES = 'water-pollution/less-than-100-sq-metres'
const WATER_POLLUTION_POLLUTION_AREA = 'water-pollution/pollution-area'
const WATER_POLLUTION_POLLUTION_LENGTH = 'water-pollution/pollution-length'
const WATER_POLLUTION_POLLUTION_WIDTH = 'water-pollution/pollution-width'
const WATER_POLLUTION_OTHER_INFORMATION = 'water-pollution/other-information'

const SMELL = 'smell'
const SMELL_LOCATION_OPTION = 'smell/location-option'
const SMELL_LOCATION_DESCRIPTION = 'smell/location-description'
const SMELL_LOCATION_ADDRESS = 'smell/location-address'
const SMELL_SOURCE = 'smell/smell-source'

// Meta data
const SUBMISSION_TIMESTAMP = 'submission-timestamp'

const views = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY_NOTICE,
  ERROR,
  PUBLIC,
  HOME,
  SERVICE_UNAVAILABLE,
  FEEDBACK,
  FEEDBACK_SUCCESS,
  REPORT_SENT,
  WATER_POLUTION,
  WATER_POLLUTION_WATER_FEATURE,
  WATER_POLLUTION_LOCATION_DESCRIPTION,
  WATER_POLLUTION_WHEN,
  WATER_POLLUTION_POLLUTION_APPEARANCE,
  WATER_POLLUTION_LESS_THAN_10_METRES,
  WATER_POLLUTION_LESS_THAN_100_SQ_METRES,
  WATER_POLLUTION_POLLUTION_AREA,
  WATER_POLLUTION_POLLUTION_LENGTH,
  WATER_POLLUTION_POLLUTION_WIDTH,
  WATER_POLLUTION_OTHER_INFORMATION,
  SMELL,
  SMELL_LOCATION_OPTION,
  SMELL_LOCATION_DESCRIPTION,
  SMELL_LOCATION_ADDRESS,
  SMELL_SOURCE
}

const routes = {
  ...views
}

for (const [key, value] of Object.entries(views)) {
  routes[key] = `/${value}`
}

const redisKeys = {
  ...views,
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

const errorSummary = {
  titleText: 'There is a problem',
  errorList: []
}

const waterFeatureLabels = {
  501: 'river',
  504: 'canal',
  505: 'watercourse',
  506: 'watercourse',
  507: 'watercourse'
}

export default Object.freeze({
  routes,
  views,
  statusCodes,
  urls,
  redisKeys,
  errorSummary,
  phoneRegex,
  waterFeatureLabels
})
