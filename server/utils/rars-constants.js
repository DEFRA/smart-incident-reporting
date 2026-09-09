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
const RARS_LOCATION_HOME = 'rars/location-home'
const RARS_CONTACT_LOCAL_COUNCIL = 'rars/contact-local-council'
const RARS_FIND_ADDRESS = 'rars/find-address'
const RARS_CHOOSE_ADDRESS = 'rars/choose-address'
const RARS_CONFIRM_ADDRESS = 'rars/confirm-address'
const RARS_EXCEEDED_ATTEMPTS = 'rars/exceeded-attempts'
const RARS_LOCATION_ADDRESS = 'rars/location-address'
const RARS_LOCATION_OPTION = 'rars/location-option'
const RARS_LOCATION_MAP = 'rars/location-map'
const RARS_LOCATION_DESCRIPTION = 'rars/location-description'
const RARS_LOCATION_DESCRIPTION_OPTIONAL = 'rars/location-description-optional'
const RARS_DESCRIPTION = 'rars/description'
const RARS_RECURRING = 'rars/recurring'
const RARS_WHEN = 'rars/when'
const RARS_EARLIER_TODAY = 'rars/earlier-today'
const RARS_YESTERDAY = 'rars/yesterday'
const RARS_DATE_BEFORE_YESTERDAY = 'rars/date-before-yesterday'
const RARS_TIME_BEFORE_YESTERDAY = 'rars/time-before-yesterday'
const RARS_WHEN_WORSE = 'rars/when-worse'
const RARS_DAYS_WHEN_WORSE = 'rars/days-when-worse'
const RARS_EFFECT_ON_DAILY_LIFE = 'vermin/effect-on-daily-life'

const views = {
  RARS_SOURCE,
  RARS_SOURCE_DETAILS,
  RARS_CONTACT_ENVIRONMENT_AGENCY,
  RARS_REPORT_LOCAL_COUNCIL,
  RARS_LOCATION_HOME,
  RARS_CONTACT_LOCAL_COUNCIL,
  RARS_FIND_ADDRESS,
  RARS_CHOOSE_ADDRESS,
  RARS_CONFIRM_ADDRESS,
  RARS_EXCEEDED_ATTEMPTS,
  RARS_LOCATION_ADDRESS,
  RARS_LOCATION_OPTION,
  RARS_LOCATION_MAP,
  RARS_LOCATION_DESCRIPTION,
  RARS_LOCATION_DESCRIPTION_OPTIONAL,
  RARS_DESCRIPTION,
  RARS_RECURRING,
  RARS_WHEN,
  RARS_EARLIER_TODAY,
  RARS_YESTERDAY,
  RARS_DATE_BEFORE_YESTERDAY,
  RARS_TIME_BEFORE_YESTERDAY,
  RARS_WHEN_WORSE,
  RARS_DAYS_WHEN_WORSE,
  RARS_EFFECT_ON_DAILY_LIFE
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

// journeys that don't have a route file for a given view, so must be excluded from generation
const journeyExclusions = {
  vermin: ['RARS_DESCRIPTION', 'RARS_DAYS_WHEN_WORSE'],
  smell: ['RARS_DESCRIPTION', 'RARS_WHEN_WORSE', 'RARS_DAYS_WHEN_WORSE']
}

for (const [key, value] of Object.entries(views)) {
  if (key === 'RARS_EFFECT_ON_DAILY_LIFE') {
    continue
  }
  for (const journey of rarsJourneys) {
    if (journeyExclusions[journey]?.includes(key)) {
      continue
    }
    const route = value.replace('rars', journey)
    const routeKey = key.replace('RARS', journey.toUpperCase())
    routes[routeKey] = `/${route}`
  }
}

routes.RARS_EFFECT_ON_DAILY_LIFE = `/${RARS_EFFECT_ON_DAILY_LIFE.replace('rars', VERMIN)}`

export default {
  views,
  redisKeys,
  routes
}
