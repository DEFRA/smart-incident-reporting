'use strict'

const HOME_URL = '/'

const Urls = {
  GOV_UK_HOME: 'https://www.gov.uk',
  GOV_UK_SERVICE_HOME:
    'https://www.gov.uk/report-an-environmental-incident'
}

const Paths = {
  WELCOME: '/welcome',
  PAGE_NOT_FOUND: '/errors/page-not-found',
  PROBLEM_WITH_SERVICE: '/errors/problem-with-service',
  SERVICE_UNAVAILABLE: '/errors/service-unavailable',
  INCIDENT_TYPE: '/incident-type',
  WATER_TYPE: '/water-quality/water-type',
  LOCATION: '/location',
  SUCCESS: '/success'
}

const Views = {
  SERVICE_UNAVAILABLE: 'errors/service-unavailable',
  SESSION_TIMED_OUT: 'errors/session-timed-out',
  WELCOME: 'welcome',
  INCIDENT_TYPE: 'incident-type',
  WATER_TYPE: 'water-quality/watertype',
  LOCATION: 'location',
  SUCCESS: 'success'
}

const StatusCodes = {
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

module.exports = Object.freeze({
  HOME_URL,
  Paths,
  StatusCodes,
  Urls,
  Views
})
