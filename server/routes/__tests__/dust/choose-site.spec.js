import constants from '../../../utils/constants.js'

describe('dust/choose-site', () => {
  it('Should call createChooseSiteRoutes with correct config', () => {
    const createChooseSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-site.js', () => ({
        __esModule: true,
        default: createChooseSiteRoutes
      }))
      require('../../dust/choose-site.js')
    })
    expect(createChooseSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseSiteRoutes).toHaveBeenCalledWith({
      problem: 'dust',
      route: constants.routes.DUST_CHOOSE_SITE,
      redirect: {
        changeAddress: constants.routes.DUST_LOCATION_HOME,
        confirmSite: constants.routes.DUST_CONFIRM_SITE,
        manualSite: constants.routes.DUST_SOURCE_DETAILS
      }
    })
  })
})
