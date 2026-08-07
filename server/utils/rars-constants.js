const NOISE = 'noise'
const LITTER = 'litter'
const VERMIN = 'vermin'
const DUST = 'dust'
const MUD = 'mud'
const SMELL = 'smell'

const rarsJourneys = [
  NOISE,
  LITTER,
  VERMIN,
  DUST,
  MUD,
  SMELL
]

const RARS_SOURCE = 'rars/source'
const RARS_SOURCE_DETAILS = 'rars/source-details'
const RARS_CONTACT_ENVIRONMENT_AGENCY = 'rars/contact-environment-agency'
const RARS_REPORT_LOCAL_COUNCIL = 'rars/report-local-council'
const RARS_FIND_ADDRESS = 'rars/find-address'
const RARS_LOCATION_HOME = 'rars/location-home'
const RARS_LOCATION_OPTION = 'rars/location-option'

const views = {
  RARS_SOURCE,
  RARS_SOURCE_DETAILS,
  RARS_CONTACT_ENVIRONMENT_AGENCY,
  RARS_REPORT_LOCAL_COUNCIL,
  RARS_FIND_ADDRESS,
  RARS_LOCATION_HOME,
  RARS_LOCATION_OPTION
}

const redisKeys = {
  ...views
}

const routes = {
  NOISE: `/${NOISE}`,
  LITTER: `/${LITTER}`,
  VERMIN: `/${VERMIN}`,
  DUST: `/${DUST}`,
  MUD: `/${MUD}`,
  SMELL: `/${SMELL}`
}

for (const [key, value] of Object.entries(views)) {
  for (const journey of rarsJourneys) {
    const route = value.replace('rars', journey)
    const routeKey = key.replace('RARS', journey.toUpperCase())
    routes[routeKey] = `/${route}`
  }
}

export default {
  views,
  redisKeys,
  routes
}
