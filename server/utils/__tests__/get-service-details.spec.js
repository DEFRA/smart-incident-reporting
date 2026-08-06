import getServiceDetails from '../get-service-details.js'
import constants from '../constants.js'

const generatePageTitle = serviceName => `${serviceName.charAt(0).toLowerCase()}${serviceName.slice(1)}`

describe('get-service-details', () => {
  beforeAll(() => {
    process.env.REGISTER_START_ROUTES = 'false'
  })

  afterAll(() => {
    process.env.REGISTER_START_ROUTES = 'true'
  })

  it('returns default service details when no template is provided', () => {
    const details = getServiceDetails()
    expect(details).toEqual({
      serviceName: constants.serviceNames.DEFAULT,
      serviceUrl: constants.urls.GOV_UK_SERVICE_HOME,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.DEFAULT)
    })
  })

  it('returns default service details for non-specific journey template', () => {
    const details = getServiceDetails('some/other/template')
    expect(details).toEqual({
      serviceName: constants.serviceNames.DEFAULT,
      serviceUrl: constants.urls.GOV_UK_SERVICE_HOME,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.DEFAULT)
    })
  })

  it('returns water pollution service details for water pollution journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.WATER_POLLUTION}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.WATER_POLLUTION,
      serviceUrl: constants.urls.GOV_UK_WATER_POLLUTION,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.WATER_POLLUTION)
    })
  })

  it('returns blockage service details for blockage journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.BLOCKAGE}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.BLOCKAGE,
      serviceUrl: constants.urls.GOV_UK_BLOCKAGE,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.BLOCKAGE)
    })
  })

  it('returns illegal fishing service details for illegal fishing journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.ILLEGAL_FISHING}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.ILLEGAL_FISHING,
      serviceUrl: constants.urls.GOV_UK_ILLEGAL_FISHING,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.ILLEGAL_FISHING)
    })
  })

  it('returns smell service details for smell journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.SMELL}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.SMELL,
      serviceUrl: constants.urls.GOV_UK_SMELL,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.SMELL)
    })
  })

  it('returns dust service details for dust journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.DUST}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.DUST,
      serviceUrl: constants.urls.GOV_UK_DUST,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.DUST)
    })
  })

  it('returns litter service details for litter journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.LITTER}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.LITTER,
      serviceUrl: constants.urls.GOV_UK_LITTER,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.LITTER)
    })
  })

  it('returns noise service details for noise journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.NOISE}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.NOISE,
      serviceUrl: constants.urls.GOV_UK_NOISE,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.NOISE)
    })
  })

  it('returns mud service details for mud journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.MUD}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.MUD,
      serviceUrl: constants.urls.GOV_UK_MUD,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.MUD)
    })
  })

  it('returns vermin service details for vermin journey template', () => {
    const details = getServiceDetails(`root/${constants.routes.VERMIN}/template`)
    expect(details).toEqual({
      serviceName: constants.serviceNames.VERMIN,
      serviceUrl: constants.urls.GOV_UK_VERMIN,
      pageTitleServiceName: generatePageTitle(constants.serviceNames.VERMIN)
    })
  })
})
