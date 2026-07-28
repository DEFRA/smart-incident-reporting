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

const views = {
  RARS_SOURCE
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
