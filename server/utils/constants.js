const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

const phoneRegex = /^[\d-+()#]*$/

// API
const API_OS_API_TOKEN = 'api/os-api-token'
const API_LOCATION = 'api/location'
const API_LOCATION_SUGGESTIONS = 'api/location-suggestions'

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
const WATER_POLLUTION_LOCATION_OPTION = 'water-pollution/location-option'
const WATER_POLLUTION_LOCATION_MAP = 'water-pollution/location-map'
const WATER_POLLUTION_LOCATION_DESCRIPTION = 'water-pollution/location-description'
const WATER_POLLUTION_WHEN = 'water-pollution/when'
const WATER_POLLUTION_POLLUTION_SUBSTANCE = 'water-pollution/pollution-substance'
const WATER_POLLUTION_POLLUTION_APPEARANCE = 'water-pollution/pollution-appearance'
const WATER_POLLUTION_SOURCE = 'water-pollution/source'
const WATER_POLLUTION_IMAGES_OR_VIDEO = 'water-pollution/images-or-video'
const WATER_POLLUTION_LESS_THAN_10_METRES = 'water-pollution/less-than-10-metres'
const WATER_POLLUTION_LESS_THAN_100_SQ_METRES = 'water-pollution/less-than-100-sq-metres'
const WATER_POLLUTION_POLLUTION_AREA = 'water-pollution/pollution-area'
const WATER_POLLUTION_POLLUTION_LENGTH = 'water-pollution/pollution-length'
const WATER_POLLUTION_EFFECT_ON_WILDLIFE = 'water-pollution/effect-on-wildlife'
const WATER_POLLUTION_OTHER_INFORMATION = 'water-pollution/other-information'

const SMELL = 'smell'
const SMELL_LOCATION_HOME = 'smell/location-home'
const SMELL_LOCATION_ADDRESS = 'smell/location-address'
const SMELL_LOCATION_OPTION = 'smell/location-option'
const SMELL_PREVIOUS = 'smell/previous'
const SMELL_LOCATION_MAP = 'smell/location-map'
const SMELL_LOCATION_DESCRIPTION = 'smell/location-description'
const SMELL_START_DATE_TIME = 'smell/start-date-time'
const SMELL_CURRENT = 'smell/current'
const SMELL_SMELL_STRENGTH = 'smell/smell-strength'
const SMELL_INDOORS = 'smell/indoors'
const SMELL_CLOTHING_AND_HAIR = 'smell/clothing-and-hair'
const SMELL_SOURCE = 'smell/source'
const SMELL_REPORT_LOCAL_COUNCIL = 'smell/report-local-council'
const SMELL_CONTACT_LOCAL_COUNCIL = 'smell/contact-local-council'
const SMELL_SOURCE_DETAILS = 'smell/source-details'
const SMELL_CONTACT = 'smell/contact'
const SMELL_IMAGES_OR_VIDEO = 'smell/images-or-video'
const SMELL_OTHER_INFORMATION = 'smell/other-information'

// Meta data
const SUBMISSION_TIMESTAMP = 'submission-timestamp'

const views = {
  API_OS_API_TOKEN,
  API_LOCATION,
  API_LOCATION_SUGGESTIONS,
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
  WATER_POLLUTION_LOCATION_OPTION,
  WATER_POLLUTION_LOCATION_MAP,
  WATER_POLLUTION_LOCATION_DESCRIPTION,
  WATER_POLLUTION_WHEN,
  WATER_POLLUTION_POLLUTION_SUBSTANCE,
  WATER_POLLUTION_POLLUTION_APPEARANCE,
  WATER_POLLUTION_SOURCE,
  WATER_POLLUTION_IMAGES_OR_VIDEO,
  WATER_POLLUTION_LESS_THAN_10_METRES,
  WATER_POLLUTION_LESS_THAN_100_SQ_METRES,
  WATER_POLLUTION_POLLUTION_AREA,
  WATER_POLLUTION_POLLUTION_LENGTH,
  WATER_POLLUTION_EFFECT_ON_WILDLIFE,
  WATER_POLLUTION_OTHER_INFORMATION,
  SMELL,
  SMELL_LOCATION_HOME,
  SMELL_LOCATION_ADDRESS,
  SMELL_LOCATION_OPTION,
  SMELL_PREVIOUS,
  SMELL_LOCATION_MAP,
  SMELL_LOCATION_DESCRIPTION,
  SMELL_START_DATE_TIME,
  SMELL_SOURCE,
  SMELL_REPORT_LOCAL_COUNCIL,
  SMELL_CONTACT_LOCAL_COUNCIL,
  SMELL_SOURCE_DETAILS,
  SMELL_CURRENT,
  SMELL_SMELL_STRENGTH,
  SMELL_INDOORS,
  SMELL_CLOTHING_AND_HAIR,
  SMELL_CONTACT,
  SMELL_IMAGES_OR_VIDEO,
  SMELL_OTHER_INFORMATION
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
