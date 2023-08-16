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
  INCIDENT_TYPE_ANSWER: '/incident-type/incident-type',
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
  FISHING_REPORTREASON_ANSWER: '/fishing/reportreason/answer',
  FISHING_EQUIPMENT: '/fishing/equipment',
  FISHING_EQUIPMENT_ANSWER: '/fishing/equipment/answer',
  FISHING_CAUGHTORKILLED: '/fishing/caughtorkilled',
  FISHING_CAUGHTORKILLED_ANSWER: '/fishing/caughtorkilled/answer',
  FISHING_TYPE_OF_FISH: '/fishing/typeoffish',
  FISHING_TYPE_OF_FISH_ANSWER: '/fishing/typeoffish/answer',
  FISHING_NUMBER_OF_FISH: '/fishing/numberoffish',
  FISHING_NUMBER_OF_FISH_ANSWER: '/fishing/numberoffish/answer',
  FISHING_NUMBER_OF_ANGLERS: '/fishing/numberofanglers',
  FISHING_NUMBER_OF_ANGLERS_ANSWER: '/fishing/numberofanglers/answer',
  FISHING_CURRENT: '/fishing/current',
  FISHING_CURRENT_ANSWER: '/fishing/current/answer',
  FISHING_OTHERINFO: '/fishing/otherinfo',
  FISHING_OTHERINFO_ANSWER: '/fishing/otherinfo/answer',
  FISHING_WHEN: '/fishing/when',
  FISHING_WHEN_ANSWER: '/fishing/when/answer'
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
  FISHING_EQUIPMENT: 'fishing/equipment',
  FISHING_TYPE_OF_FISH: 'fishing/type-of-fish',
  FISHING_NUMBER_OF_FISH: 'fishing/number-of-fish',
  FISHING_NUMBER_OF_ANGLERS: 'fishing/number-of-anglers',
  FISHING_CURRENT: 'fishing/current',
  FISHING_OTHERINFO: 'fishing/otherinfo',
  FISHING_WHEN: 'fishing/when'
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

const RedisKeys = {
  INCIDENT_TYPE: 'incidentType.incident-type',
  FISHING_LOCATION_PAYLOAD: 'fishing-location.payload',
  FISHING_REPORTREASON_PAYLOAD: 'fishing-reportreason.payload',
  FISHING_CAUGHTORKILLED_PAYLOAD: 'fishing-caughtorkilled.payload',
  FISHING_TYPEOFFISH_PAYLOAD: 'fishing-typeoffish.payload',
  FISHING_NUMBEROFANGLERS_PAYLOAD: 'fishing-numberofanglers.payload',
  FISHING_NUMBEROFFISH_PAYLOAD: 'fishing-numberoffish.payload',
  FISHING_CURRENT_PAYLOAD: 'fishing-current.payload',
  FISHING_OTHERINFO_PAYLOAD: 'fishing-otherinfo.payload',
  ANONYMOUS_PAYLOAD: 'anonymous.payload',
  UPDATES_PAYLOAD: 'updates.payload',
  FISHING_EQUIPMENT_PAYLOAD: 'fishing-equipment.payload',
  FISHING_WHEN_PAYLOAD: 'fishing-when.payload'
}

const SirpRedisKeys = {
  INCIDENT_TYPE: 'incidentType.incident-type',
  FISHING_LOCATION_PAYLOAD: 'fishing-location.payload',
  FISHING_INCIDENT_COORDINATES: 'fishing-incident.coordinates.sirp',
  SIRP_FISHING_REPORTREASON_PAYLOAD: 'fishing-reportreason.sirp',
  SIRP_FISHING_CAUGHTORKILLED_PAYLOAD: 'fishing-caughtorkilled.sirp',
  SIRP_FISHING_TYPEOFFISH_PAYLOAD: 'fishing-typeoffish.sirp',
  SIRP_FISHING_NUMBEROFANGLERS_PAYLOAD: 'fishing-numberofanglers.sirp',
  SIRP_FISHING_NUMBEROFFISH_PAYLOAD: 'fishing-numberoffish.sirp',
  SIRP_FISHING_CURRENT_PAYLOAD: 'fishing-current.sirp',
  FISHING_OTHERINFO_PAYLOAD: 'fishing-otherinfo.payload',
  ANONYMOUS_PAYLOAD: 'anonymous.payload',
  UPDATES_PAYLOAD: 'updates.payload',
  SIRP_FISHING_EQUIPMENT_PAYLOAD: 'fishing-equipment.sirp',
  FISHING_WHEN_PAYLOAD: 'fishing-when.payload'
}

module.exports = Object.freeze({
  HOME_URL,
  Paths,
  StatusCodes,
  Urls,
  Views,
  RedisKeys,
  SirpRedisKeys,
  SI_SESSION_KEY: 'SISession'
})
