import constants from '../../../utils/constants.js'

describe('pests/choose-site', () => {
  it('Should call createChooseSiteRoutes with correct config', () => {
    const createChooseSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-site.js', () => ({
        __esModule: true,
        default: createChooseSiteRoutes
      }))
      require('../../pests/choose-site.js')
    })
    expect(createChooseSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseSiteRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_CHOOSE_SITE,
      redirect: {
        changeAddress: constants.routes.PESTS_LOCATION_HOME,
        confirmSite: constants.routes.PESTS_CONFIRM_SITE,
        manualSite: constants.routes.PESTS_SOURCE_DETAILS
      }
    })
  })
})
