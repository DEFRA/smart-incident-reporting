import constants from '../../../utils/constants.js'

describe('smell/choose-site', () => {
  it('Should call createChooseSiteRoutes with correct config', () => {
    const createChooseSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-site.js', () => ({
        __esModule: true,
        default: createChooseSiteRoutes
      }))
      require('../../smell/choose-site.js')
    })
    expect(createChooseSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseSiteRoutes).toHaveBeenCalledWith({
      problem: 'smell',
      route: constants.routes.SMELL_CHOOSE_SITE,
      redirect: {
        changeAddress: constants.routes.SMELL_LOCATION_HOME,
        confirmSite: constants.routes.SMELL_CONFIRM_SITE,
        manualSite: constants.routes.SMELL_SOURCE_DETAILS
      }
    })
  })
})
