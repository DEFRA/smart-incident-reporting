import constants from '../../../utils/constants.js'

describe('pests/confirm-site', () => {
  it('Should call createConfirmSiteRoutes with correct config', () => {
    const createConfirmSiteRoutes = jest.fn()
    jest.isolateModules(() => {
      jest.doMock('../../rars/confirm-site.js', () => ({
        __esModule: true,
        default: createConfirmSiteRoutes
      }))
      require('../../pests/confirm-site.js')
    })
    expect(createConfirmSiteRoutes).toHaveBeenCalledTimes(1)
    expect(createConfirmSiteRoutes).toHaveBeenCalledWith({
      problem: 'vermin/pests',
      route: constants.routes.PESTS_CONFIRM_SITE,
      redirect: {
        chooseSite: constants.routes.PESTS_CHOOSE_SITE,
        sourceDetails: constants.routes.PESTS_SOURCE_DETAILS,
        recurring: constants.routes.PESTS_RECURRING
      }
    })
  })
})
