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
  WATER_TYPE_ANSWER: '/water-quality/water-type-answer',
  WATER_TYPE_LOCATION: '/water-quality/location',
  WATER_TYPE_LOCATION_ANSWER: '/water-quality/location-answer',
  WATER_TYPE_SUBSTANCE: '/water-quality/substance',
  WATER_TYPE_SUBSTANCE_ANSWER: '/water-quality/substanceSubmit',
  WATER_TYPE_APPEARANCE: '/water-quality/appearance',
  WATER_TYPE_APPEARANCE_ANSWER: '/water-quality/appearance-answer',
  WATER_TYPE_SOURCE: '/water-quality/source',
  WATER_TYPE_SOURCE_ANSWER: '/water-quality/source-answer',
  WATER_TYPE_EXTENT: '/water-quality/extent',
  WATER_TYPE_EXTENT_ANSWER: '/water-quality/extent-answer',
  WATER_TYPE_EXTENT_TWO: '/water-quality/extent02',
  WATER_TYPE_EXTENT_TWO_ANSWER: '/water-quality/extent-two-answer',
  WATER_TYPE_AQUATICLIFE: '/water-quality/impact/aquaticlife',
  WATER_TYPE_AQUATICLIFE_ANSWER: '/water-quality/impact/aquaticlife-answer',
  WATER_TYPE_AQUATICLIFE_TWO: '/water-quality/impact/aquaticlife02',
  WATER_TYPE_AQUATICLIFE_TWO_ANSWER: '/water-quality/impact/aquaticlife-two-answer',
  LOCATION: '/location',
  SUCCESS: '/success',
  EVIDENCE: '/evidence',
  EVIDENCE_ANSWER: '/evidence-answer',
  ANONYMOUS: '/anonymous',
  ANONYMOUS_ANSWER: '/anonymous-answer',
  UPDATES: '/updates',
  UPDATES_ANSWER: '/updates-answer',
  FISHING_LOCATION: '/fishing/location',
  FISHING_LOCATION_ANSWER: '/fishing/location/answer',
  FISHING_REPORTREASON: '/fishing/reportreason',
  FISHING_REPORTREASON_ANSWER: '/fishing/reportreason/answer'
}

const Views = {
  SERVICE_UNAVAILABLE: 'errors/service-unavailable',
  SESSION_TIMED_OUT: 'errors/session-timed-out',
  WELCOME: 'welcome',
  INCIDENT_TYPE: 'incident-type',
  WATER_TYPE: 'water-quality/watertype',
  LOCATION: 'location',
  SUCCESS: 'success',
  EVIDENCE: 'evidence',
  ANONYMOUS: 'anonymous',
  UPDATES: 'updates',
  WATER_TYPE_LOCATION: 'water-quality/location',
  WATER_TYPE_SUBSTANCE: 'water-quality/substance',
  WATER_TYPE_APPEARANCE: 'water-quality/appearance',
  WATER_TYPE_SOURCE: 'water-quality/source',
  WATER_TYPE_EXTENT: 'water-quality/extent',
  WATER_TYPE_EXTENT_TWO: 'water-quality/extent02',
  WATER_TYPE_AQUATICLIFE: 'water-quality/impact/aquaticlife',
  WATER_TYPE_AQUATICLIFE_TWO: 'water-quality/impact/aquaticlife02',
  FISHING_LOCATION: 'fishing/location',
  FISHING_REPORTREASON: 'fishing/reportreason',
  FISHING_CAUGHTORKILLED: 'fishing/caughtorkilled',
  FISHING_EQUIPMENT: 'fishing/equipment'
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
