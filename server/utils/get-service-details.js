import constants from './constants.js'

const generatePageTitle = serviceName => `${serviceName.charAt(0).toLowerCase()}${serviceName.slice(1)}`

const routeServiceMap = [
  { route: constants.routes.WATER_POLLUTION, name: constants.serviceNames.WATER_POLLUTION, url: constants.urls.GOV_UK_WATER_POLLUTION },
  { route: constants.routes.SMELL, name: constants.serviceNames.SMELL, url: constants.urls.GOV_UK_SMELL },
  { route: constants.routes.ILLEGAL_FISHING, name: constants.serviceNames.ILLEGAL_FISHING, url: constants.urls.GOV_UK_ILLEGAL_FISHING },
  { route: constants.routes.BLOCKAGE, name: constants.serviceNames.BLOCKAGE, url: constants.urls.GOV_UK_BLOCKAGE },
  { route: constants.routes.NOISE, name: constants.serviceNames.NOISE, url: constants.urls.GOV_UK_NOISE },
  { route: constants.routes.LITTER, name: constants.serviceNames.LITTER, url: constants.urls.GOV_UK_LITTER },
  { route: constants.routes.VERMIN, name: constants.serviceNames.VERMIN, url: constants.urls.GOV_UK_VERMIN },
  { route: constants.routes.DUST, name: constants.serviceNames.DUST, url: constants.urls.GOV_UK_DUST },
  { route: constants.routes.MUD, name: constants.serviceNames.MUD, url: constants.urls.GOV_UK_MUD }
]

const getServiceDetails = (filename = '') => {
  let serviceName = constants.serviceNames.DEFAULT
  let serviceUrl = constants.urls.GOV_UK_SERVICE_HOME

  const match = routeServiceMap.find(entry => filename.includes(`${entry.route}/`))
  if (match) {
    serviceName = match.name
    serviceUrl = match.url
  }

  if (process.env.REGISTER_START_ROUTES === 'true') {
    serviceUrl = '/'
  }

  return {
    serviceName,
    serviceUrl,
    pageTitleServiceName: generatePageTitle(serviceName)
  }
}

export default getServiceDetails
