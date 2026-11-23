import constants from '../../../utils/constants.js'

describe('noise/confirm-site', () => {
  it('Should call createConfirmSiteRoutes with correct config', () => {
    const createConfirmSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-site.js', () => ({
        __esModule: true,
        default: createConfirmSiteRoutes
      }))
      require('../../noise/confirm-site.js')
    })
    expect(createConfirmSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmSiteRoutes).toHaveBeenCalledWith({
      problem: 'noise',
      route: constants.routes.NOISE_CONFIRM_SITE
    })
  })
})
