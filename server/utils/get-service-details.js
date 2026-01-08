import constants from './constants.js'

const generatePageTitle = serviceName => `${serviceName.charAt(0).toLowerCase()}${serviceName.slice(1)}`

const getServiceDetails = filename => {
  let serviceName = constants.serviceNames.DEFAULT
  let serviceUrl = constants.urls.GOV_UK_SERVICE_HOME

  if (filename.includes(`${constants.routes.WATER_POLLUTION}/`)) {
    serviceName = constants.serviceNames.WATER_POLLUTION
    serviceUrl = constants.urls.GOV_UK_WATER_POLLUTION
  }

  if (filename.includes(`${constants.routes.SMELL}/`)) {
    serviceName = constants.serviceNames.SMELL
    serviceUrl = constants.urls.GOV_UK_SMELL
  }

  if (filename.includes(`${constants.routes.ILLEGAL_FISHING}/`)) {
    serviceName = constants.serviceNames.ILLEGAL_FISHING
    serviceUrl = constants.urls.GOV_UK_ILLEGAL_FISHING
  }

  if (filename.includes(`${constants.routes.BLOCKAGE}/`)) {
    serviceName = constants.serviceNames.BLOCKAGE
    serviceUrl = constants.urls.GOV_UK_BLOCKAGE
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