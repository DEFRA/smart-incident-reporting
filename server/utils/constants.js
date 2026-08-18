import rarsConstants from './rars-constants.js'

// UPDATE URLS
const serviceHome = 'https://www.gov.uk/report-environmental-problem'
const urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME: serviceHome,
  GOV_UK_WATER_POLLUTION: 'https://www.gov.uk/report-water-pollution',
  GOV_UK_SMELL: 'https://www.gov.uk/report-smell',
  GOV_UK_ILLEGAL_FISHING: 'https://www.gov.uk/report-illegal-fishing-in-england',
  GOV_UK_BLOCKAGE: 'https://www.gov.uk/report-river-blockage',
  GOV_UK_NOISE: serviceHome,
  GOV_UK_LITTER: serviceHome,
  GOV_UK_VERMIN: serviceHome,
  GOV_UK_DUST: serviceHome,
  GOV_UK_MUD: serviceHome
}

const serviceNames = {
  DEFAULT: 'Report an environmental problem',
  WATER_POLLUTION: 'Report water pollution in England',
  SMELL: 'Report a smell from a waste facility, industrial site or farm in England',
  ILLEGAL_FISHING: 'Report illegal fishing in England',
  BLOCKAGE: 'Report a blockage in a river in England',
  NOISE: 'Report noise from a waste facility, industrial site or farm in England',
  LITTER: 'Report litter from a waste facility, industrial site or farm in England',
  VERMIN: 'Report vermin or pest problem from a waste facility, industrial site or farm in England',
  DUST: 'Report dust from a waste facility, industrial site or farm in England',
  MUD: 'Report mud from a waste facility, industrial site or farm in England'
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
const OS_TERMS = 'os-terms'

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
const WATER_POLLUTION_HEALTH = 'water-pollution/health'

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
const ILLEGAL_FISHING_ANGLING_TRUST = 'illegal-fishing/angling-trust'
const ILLEGAL_FISHING_HEALTH = 'illegal-fishing/health'

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
const BLOCKAGE_HEALTH = 'blockage/health'

const NOISE_START = 'noise-start'
const LITTER_START = 'litter-start'
const VERMIN_START = 'vermin-start'
const DUST_START = 'dust-start'
const MUD_START = 'mud-start'
const SMELL_START = 'smell-start'

const VERMIN_TYPE = 'vermin/type'

const SMELL_HEALTH = 'smell/health'

// Testing helper pages
const TEST_MEDIA_UPLOAD_SUBMIT = 'test-media-upload-submit'

// Meta data
const SUBMISSION_TIMESTAMP = 'submission-timestamp'
const REFERER = 'referer'
const COUNTER = 'counter'
// const SMELL_POSTCODE_DETAILS = 'smell-postcode-details'
const DATE_TIME_OPTION = 'date-time-option'
const QUESTION_SET_ID = 'question-set-id'
const VERMIN_TYPE_SELECTED = 'vermin-type-selected'

// Configs to add additional home/start pages on non-production environments
let viewsExtra = {}
if (process.env.REGISTER_START_ROUTES === 'true') {
  viewsExtra = {
    WATER_POLLUTION_START,
    SMELL_START,
    ILLEGAL_FISHING_START,
    BLOCKAGE_START,
    NOISE_START,
    LITTER_START,
    VERMIN_START,
    DUST_START,
    MUD_START,
    TEST_MEDIA_UPLOAD_SUBMIT
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
  OS_TERMS,
  ERROR,
  PUBLIC,
  FEEDBACK,
  FEEDBACK_SUCCESS,
  REPORT_SENT,
  WATER_POLLUTION_HEALTH,
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
  ILLEGAL_FISHING_HEALTH,
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
  ILLEGAL_FISHING_ANGLING_TRUST,
  BLOCKAGE_HEALTH,
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
  BLOCKAGE_OTHER_INFORMATION,
  SMELL_HEALTH,
  VERMIN_TYPE
}

const routes = {
  ...views
}

for (const [key, value] of Object.entries(views)) {
  routes[key] = `/${value}`
}

const redisKeys = {
  ...views,
  ...rarsConstants.redisKeys,
  SUBMISSION_TIMESTAMP,
  REFERER,
  COUNTER,
  // SMELL_POSTCODE_DETAILS,
  DATE_TIME_OPTION,
  QUESTION_SET_ID,
  VERMIN_TYPE_SELECTED
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
const clearReferer = []

const extendedRoutes = {
  ...routes,
  ...rarsConstants.routes
}

const extendedViews = {
  ...views,
  ...rarsConstants.views
}

export default Object.freeze({
  routes: extendedRoutes,
  views: extendedViews,
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
