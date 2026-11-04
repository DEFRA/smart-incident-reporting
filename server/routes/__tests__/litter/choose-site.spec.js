import constants from '../../../utils/constants.js'

describe('litter/choose-site', () => {
  it('Should call createChooseSiteRoutes with correct config', () => {
    const createChooseSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-site.js', () => ({
        __esModule: true,
        default: createChooseSiteRoutes
      }))
      require('../../litter/choose-site.js')
    })
    expect(createChooseSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseSiteRoutes).toHaveBeenCalledWith({
      problem: 'litter',
      route: constants.routes.LITTER_CHOOSE_SITE,
      redirect: {
        changeAddress: constants.routes.LITTER_LOCATION_HOME,
        confirmSite: constants.routes.LITTER_CONFIRM_SITE,
        manualSite: constants.routes.LITTER_SOURCE_DETAILS
      }
    })
  })
})
