import constants from '../../../utils/constants.js'

describe('noise/choose-site', () => {
  it('Should call createChooseSiteRoutes with correct config', () => {
    const createChooseSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/choose-site.js', () => ({
        __esModule: true,
        default: createChooseSiteRoutes
      }))
      require('../../noise/choose-site.js')
    })
    expect(createChooseSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createChooseSiteRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_CHOOSE_SITE,
      redirect: {
        changeAddress: constants.routes.NOISE_LOCATION_HOME,
        confirmSite: constants.routes.NOISE_CONFIRM_SITE,
        manualSite: constants.routes.NOISE_SOURCE_DETAILS
      }
    })
  })
})
