const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME: 'https://www.gov.uk/report-environmental-problem',
  GOV_UK_WATER_POLLUTION: 'https://www.gov.uk/report-water-pollution',
  GOV_UK_SMELL: 'https://www.gov.uk/report-smell',
  GOV_UK_ILLEGAL_FISHING: 'https://www.gov.uk/report-illegal-fishing-in-england',
  GOV_UK_BLOCKAGE: 'https://www.gov.uk/report-river-blockage'
}

const serviceNames = {
  DEFAULT: 'Report an environmental problem',
  WATER_POLLUTION: 'Report water pollution in England',
  SMELL: 'Report a smell from a waste facility, industrial site or farm in England',
  ILLEGAL_FISHING: 'Report illegal fishing in England',
  BLOCKAGE: 'Report a blockage in a river in England'
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
const WATER_POLLUTION_SMELL_DESCRIPTION = 'water-pollution/smell-description'

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
const SMELL_DESCRIPTION = 'smell/description'

const ILLEGAL_FISHING_START = 'illegal-fishing-start'
const ILLEGAL_FISHING = 'illegal-fishing'
const ILLEGAL_FISHING_WATER_FEATURE = 'illegal-fishing/water-feature'
const ILLEGAL_FISHING_ACTIVITY = 'illegal-fishing/activity'
const ILLEGAL_FISHING_CONTACT_OWNER_OR_POLICE = 'illegal-fishing/contact-owner-or-police'
const ILLEGAL_FISHING_ROD_LICENCE = 'illegal-fishing/rod-licence'
const ILLEGAL_FISHING_LOCATION_OPTION = 'illegal-fishing/location-option'
const ILLEGAL_FISHING_LOCATION_MAP = 'illegal-fishing/location-map'
const ILLEGAL_FISHING_LOCATION_DESCRIPTION = 'illegal-fishing/location-description'
const ILLEGAL_FISHING_WHEN = 'illegal-fishing/when'
const ILLEGAL_FISHING_EARLIER_TODAY = 'illegal-fishing/earlier-today'
const ILLEGAL_FISHING_YESTERDAY = 'illegal-fishing/yesterday'
const ILLEGAL_FISHING_DATE_BEFORE_YESTERDAY = 'illegal-fishing/date-before-yesterday'
const ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY = 'illegal-fishing/time-before-yesterday'
const ILLEGAL_FISHING_PEOPLE_FISHING = 'illegal-fishing/people-fishing'
const ILLEGAL_FISHING_NUMBER_OF_PEOPLE = 'illegal-fishing/number-of-people'
const ILLEGAL_FISHING_PEOPLE_DESCRIPTION = 'illegal-fishing/people-description'
const ILLEGAL_FISHING_DESCRIPTION_DETAILS = 'illegal-fishing/description-details'
const ILLEGAL_FISHING_ILLEGAL_EQUIPMENT = 'illegal-fishing/illegal-equipment'
const ILLEGAL_FISHING_TYPE_OF_FISH = 'illegal-fishing/type-of-fish'
const ILLEGAL_FISHING_FISH_TAKEN = 'illegal-fishing/fish-taken'
const ILLEGAL_FISHING_NUMBER_OF_FISH = 'illegal-fishing/number-of-fish'
const ILLEGAL_FISHING_CONTACT_DETAILS = 'illegal-fishing/contact-details'
const ILLEGAL_FISHING_IMAGES_OR_VIDEO = 'illegal-fishing/images-or-video'
const ILLEGAL_FISHING_OTHER_INFORMATION = 'illegal-fishing/other-information'

const BLOCKAGE_START = 'blockage-start'
const BLOCKAGE = 'blockage'
const BLOCKAGE_RIVER = 'blockage/river'
const BLOCKAGE_RIVER_NAME = 'blockage/river-name'
const BLOCKAGE_REPORT_DIRECTLY = 'blockage/report-directly'
const BLOCKAGE_TYPE = 'blockage/blockage-type'
const BLOCKAGE_LOCATION_OPTION = 'blockage/location-option'
const BLOCKAGE_LOCATION_MAP = 'blockage/location-map'
const BLOCKAGE_LOCATION_DESCRIPTION = 'blockage/location-description'
const BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL = 'blockage/location-description-optional'
const BLOCKAGE_EARLIER_TODAY = 'blockage/earlier-today'
const BLOCKAGE_YESTERDAY = 'blockage/yesterday'
const BLOCKAGE_DATE_BEFORE_YESTERDAY = 'blockage/date-before-yesterday'
const BLOCKAGE_TIME_BEFORE_YESTERDAY = 'blockage/time-before-yesterday'
const BLOCKAGE_WHEN = 'blockage/when'
const BLOCKAGE_HISTORY = 'blockage/history'
const BLOCKAGE_EXTENT = 'blockage/extent'
const BLOCKAGE_WATER_LEVEL = 'blockage/water-level'
const BLOCKAGE_FLOOD_RISK = 'blockage/flood-risk'
const BLOCKAGE_FLOOD_RISK_DANGER = 'blockage/flood-risk-danger'
const BLOCKAGE_OWNER = 'blockage/owner'
const BLOCKAGE_CONTACT_DETAILS = 'blockage/contact-details'
const BLOCKAGE_IMAGES_OR_VIDEO = 'blockage/images-or-video'
const BLOCKAGE_OTHER_INFORMATION = 'blockage/other-information'

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
    WATER_POLLUTION_START,
    SMELL_START,
    ILLEGAL_FISHING_START,
    BLOCKAGE_START
  }
}

const views = {
  HOME,
  ...viewsExtra,
  API_OS_API_TOKEN,
  API_LOCATION,
  API_LOCATION_SUGGESTIONS,
  ACCESSIBILITY,
  COOKIES,
  PRIVACY_NOTICE,
  ERROR,
  PUBLIC,
  FEEDBACK,
  FEEDBACK_SUCCESS,
  REPORT_SENT,
  WATER_POLLUTION,
  WATER_POLLUTION_WATER_FEATURE,
  WATER_POLLUTION_LOCATION_OPTION,
  WATER_POLLUTION_LOCATION_MAP,
  WATER_POLLUTION_LOCATION_DESCRIPTION,
  WATER_POLLUTION_WHEN,
  WATER_POLLUTION_EARLIER_TODAY,
  WATER_POLLUTION_YESTERDAY,
  WATER_POLLUTION_DATE_BEFORE_YESTERDAY,
  WATER_POLLUTION_TIME_BEFORE_YESTERDAY,
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
  WATER_POLLUTION_CHECK_YOUR_ANSWERS,
  WATER_POLLUTION_CONTACT_DETAILS,
  WATER_POLLUTION_SMELL_DESCRIPTION,
  SMELL,
  SMELL_LOCATION_HOME,
  SMELL_LOCATION_ADDRESS,
  SMELL_LOCATION_OPTION,
  SMELL_PREVIOUS,
  SMELL_LOCATION_MAP,
  SMELL_LOCATION_DESCRIPTION,
  SMELL_START_DATE_TIME,
  SMELL_EARLIER_TODAY,
  SMELL_YESTERDAY,
  SMELL_DATE_BEFORE_YESTERDAY,
  SMELL_TIME_BEFORE_YESTERDAY,
  SMELL_SOURCE,
  SMELL_REPORT_LOCAL_COUNCIL,
  SMELL_CONTACT_LOCAL_COUNCIL,
  SMELL_SOURCE_DETAILS,
  SMELL_CURRENT,
  SMELL_SMELL_STRENGTH,
  SMELL_INDOORS,
  SMELL_CLOTHING_AND_HAIR,
  SMELL_EFFECT_ON_DAILY_LIFE,
  SMELL_EFFECT_ON_HEALTH,
  SMELL_MEDICAL_HELP,
  SMELL_CONTACT_DETAILS,
  SMELL_IMAGES_OR_VIDEO,
  SMELL_OTHER_INFORMATION,
  SMELL_FIND_ADDRESS,
  SMELL_CHOOSE_ADDRESS,
  SMELL_CONFIRM_ADDRESS,
  SMELL_EXCEEDED_ATTEMPTS,
  SMELL_DESCRIPTION,
  ILLEGAL_FISHING,
  ILLEGAL_FISHING_WATER_FEATURE,
  ILLEGAL_FISHING_ACTIVITY,
  ILLEGAL_FISHING_CONTACT_OWNER_OR_POLICE,
  ILLEGAL_FISHING_ROD_LICENCE,
  ILLEGAL_FISHING_LOCATION_OPTION,
  ILLEGAL_FISHING_LOCATION_MAP,
  ILLEGAL_FISHING_LOCATION_DESCRIPTION,
  ILLEGAL_FISHING_WHEN,
  ILLEGAL_FISHING_EARLIER_TODAY,
  ILLEGAL_FISHING_YESTERDAY,
  ILLEGAL_FISHING_DATE_BEFORE_YESTERDAY,
  ILLEGAL_FISHING_TIME_BEFORE_YESTERDAY,
  ILLEGAL_FISHING_PEOPLE_FISHING,
  ILLEGAL_FISHING_NUMBER_OF_PEOPLE,
  ILLEGAL_FISHING_PEOPLE_DESCRIPTION,
  ILLEGAL_FISHING_DESCRIPTION_DETAILS,
  ILLEGAL_FISHING_ILLEGAL_EQUIPMENT,
  ILLEGAL_FISHING_TYPE_OF_FISH,
  ILLEGAL_FISHING_FISH_TAKEN,
  ILLEGAL_FISHING_NUMBER_OF_FISH,
  ILLEGAL_FISHING_CONTACT_DETAILS,
  ILLEGAL_FISHING_IMAGES_OR_VIDEO,
  ILLEGAL_FISHING_OTHER_INFORMATION,
  BLOCKAGE,
  BLOCKAGE_RIVER,
  BLOCKAGE_RIVER_NAME,
  BLOCKAGE_REPORT_DIRECTLY,
  BLOCKAGE_TYPE,
  BLOCKAGE_LOCATION_OPTION,
  BLOCKAGE_LOCATION_MAP,
  BLOCKAGE_LOCATION_DESCRIPTION,
  BLOCKAGE_LOCATION_DESCRIPTION_OPTIONAL,
  BLOCKAGE_WHEN,
  BLOCKAGE_EARLIER_TODAY,
  BLOCKAGE_YESTERDAY,
  BLOCKAGE_DATE_BEFORE_YESTERDAY,
  BLOCKAGE_TIME_BEFORE_YESTERDAY,
  BLOCKAGE_HISTORY,
  BLOCKAGE_EXTENT,
  BLOCKAGE_WATER_LEVEL,
  BLOCKAGE_FLOOD_RISK,
  BLOCKAGE_FLOOD_RISK_DANGER,
  BLOCKAGE_OWNER,
  BLOCKAGE_CONTACT_DETAILS,
  BLOCKAGE_IMAGES_OR_VIDEO,
  BLOCKAGE_OTHER_INFORMATION
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
  serviceNames,
  redisKeys,
  errorSummary,
  phoneRegex,
  waterFeatureLabels,
  setReferer,
  clearReferer
})
