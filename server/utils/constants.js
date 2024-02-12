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
const WATER_POLLUTION_WATER_FEATURE = 'water-pollution/water-feature'
const WATER_POLLUTION_POLLUTION_AREA = 'water-pollution/pollution-area'
const WATER_POLLUTION_POLLUTION_LENGTH = 'water-pollution/pollution-length'
const WATER_POLLUTION_OTHER_INFORMATION = 'water-pollution/other-information'

// Meta data
const SUBMISSION_TIMESTAMP = 'submission-timestamp'

const views = {
  ACCESSIBILITY,
  COOKIES,
  PRIVACY,
  ERROR,
  PUBLIC,
  HOME,
  REPORT_SENT,
  WATER_POLUTION,
  WATER_POLLUTION_WATER_FEATURE,
  WATER_POLLUTION_POLLUTION_AREA,
  WATER_POLLUTION_POLLUTION_LENGTH,
  WATER_POLLUTION_OTHER_INFORMATION
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

const questions = {
  WATER_POLLUTION_WATER_FEATURE: {
    questionId: 500,
    text: 'In what kind of water is the pollution?',
    answers: {
      river: {
        answerId: 501,
        text: 'A river'
      },
      lakeOrReservoir: {
        answerId: 502,
        text: 'A lake or reservoir'
      },
      sea: {
        answerId: 503,
        text: 'The sea'
      },
      canal: {
        answerId: 504,
        text: 'A canal'
      },
      smallWatercourse: {
        answerId: 505,
        text: 'A smaller stream or watercourse'
      },
      somethingElse: {
        answerId: 506,
        text: 'Something else'
      },
      doNotKnow: {
        answerId: 507,
        text: 'You do not know'
      },
      somethingElseDetails: {
        answerId: 508
      }
    }
  }
}

export default Object.freeze({
  routes,
  views,
  statusCodes,
  urls,
  redisKeys,
  errorSummary,
  phoneRegex,
  questions
})
