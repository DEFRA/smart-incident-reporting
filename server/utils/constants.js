const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

const phoneRegex = /^[\s\d-+()#]*$/

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
const REPORT_SENT = 'report-sent'
const FEEDBACK = 'feedback'
const FEEDBACK_SUCCESS = 'feedback-success'

const WATER_POLLUTION_START = 'water-pollution-start'
const WATER_POLLUTION = 'water-pollution'
const WATER_POLLUTION_WATER_FEATURE = 'water-pollution/water-feature'
const WATER_POLLUTION_LOCATION_OPTION = 'water-pollution/location-option'
const WATER_POLLUTION_LOCATION_MAP = 'water-pollution/location-map'
const WATER_POLLUTION_LOCATION_DESCRIPTION = 'water-pollution/location-description'
const WATER_POLLUTION_WHEN = 'water-pollution/when'
const WATER_POLLUTION_EARLIER_TODAY = 'water-pollution/earlier-today'
const WATER_POLLUTION_YESTERDAY = 'water-pollution/yesterday'
const WATER_POLLUTION_DATE_BEFORE_YESTERDAY = 'water-pollution/date-before-yesterday'
const WATER_POLLUTION_TIME_BEFORE_YESTERDAY = 'water-pollution/time-before-yesterday'
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
const WATER_POLLUTION_CHECK_YOUR_ANSWERS = 'water-pollution/check-your-answers'
const WATER_POLLUTION_CONTACT_DETAILS = 'water-pollution/contact-details'

const SMELL_START = 'smell-start'
const SMELL = 'smell'
const SMELL_LOCATION_HOME = 'smell/location-home'
const SMELL_LOCATION_ADDRESS = 'smell/location-address'
const SMELL_LOCATION_OPTION = 'smell/location-option'
const SMELL_PREVIOUS = 'smell/previous'
const SMELL_LOCATION_MAP = 'smell/location-map'
const SMELL_LOCATION_DESCRIPTION = 'smell/location-description'
const SMELL_START_DATE_TIME = 'smell/start-date-time'
const SMELL_EARLIER_TODAY = 'smell/earlier-today'
const SMELL_YESTERDAY = 'smell/yesterday'
const SMELL_DATE_BEFORE_YESTERDAY = 'smell/date-before-yesterday'
const SMELL_TIME_BEFORE_YESTERDAY = 'smell/time-before-yesterday'
const SMELL_CURRENT = 'smell/current'
const SMELL_SMELL_STRENGTH = 'smell/smell-strength'
const SMELL_INDOORS = 'smell/indoors'
const SMELL_CLOTHING_AND_HAIR = 'smell/clothing-and-hair'
const SMELL_EFFECT_ON_DAILY_LIFE = 'smell/effect-on-daily-life'
const SMELL_EFFECT_ON_HEALTH = 'smell/effect-on-health'
const SMELL_MEDICAL_HELP = 'smell/medical-help'
const SMELL_SOURCE = 'smell/source'
const SMELL_REPORT_LOCAL_COUNCIL = 'smell/report-local-council'
const SMELL_CONTACT_LOCAL_COUNCIL = 'smell/contact-local-council'
const SMELL_SOURCE_DETAILS = 'smell/source-details'
const SMELL_CONTACT_DETAILS = 'smell/contact-details'
const SMELL_IMAGES_OR_VIDEO = 'smell/images-or-video'
const SMELL_OTHER_INFORMATION = 'smell/other-information'
const SMELL_FIND_ADDRESS = 'smell/find-address'
const SMELL_CHOOSE_ADDRESS = 'smell/choose-address'
const SMELL_CONFIRM_ADDRESS = 'smell/confirm-address'
const SMELL_EXCEEDED_ATTEMPTS = 'smell/exceeded-attempts'

// Meta data
const SUBMISSION_TIMESTAMP = 'submission-timestamp'
const REFERER = 'referer'
const COUNTER = 'counter'
const SMELL_POSTCODE_DETAILS = 'smell-postcode-details'
const DATE_TIME_OPTION = 'date-time-option'
const QUESTION_SET_ID = 'question-set-id'

// Configs to add additional home/start pages on non-production environments
let viewsExtra = {}
if (process.env.REGISTER_START_ROUTES === 'true') {
  viewsExtra = {
    HOME,
    WATER_POLLUTION_START,
    SMELL_START
  }
}

const views = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY_NOTICE,
  ERROR,
  PUBLIC,
  HOME
}

const routes = {
  ...views
}

for (const [key, value] of Object.entries(views)) {
  routes[key] = `/${value}`
}

const redisKeys = {
  ...views,
  SUBMISSION_TIMESTAMP,
  REFERER,
  COUNTER,
  SMELL_POSTCODE_DETAILS,
  DATE_TIME_OPTION,
  QUESTION_SET_ID
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

// Pages that set a referrer to return to after next page completion
const setReferer = [
  WATER_POLLUTION_CHECK_YOUR_ANSWERS
]

// Pages that clear a referrer to break the above chain
const clearReferer = [

]

export default Object.freeze({
  routes,
  views,
  statusCodes,
  urls,
  redisKeys,
  errorSummary,
  phoneRegex,
  waterFeatureLabels,
  setReferer,
  clearReferer
})
